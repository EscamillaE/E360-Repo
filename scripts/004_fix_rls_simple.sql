-- Simple fix for RLS infinite recursion
-- Drop problematic policies on profiles table and create simple ones

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_insert" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Create simple non-recursive policies
CREATE POLICY "profiles_public_read" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_self_update" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_self_insert" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix gallery_media policies
DROP POLICY IF EXISTS "gallery_media_public_read" ON public.gallery_media;
DROP POLICY IF EXISTS "gallery_media_admin_insert" ON public.gallery_media;
DROP POLICY IF EXISTS "gallery_media_admin_update" ON public.gallery_media;
DROP POLICY IF EXISTS "gallery_media_admin_delete" ON public.gallery_media;
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery_media;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery_media;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery_media;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery_media;

-- Simple gallery read policy - no profile lookup needed
CREATE POLICY "gallery_media_public_read" ON public.gallery_media 
  FOR SELECT USING (true);

-- Simple admin policies for gallery - use direct role check from profiles without recursion
CREATE POLICY "gallery_media_admin_insert" ON public.gallery_media 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "gallery_media_admin_update" ON public.gallery_media 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "gallery_media_admin_delete" ON public.gallery_media 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );
