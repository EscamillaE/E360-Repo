'use server'

import { createClient } from '@/lib/supabase/server'

export interface QuoteItem {
  id?: string
  catalog_item_id: string | null
  name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Quote {
  id: string
  user_id: string | null
  event_name: string
  event_date: string | null
  event_type: string | null
  guest_count: number | null
  venue: string | null
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  subtotal: number
  discount_percent: number
  total: number
  notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[]
}

export interface CreateQuoteInput {
  event_name: string
  event_date?: string | null
  event_type?: string | null
  guest_count?: number | null
  venue?: string | null
  notes?: string | null
  items: {
    catalog_item_id: string | null
    name: string
    quantity: number
    unit_price: number
  }[]
}

export async function createQuote(input: CreateQuoteInput): Promise<{ success: boolean; quote?: Quote; error?: string }> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Debes iniciar sesion para guardar cotizaciones' }
  }
  
  // Calculate totals
  const subtotal = input.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  const total = subtotal // No discount for now
  
  // Create quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      user_id: user.id,
      event_name: input.event_name,
      event_date: input.event_date || null,
      event_type: input.event_type || null,
      guest_count: input.guest_count || null,
      venue: input.venue || null,
      notes: input.notes || null,
      status: 'draft',
      subtotal,
      discount_percent: 0,
      total,
    })
    .select()
    .single()
  
  if (quoteError || !quote) {
    console.error('Error creating quote:', quoteError)
    return { success: false, error: 'Error al crear la cotizacion' }
  }
  
  // Create quote items
  const quoteItems = input.items.map(item => ({
    quote_id: quote.id,
    catalog_item_id: item.catalog_item_id,
    name: item.name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.unit_price * item.quantity,
  }))
  
  const { error: itemsError } = await supabase
    .from('quote_items')
    .insert(quoteItems)
  
  if (itemsError) {
    console.error('Error creating quote items:', itemsError)
    // Still return success since quote was created
  }
  
  return { success: true, quote }
}

export async function getUserQuotes(): Promise<QuoteWithItems[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user quotes:', error)
    return []
  }
  
  return (quotes || []).map(quote => ({
    ...quote,
    items: quote.quote_items || []
  }))
}

export async function getQuoteById(id: string): Promise<QuoteWithItems | null> {
  const supabase = await createClient()
  
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .eq('id', id)
    .single()
  
  if (error || !quote) {
    console.error('Error fetching quote:', error)
    return null
  }
  
  return {
    ...quote,
    items: quote.quote_items || []
  }
}

export async function submitQuoteForReview(quoteId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('quotes')
    .update({ status: 'pending', updated_at: new Date().toISOString() })
    .eq('id', quoteId)
  
  if (error) {
    console.error('Error submitting quote:', error)
    return { success: false, error: 'Error al enviar la cotizacion' }
  }
  
  return { success: true }
}
