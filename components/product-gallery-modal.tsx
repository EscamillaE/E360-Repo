"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  url: string
  title?: string
  description?: string
}

interface ProductGalleryModalProps {
  productName: string
  images: GalleryImage[]
  isOpen: boolean
  onClose: () => void
}

export function ProductGalleryModal({
  productName,
  images,
  isOpen,
  onClose,
}: ProductGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  const hasMultiple = images.length > 1

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background text-foreground transition-colors"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main image */}
        <div className="flex-1 relative overflow-hidden rounded-lg">
          <Image
            src={currentImage.url}
            alt={currentImage.title || productName}
            fill
            className="object-contain"
            priority
          />

          {/* Navigation buttons */}
          {hasMultiple && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background text-foreground transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background text-foreground transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Image info and thumbnails */}
        <div className="bg-card border-t border-border p-4">
          {/* Title and description */}
          {(currentImage.title || currentImage.description) && (
            <div className="mb-4">
              {currentImage.title && (
                <h3 className="font-semibold text-foreground">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentImage.description}</p>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {hasMultiple && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                    idx === currentIndex
                      ? "ring-2 ring-gold border-gold"
                      : "border border-border hover:border-gold/50"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.title || `Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          {hasMultiple && (
            <div className="text-xs text-muted-foreground text-center mt-2">
              {currentIndex + 1} de {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
