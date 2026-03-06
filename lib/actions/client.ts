'use server'

import { createClient } from '@/lib/supabase/server'

export interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  role: 'client' | 'admin'
  created_at: string
}

export interface ClientQuote {
  id: string
  event_name: string
  event_date: string | null
  event_type: string | null
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  total: number
  created_at: string
  items: {
    id: string
    name: string
    quantity: number
    total_price: number
  }[]
}

export interface ClientEvent {
  id: string
  name: string
  event_date: string
  event_time: string | null
  venue: string | null
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  notes: string | null
}

export interface ClientFavorite {
  id: string
  catalog_item: {
    id: string
    name_es: string
    name_en: string
    price: number
    image_url: string | null
  }
}

export async function getCurrentUser(): Promise<{ user: { id: string; email: string } | null; profile: UserProfile | null }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { user: null, profile: null }
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { 
    user: { id: user.id, email: user.email || '' }, 
    profile 
  }
}

export async function updateUserProfile(data: { full_name?: string; phone?: string }): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'No autenticado' }
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      phone: data.phone,
    })
    .eq('id', user.id)
  
  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Error al actualizar perfil' }
  }
  
  return { success: true }
}

export async function getClientQuotes(): Promise<ClientQuote[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
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
      quote_items (
        id,
        name,
        quantity,
        total_price
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching client quotes:', error)
    return []
  }
  
  return (quotes || []).map(quote => ({
    ...quote,
    items: quote.quote_items || []
  }))
}

export async function getClientEvents(): Promise<ClientEvent[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('event_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching client events:', error)
    return []
  }
  
  return events || []
}

export async function getClientFavorites(): Promise<ClientFavorite[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(`
      id,
      catalog_items (
        id,
        name_es,
        name_en,
        price,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching client favorites:', error)
    return []
  }
  
  return (favorites || []).map(fav => ({
    id: fav.id,
    catalog_item: fav.catalog_items as unknown as ClientFavorite['catalog_item']
  }))
}

export async function addFavorite(catalogItemId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'No autenticado' }
  }
  
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      catalog_item_id: catalogItemId,
    })
  
  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Ya esta en favoritos' }
    }
    console.error('Error adding favorite:', error)
    return { success: false, error: 'Error al agregar favorito' }
  }
  
  return { success: true }
}

export async function removeFavorite(favoriteId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId)
  
  if (error) {
    console.error('Error removing favorite:', error)
    return { success: false, error: 'Error al eliminar favorito' }
  }
  
  return { success: true }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
