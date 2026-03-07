"use client"

import { useState, useRef } from "react"
import { X, Upload, Trash2, GripVertical, Plus, Loader2, Eye, EyeOff } from "lucide-react"
import { useApp } from "@/components/providers"

interface MediaItem {
  id: string
  title_es: string | null
  title_en: string | null
  description_es: string | null
  description_en: string | null
  url: string
  media_type: "video" | "image"
  thumbnail_url: string | null
  is_featured: boolean
  sort_order: number
}

interface GalleryEditModalProps {
  isOpen: boolean
  onClose: () => void
  mediaItems: MediaItem[]
  onUpdate: () => void
}

export function GalleryEditModal({ isOpen, onClose, mediaItems, onUpdate }: GalleryEditModalProps) {
  const { locale } = useApp()
  const [items, setItems] = useState<MediaItem[]>(mediaItems)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = {
    es: {
      title: "Editar Galeria",
      addMedia: "Agregar Media",
      upload: "Subir archivo",
      uploading: "Subiendo...",
      save: "Guardar",
      saving: "Guardando...",
      cancel: "Cancelar",
      delete: "Eliminar",
      titleEs: "Titulo (Espanol)",
      titleEn: "Titulo (Ingles)",
      descEs: "Descripcion (Espanol)",
      descEn: "Descripcion (Ingles)",
      featured: "Destacado",
      dragToReorder: "Arrastra para reordenar",
      noMedia: "No hay media en la galeria",
      addFirst: "Agrega tu primer video o imagen",
      edit: "Editar",
      confirmDelete: "Estas seguro que deseas eliminar este elemento?",
    },
    en: {
      title: "Edit Gallery",
      addMedia: "Add Media",
      upload: "Upload file",
      uploading: "Uploading...",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      delete: "Delete",
      titleEs: "Title (Spanish)",
      titleEn: "Title (English)",
      descEs: "Description (Spanish)",
      descEn: "Description (English)",
      featured: "Featured",
      dragToReorder: "Drag to reorder",
      noMedia: "No media in gallery",
      addFirst: "Add your first video or image",
      edit: "Edit",
      confirmDelete: "Are you sure you want to delete this item?",
    },
  }[locale]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const data = await uploadRes.json()
        throw new Error(data.error || "Upload failed")
      }

      const { url, type } = await uploadRes.json()

      // Create new gallery item
      const newItem = {
        title_es: "",
        title_en: "",
        description_es: "",
        description_en: "",
        url,
        media_type: type,
        thumbnail_url: null,
        is_featured: false,
        sort_order: items.length,
      }

      const createRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })

      if (!createRes.ok) {
        throw new Error("Failed to save gallery item")
      }

      const { media } = await createRes.json()
      setItems([...items, media])
      setEditingItem(media)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSaveItem = async () => {
    if (!editingItem) return

    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/gallery/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      })

      if (!res.ok) {
        throw new Error("Failed to save")
      }

      setItems(items.map((item) => (item.id === editingItem.id ? editingItem : item)))
      setEditingItem(null)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm(t.confirmDelete)) return

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete")
      }

      setItems(items.filter((item) => item.id !== id))
      if (editingItem?.id === id) {
        setEditingItem(null)
      }
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const handleReorder = async (dragIndex: number, dropIndex: number) => {
    const newItems = [...items]
    const [draggedItem] = newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    // Update sort_order for all items
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      sort_order: index,
    }))

    setItems(updatedItems)

    // Save new order to database
    for (const item of updatedItems) {
      await fetch(`/api/gallery/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item }),
      })
    }
    onUpdate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex max-h-[calc(90vh-8rem)] overflow-hidden">
          {/* Media list */}
          <div className="w-1/2 overflow-y-auto border-r border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{t.dragToReorder}</p>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {isUploading ? t.uploading : t.addMedia}
                </label>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                  <Upload className="h-6 w-6 text-gold" />
                </div>
                <p className="text-sm font-medium text-foreground">{t.noMedia}</p>
                <p className="text-xs text-muted-foreground">{t.addFirst}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("index", index.toString())}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const dragIndex = parseInt(e.dataTransfer.getData("index"))
                      handleReorder(dragIndex, index)
                    }}
                    className={`group flex cursor-grab items-center gap-3 rounded-lg border p-2 transition-colors active:cursor-grabbing ${
                      editingItem?.id === item.id
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-border/80 hover:bg-secondary/30"
                    }`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {item.media_type === "video" ? (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title_es || ""}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {locale === "es" ? item.title_es || "Sin titulo" : item.title_en || "No title"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.media_type === "video" ? "Video" : "Imagen"}
                        {item.is_featured && " • Destacado"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit panel */}
          <div className="w-1/2 overflow-y-auto p-4">
            {editingItem ? (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative aspect-[9/16] max-h-48 overflow-hidden rounded-lg bg-secondary">
                  {editingItem.media_type === "video" ? (
                    <video
                      src={editingItem.url}
                      className="h-full w-full object-cover"
                      controls
                      muted
                    />
                  ) : (
                    <img
                      src={editingItem.url}
                      alt={editingItem.title_es || ""}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Title Spanish */}
                <div className="space-y-1.5">
                  <label htmlFor="title_es" className="text-xs font-medium text-foreground">
                    {t.titleEs}
                  </label>
                  <input
                    id="title_es"
                    value={editingItem.title_es || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title_es: e.target.value })
                    }
                    placeholder="Titulo en espanol"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Title English */}
                <div className="space-y-1.5">
                  <label htmlFor="title_en" className="text-xs font-medium text-foreground">
                    {t.titleEn}
                  </label>
                  <input
                    id="title_en"
                    value={editingItem.title_en || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title_en: e.target.value })
                    }
                    placeholder="Title in English"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Description Spanish */}
                <div className="space-y-1.5">
                  <label htmlFor="desc_es" className="text-xs font-medium text-foreground">
                    {t.descEs}
                  </label>
                  <textarea
                    id="desc_es"
                    value={editingItem.description_es || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description_es: e.target.value })
                    }
                    placeholder="Descripcion en espanol"
                    className="min-h-[60px] w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Description English */}
                <div className="space-y-1.5">
                  <label htmlFor="desc_en" className="text-xs font-medium text-foreground">
                    {t.descEn}
                  </label>
                  <textarea
                    id="desc_en"
                    value={editingItem.description_en || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description_en: e.target.value })
                    }
                    placeholder="Description in English"
                    className="min-h-[60px] w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Featured toggle */}
                <label className="flex cursor-pointer items-center gap-3">
                  <div
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      editingItem.is_featured ? "bg-gold" : "bg-secondary"
                    }`}
                    onClick={() =>
                      setEditingItem({
                        ...editingItem,
                        is_featured: !editingItem.is_featured,
                      })
                    }
                  >
                    <div
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        editingItem.is_featured ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm text-foreground">{t.featured}</span>
                </label>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSaveItem}
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t.saving}
                      </>
                    ) : (
                      t.save
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <EyeOff className="mb-4 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {locale === "es"
                    ? "Selecciona un elemento para editar"
                    : "Select an item to edit"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
