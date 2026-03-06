'use server'

import { createClient } from '@/lib/supabase/server'

export interface Category {
  id: string
  name_es: string
  name_en: string
  slug: string
  icon: string | null
  sort_order: number
}

export interface CatalogItem {
  id: string
  category_id: string
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  price: number
  image_url: string | null
  specs: Record<string, unknown> | null
  is_popular: boolean
  is_active: boolean
}

export interface CategoryWithItems extends Category {
  items: CatalogItem[]
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data || []
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('is_active', true)
    .order('name_es', { ascending: true })
  
  if (error) {
    console.error('Error fetching catalog items:', error)
    return []
  }
  
  return data || []
}

export async function getCategoriesWithItems(): Promise<CategoryWithItems[]> {
  const [categories, items] = await Promise.all([
    getCategories(),
    getCatalogItems()
  ])
  
  return categories.map(category => ({
    ...category,
    items: items.filter(item => item.category_id === category.id)
  }))
}

export async function getPopularItems(): Promise<CatalogItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('is_active', true)
    .eq('is_popular', true)
    .order('name_es', { ascending: true })
  
  if (error) {
    console.error('Error fetching popular items:', error)
    return []
  }
  
  return data || []
}

export async function searchCatalogItems(query: string): Promise<CatalogItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('is_active', true)
    .or(`name_es.ilike.%${query}%,name_en.ilike.%${query}%,description_es.ilike.%${query}%,description_en.ilike.%${query}%`)
    .order('name_es', { ascending: true })
  
  if (error) {
    console.error('Error searching catalog items:', error)
    return []
  }
  
  return data || []
}
