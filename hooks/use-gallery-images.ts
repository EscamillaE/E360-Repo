import { useEffect, useState } from "react"
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

export function useGalleryImages(productName: string, locale: string = "es") {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const { data: catalogItems, error: catalogError } = await supabase
          .from("catalog_items")
          .select("id")
          .or(`name_es.ilike.%${productName}%,name_en.ilike.%${productName}%`)
          .limit(1)
          .single()

        if (catalogError || !catalogItems) {
          setError("Product not found")
          setImages([])
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

    if (productName) {
      fetchImages()
    }
  }, [productName, locale])

  return { images, loading, error }
}
