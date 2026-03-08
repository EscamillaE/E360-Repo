"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Play, Volume2, VolumeX, Settings } from "lucide-react"
import { useApp } from "@/components/providers"
import { E360AnimatedLogo } from "@/components/e360-animated-logo"
import { GalleryAuthModal } from "@/components/gallery-auth-modal"
import { GalleryEditModal } from "@/components/gallery-edit-modal"
import { createClient } from "@/lib/supabase/client"

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

const defaultVideos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.40.23%20PM-TEnmltgz51xqaT95dIKs8CgDWKq5KG.mp4",
    titleEs: "Experiencia Inmersiva",
    titleEn: "Immersive Experience",
    descEs: "Shows de iluminacion y efectos especiales",
    descEn: "Lighting shows and special effects",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.38.45%20PM-kriPLucQ1f1shcpFABnIJTstVchrQf.mp4",
    titleEs: "Produccion Premium",
    titleEn: "Premium Production",
    descEs: "Audio y DJ de alta calidad",
    descEn: "High-quality audio and DJ",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.38.21%20PM-gCEBykq0xpRQHSsV5xGYv0f9oJPYlv.mp4",
    titleEs: "Momentos Unicos",
    titleEn: "Unique Moments",
    descEs: "Cada detalle importa",
    descEn: "Every detail matters",
  },
  {
    src: "/images/gallery/dj-party-1.jpg",
    titleEs: "DJ & Audio Profesional",
    titleEn: "Professional DJ & Audio",
    descEs: "Ambiente y energia para tu fiesta",
    descEn: "Atmosphere and energy for your party",
    mediaType: "image",
  },
  {
    src: "/images/gallery/led-robot.jpg",
    titleEs: "Robot LED Show",
    titleEn: "LED Robot Show",
    descEs: "Entretenimiento interactivo futurista",
    descEn: "Futuristic interactive entertainment",
    mediaType: "image",
  },
  {
    src: "/images/gallery/fire-effects.jpg",
    titleEs: "Efectos de Fuego",
    titleEn: "Fire Effects",
    descEs: "Momentos de alto impacto",
    descEn: "High-impact moments",
    mediaType: "image",
  },
  {
    src: "/images/gallery/wedding-setup.jpg",
    titleEs: "Bodas Elegantes",
    titleEn: "Elegant Weddings",
    descEs: "Decoracion y ambientacion premium",
    descEn: "Premium decoration and ambiance",
    mediaType: "image",
  },
  {
    src: "/images/gallery/vip-lounge.jpg",
    titleEs: "Lounge VIP",
    titleEn: "VIP Lounge",
    descEs: "Espacios exclusivos para tus invitados",
    descEn: "Exclusive spaces for your guests",
    mediaType: "image",
  },
  {
    src: "/images/gallery/confetti-party.jpg",
    titleEs: "Momentos Magicos",
    titleEn: "Magical Moments",
    descEs: "Celebraciones inolvidables",
    descEn: "Unforgettable celebrations",
    mediaType: "image",
  },
]

interface VideoCardProps {
  video: {
    src: string
    titleEs: string
    titleEn: string
    descEs: string
    descEn: string
    mediaType?: "video" | "image"
  }
  index: number
  locale: "es" | "en"
}

function VideoCard({ video, index, locale }: VideoCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isVideo = video.mediaType !== "image"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    if (!isVideo) return
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const title = locale === "es" ? video.titleEs : video.titleEn
  const desc = locale === "es" ? video.descEs : video.descEn

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl border-2 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-gold hover:shadow-[0_0_30px_hsl(32,100%,52%,0.25)] ${
        isVisible ? "translate-y-0 opacity-100 border-border" : "translate-y-6 opacity-0 border-transparent"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        className={`relative aspect-[9/16] max-h-[380px] overflow-hidden ${isVideo ? "cursor-pointer" : ""}`}
        onClick={handlePlay}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={video.src}
            className="h-full w-full object-cover"
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={video.src}
            alt={title || "Gallery image"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {isVideo && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-background/20 transition-opacity duration-300 ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md transition-transform hover:scale-110">
              <Play className="h-5 w-5 text-foreground ml-0.5" />
            </div>
          </div>
        )}
        {isVideo && isPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-foreground" />
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

export function VideoShowcase() {
  const { t, locale } = useApp()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch media items from database
  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery")
      if (res.ok) {
        const data = await res.json()
        setMediaItems(data.media || [])
      }
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check if user is already logged in as admin
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
        
        if (profile?.role === "admin") {
          setIsAdmin(true)
        }
      }
    }
    
    checkAuth()
    fetchMedia()
  }, [fetchMedia])

  const handleGearClick = () => {
    if (isAdmin) {
      setShowEditModal(true)
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setIsAdmin(true)
    setShowAuthModal(false)
    setShowEditModal(true)
  }

  // Use database items if available, otherwise fallback to defaults
  const videosToDisplay = mediaItems.length > 0 
    ? mediaItems.map(item => ({
        src: item.url,
        titleEs: item.title_es || "",
        titleEn: item.title_en || "",
        descEs: item.description_es || "",
        descEn: item.description_en || "",
        mediaType: item.media_type,
      }))
    : defaultVideos.map(v => ({ ...v, mediaType: "video" as const }))

  return (
    <>
      <section id="galeria" className="relative px-6 py-28 border-t border-border">
        {/* Section start indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-orange to-gold text-white text-[10px] font-semibold uppercase tracking-wider shadow-[0_0_20px_hsl(32,100%,52%,0.4)]">
          Galeria
        </div>
        
        <div className="mx-auto max-w-6xl">
          {/* Header with gear icon */}
          <div className="relative mb-16 text-center">
            {/* Gear icon for edit mode */}
            <button
              onClick={handleGearClick}
              className={`absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                isAdmin 
                  ? "border-gold/30 bg-gold/10 text-gold hover:bg-gold/20" 
                  : "border-border bg-card text-muted-foreground hover:border-gold/20 hover:text-gold"
              }`}
              aria-label={locale === "es" ? "Editar galeria" : "Edit gallery"}
              title={locale === "es" ? "Editar galeria" : "Edit gallery"}
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* E360 Animated Logo */}
            <div className="mb-6">
              <E360AnimatedLogo size={100} className="mx-auto" />
            </div>
            
            <p className="gradient-neon-text mb-3 text-[11px] font-medium uppercase tracking-[0.35em]">
              {t.gallery.label}
            </p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
              {t.gallery.heading}
            </h2>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t.gallery.subtitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videosToDisplay.map((video, index) => (
              <VideoCard key={video.src + index} video={video} index={index} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <GalleryAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Edit Modal */}
      <GalleryEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mediaItems={mediaItems}
        onUpdate={fetchMedia}
      />
    </>
  )
}
