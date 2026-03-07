"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@supabase/supabase-js"

interface GalleryImage {
  id: string
  url: string
  title_es?: string
  title_en?: string
  description_es?: string
  description_en?: string
  sort_order: number
}

// Create supabase client lazily to avoid SSR issues
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export function useGalleryImages(productName: string) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => getSupabaseClient(), [])

  useEffect(() => {
    if (!supabase || !productName) {
      setLoading(false)
      setImages([])
      return
    }

    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: catalogItems, error: catalogError } = await supabase
          .from("catalog_items")
          .select("id")
          .or(`name_es.ilike.%${productName}%,name_en.ilike.%${productName}%`)
          .limit(1)
          .single()

        if (catalogError || !catalogItems) {
          // Product not found is not an error - just no gallery images
          setImages([])
          setLoading(false)
          return
        }

        const { data, error: galleryError } = await supabase
          .from("gallery_media")
          .select("*")
          .eq("catalog_item_id", catalogItems.id)
          .order("sort_order", { ascending: true })

        if (galleryError) {
          setError(galleryError.message)
          setImages([])
        } else {
          setImages(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery")
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [productName, supabase])

  return { images, loading, error }
}
