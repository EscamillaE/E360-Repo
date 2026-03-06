'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AdminStats {
  totalQuotes: number
  quotesThisMonth: number
  totalRevenue: number
  revenueThisMonth: number
  upcomingEvents: number
  totalClients: number
}

export interface AdminQuote {
  id: string
  event_name: string
  event_date: string | null
  event_type: string | null
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  total: number
  created_at: string
  user_id: string | null
  profile: {
    full_name: string | null
  } | null
}

export interface AdminClient {
  id: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
  email: string
  quote_count: number
  total_spent: number
}

export interface AdminCatalogItem {
  id: string
  category_id: string
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  price: number
  image_url: string | null
  is_popular: boolean
  is_active: boolean
  category: {
    name_es: string
    name_en: string
  } | null
}

export async function verifyAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

export async function requireAdmin() {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    redirect('/auth/login?redirectTo=/admin')
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  
  // Get quotes stats
  const { count: totalQuotes } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
  
  const { count: quotesThisMonth } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstOfMonth)
  
  // Get revenue (from approved quotes)
  const { data: allRevenue } = await supabase
    .from('quotes')
    .select('total')
    .eq('status', 'approved')
  
  const { data: monthRevenue } = await supabase
    .from('quotes')
    .select('total')
    .eq('status', 'approved')
    .gte('created_at', firstOfMonth)
  
  // Get events
  const { count: upcomingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'upcoming')
  
  // Get clients
  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')
  
  return {
    totalQuotes: totalQuotes || 0,
    quotesThisMonth: quotesThisMonth || 0,
    totalRevenue: allRevenue?.reduce((sum, q) => sum + Number(q.total), 0) || 0,
    revenueThisMonth: monthRevenue?.reduce((sum, q) => sum + Number(q.total), 0) || 0,
    upcomingEvents: upcomingEvents || 0,
    totalClients: totalClients || 0,
  }
}

export async function getAdminQuotes(): Promise<AdminQuote[]> {
  const supabase = await createClient()
  
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select(`
      id,
      event_name,
      event_date,
      event_type,
      status,
      total,
      created_at,
      user_id,
      profiles!quotes_user_id_fkey (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) {
    console.error('Error fetching admin quotes:', error)
    return []
  }
  
  return (quotes || []).map(q => ({
    ...q,
    profile: q.profiles as AdminQuote['profile']
  }))
}

export async function updateQuoteStatus(quoteId: string, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('quotes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', quoteId)
  
  if (error) {
    console.error('Error updating quote status:', error)
    return { success: false }
  }
  
  return { success: true }
}

export async function getAdminClients(): Promise<AdminClient[]> {
  const supabase = await createClient()
  
  // Get profiles with quote aggregates
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })
  
  if (error || !profiles) {
    console.error('Error fetching admin clients:', error)
    return []
  }
  
  // Get quotes for each profile to calculate stats
  const clientsWithStats = await Promise.all(
    profiles.map(async (profile) => {
      const { data: quotes } = await supabase
        .from('quotes')
        .select('total, status')
        .eq('user_id', profile.id)
      
      const approvedQuotes = quotes?.filter(q => q.status === 'approved') || []
      
      // Get user email from auth
      const { data: { user } } = await supabase.auth.admin.getUserById(profile.id).catch(() => ({ data: { user: null } }))
      
      return {
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        role: profile.role,
        created_at: profile.created_at,
        email: user?.email || 'N/A',
        quote_count: quotes?.length || 0,
        total_spent: approvedQuotes.reduce((sum, q) => sum + Number(q.total), 0),
      }
    })
  )
  
  return clientsWithStats
}

export async function getAdminCatalog(): Promise<AdminCatalogItem[]> {
  const supabase = await createClient()
  
  const { data: items, error } = await supabase
    .from('catalog_items')
    .select(`
      *,
      categories (
        name_es,
        name_en
      )
    `)
    .order('name_es', { ascending: true })
  
  if (error) {
    console.error('Error fetching admin catalog:', error)
    return []
  }
  
  return (items || []).map(item => ({
    ...item,
    category: item.categories as AdminCatalogItem['category']
  }))
}

export async function updateCatalogItem(
  itemId: string, 
  data: { 
    name_es?: string
    name_en?: string
    description_es?: string
    description_en?: string
    price?: number
    is_popular?: boolean
    is_active?: boolean
  }
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('catalog_items')
    .update(data)
    .eq('id', itemId)
  
  if (error) {
    console.error('Error updating catalog item:', error)
    return { success: false }
  }
  
  return { success: true }
}

export async function deleteCatalogItem(itemId: string): Promise<{ success: boolean }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('catalog_items')
    .delete()
    .eq('id', itemId)
  
  if (error) {
    console.error('Error deleting catalog item:', error)
    return { success: false }
  }
  
  return { success: true }
}

export async function createCatalogItem(data: {
  category_id: string
  name_es: string
  name_en: string
  description_es?: string
  description_en?: string
  price: number
  is_popular?: boolean
}): Promise<{ success: boolean; item?: AdminCatalogItem }> {
  const supabase = await createClient()
  
  const { data: item, error } = await supabase
    .from('catalog_items')
    .insert({
      ...data,
      is_active: true,
    })
    .select(`
      *,
      categories (
        name_es,
        name_en
      )
    `)
    .single()
  
  if (error) {
    console.error('Error creating catalog item:', error)
    return { success: false }
  }
  
  return { 
    success: true, 
    item: {
      ...item,
      category: item.categories as AdminCatalogItem['category']
    }
  }
}
