'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: string
  url: string
  title_es: string
  title_en: string
  description_es: string
  type: 'video' | 'image'
}

export function Gallery3DSlider({ items }: { items: GalleryItem[] }) {
  const [current, setCurrent] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
      setRotation((prev) => prev - (360 / items.length))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, items.length])

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length)
    setRotation((prev) => prev + (360 / items.length))
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % items.length)
    setRotation((prev) => prev - (360 / items.length))
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    const diff = index - current
    setCurrent(index)
    setRotation((prev) => prev - (diff * 360) / items.length)
    setIsAutoPlay(false)
  }

  const isVideo = (url: string) => url.includes('video') || url.endsWith('.mp4')

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-background via-background to-card/30 py-20 px-4">
      {/* 3D Carousel Container */}
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="gradient-neon-text mb-4 text-[11px] font-medium uppercase tracking-[0.35em]">
            Galería
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros Eventos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestros proyectos más destacados
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="relative h-96 mb-12 perspective" style={{ perspective: '1200px' }}>
          <div className="relative w-full h-full" style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s ease-out',
          }}>
            {items.map((item, index) => {
              const angle = ((index - current) * 360) / items.length
              const isActive = index === current
              const distance = 400

              return (
                <div
                  key={item.id}
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${distance}px)`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className={cn(
                    'relative w-80 h-80 rounded-2xl overflow-hidden border-2 transition-all duration-300',
                    isActive
                      ? 'border-gold shadow-2xl shadow-gold/50 scale-100'
                      : 'border-border shadow-lg opacity-60 scale-75'
                  )}>
                    {isVideo(item.url) ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          poster={`${item.url}?quality=auto`}
                        />
                        <button
                          onClick={() => setPlayingVideo(isActive ? playingVideo === item.id ? null : item.id : item.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          {playingVideo === item.id ? (
                            <Pause className="w-16 h-16 text-white" />
                          ) : (
                            <Play className="w-16 h-16 text-white" />
                          )}
                        </button>
                      </>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.title_es}
                        fill
                        className="object-cover"
                      />
                    )}

                    {/* Info overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold text-white">{item.title_es}</h3>
                      <p className="text-sm text-gray-200">{item.description_es}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-2 rounded-full border border-gold/30 bg-card/80 hover:bg-card text-gold transition-all hover-lift"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-2 rounded-full border border-gold/30 bg-card/80 hover:bg-card text-gold transition-all hover-lift"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-4 mb-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'transition-all duration-300 rounded-full',
                index === current
                  ? 'w-12 h-3 bg-gradient-neon'
                  : 'w-3 h-3 bg-border hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {items[current].title_es}
          </h3>
          <p className="text-muted-foreground mb-6">
            {items[current].description_es}
          </p>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="btn-neon px-8 py-3 rounded-full text-white font-semibold inline-flex items-center gap-2"
          >
            {isAutoPlay ? 'Pausar' : 'Reproducir'} Automático
          </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-warning/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
