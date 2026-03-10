-- Fix all RLS policies to avoid infinite recursion
-- The issue is that policies reference the profiles table which has policies that might reference other tables

-- =====================================================
-- STEP 1: Drop ALL existing policies on profiles table
-- =====================================================
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  -- Drop all policies on profiles table
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

-- =====================================================
-- STEP 2: Create profiles table if it doesn't exist
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: Create SIMPLE, NON-RECURSIVE policies for profiles
-- =====================================================
-- Public read - anyone can read all profiles
CREATE POLICY "profiles_public_read" ON public.profiles 
  FOR SELECT USING (true);

-- Self update - users can only update their own profile
CREATE POLICY "profiles_self_update" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Self insert - users can only insert their own profile
CREATE POLICY "profiles_self_insert" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 4: Fix admin_profiles policies (if they exist)
-- =====================================================
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_profiles') THEN
    -- Drop all policies on admin_profiles table
    FOR pol IN 
      SELECT policyname 
      FROM pg_policies 
      WHERE tablename = 'admin_profiles' AND schemaname = 'public'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_profiles', pol.policyname);
    END LOOP;
    
    -- Recreate simple policies
    EXECUTE 'CREATE POLICY "admin_profiles_public_read" ON public.admin_profiles FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "admin_profiles_self_update" ON public.admin_profiles FOR UPDATE USING (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "admin_profiles_self_insert" ON public.admin_profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- =====================================================
-- STEP 5: Fix gallery_media policies - use SECURITY DEFINER function
-- =====================================================
-- Drop existing policies
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'gallery_media' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.gallery_media', pol.policyname);
  END LOOP;
END $$;

-- Create a SECURITY DEFINER function to check admin status
-- This bypasses RLS on the profiles table when checking admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  ) OR EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Gallery media: public read, admin write
CREATE POLICY "gallery_media_public_read" ON public.gallery_media 
  FOR SELECT USING (true);

CREATE POLICY "gallery_media_admin_insert" ON public.gallery_media 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "gallery_media_admin_update" ON public.gallery_media 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "gallery_media_admin_delete" ON public.gallery_media 
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- STEP 6: Fix clients, quotes, events policies
-- =====================================================
-- Drop and recreate clients policies
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'clients' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "clients_read" ON public.clients 
  FOR SELECT USING (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "clients_admin_insert" ON public.clients 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "clients_admin_update" ON public.clients 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "clients_admin_delete" ON public.clients 
  FOR DELETE USING (public.is_admin());

-- Drop and recreate quotes policies
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'quotes' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.quotes', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "quotes_read" ON public.quotes 
  FOR SELECT USING (public.is_admin() OR client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "quotes_admin_insert" ON public.quotes 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "quotes_admin_update" ON public.quotes 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "quotes_admin_delete" ON public.quotes 
  FOR DELETE USING (public.is_admin());

-- Drop and recreate events policies
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'events' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.events', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "events_read" ON public.events 
  FOR SELECT USING (public.is_admin() OR client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "events_admin_insert" ON public.events 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "events_admin_update" ON public.events 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "events_admin_delete" ON public.events 
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- STEP 7: Create trigger for auto profile creation
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
