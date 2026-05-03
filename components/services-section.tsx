"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Music,
  Camera,
  Lightbulb,
  Flame,
  Zap,
  Disc,
  Sparkles,
  Armchair,
  UtensilsCrossed,
  ChevronRight,
  Play,
} from "lucide-react"
import { useApp } from "@/components/providers"
import { catalog } from "@/lib/catalog-data"

const icons = [Music, Camera, Lightbulb, Flame, Zap, Disc, Sparkles, Armchair, UtensilsCrossed]

const categoryIcons: Record<string, React.ElementType> = {
  "experiencias-escenicas": Sparkles,
  "cabina-360": Camera,
  "paquetes-dj": Music,
  "iluminacion": Lightbulb,
  "efectos-especiales": Flame,
  "pirotecnia": Zap,
  "audio": Disc,
  "mobiliario": Armchair,
  "catering": UtensilsCrossed,
}

function ServiceCard({
  title,
  description,
  highlight,
  Icon,
  index,
  videoUrl,
  itemCount,
  categoryId,
}: {
  title: string
  description: string
  highlight: string
  Icon: React.ElementType
  index: number
  videoUrl?: string
  itemCount?: number
  categoryId?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered])

  return (
    <Link
      href={`/catalogo${categoryId ? `?category=${categoryId}` : ''}`}
      ref={ref}
      className={`group relative rounded-2xl border border-border bg-card/50 overflow-hidden transition-all duration-700 hover:border-gold/20 hover:bg-card block ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video preview on hover */}
      {videoUrl && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
      )}
      
      <div className="relative p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/15">
            <Icon className="h-5 w-5 text-gold" />
          </div>
          {videoUrl && (
            <div className="flex items-center gap-1 rounded-full bg-background/60 backdrop-blur-sm px-2 py-1 text-[10px] text-foreground">
              <Play className="h-3 w-3 text-gold" />
              Video
            </div>
          )}
        </div>
        <h3 className="mb-2 text-[15px] font-semibold text-foreground">{title}</h3>
        <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gold">{highlight}</span>
          {itemCount && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-gold transition-colors">
              {itemCount} productos
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ServicesSection() {
  const { t } = useApp()

  // Map categories with their video previews from catalog data
  const categoriesWithVideos = catalog.map((cat, index) => {
    // Find the first item with a video in this category
    const itemWithVideo = cat.items.find(item => item.videos && item.videos.length > 0)
    return {
      categoryId: cat.id,
      title: t.services.items[index]?.title || cat.name,
      description: t.services.items[index]?.description || cat.description,
      highlight: t.services.items[index]?.highlight || `${cat.items.length} opciones`,
      Icon: categoryIcons[cat.id] || icons[index] || Sparkles,
      videoUrl: itemWithVideo?.videos?.[0],
      itemCount: cat.items.length,
    }
  })

  return (
    <section id="servicios" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="gradient-neon-text mb-3 text-[11px] font-medium uppercase tracking-[0.35em]">
            {t.services.label}
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t.services.heading}
          </h2>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithVideos.map((service, index) => (
            <ServiceCard
              key={service.categoryId}
              title={service.title}
              description={service.description}
              highlight={service.highlight}
              Icon={service.Icon}
              index={index}
              videoUrl={service.videoUrl}
              itemCount={service.itemCount}
              categoryId={service.categoryId}
            />
          ))}
        </div>

        {/* CTA to full catalog */}
        <div className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-gold/20 transition-all hover:bg-gold-light hover:shadow-gold/30"
          >
            Ver catalogo completo
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
