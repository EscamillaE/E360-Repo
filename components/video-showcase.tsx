"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Play, Volume2, VolumeX, Settings, Instagram, Facebook, ExternalLink } from "lucide-react"
import { useApp } from "@/components/providers"
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
  // Cabina 360 Videos - Autoplay showcases
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-08%20at%2012.20.52%20PM-AQAb1MYHt2CcwmbXC0IfUeEIMie9yV.mp4",
    titleEs: "Cabina 360 en Accion",
    titleEn: "360 Booth in Action",
    descEs: "Videos dinamicos en 360 grados para tu evento",
    descEn: "Dynamic 360-degree videos for your event",
    featured: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-08%20at%2012.29.44%20PM-Wx4Nkx1cUkWko1iyzKWSrzB2wMSrWQ.mp4",
    titleEs: "Experiencia Premium 360",
    titleEn: "Premium 360 Experience",
    descEs: "Efectos especiales y slow motion profesional",
    descEn: "Professional special effects and slow motion",
    featured: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.46.41%20PM-CEkKnGtme7VhcsJ8WOXcTLTvtLirHq.mp4",
    titleEs: "Momentos Virales",
    titleEn: "Viral Moments",
    descEs: "Contenido listo para compartir al instante",
    descEn: "Content ready to share instantly",
    featured: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-03-08%20at%2012.59.24%20PM-SsLKnIqMwzCdJYfwHtruurdWA71yeA.mp4",
    titleEs: "Cabina 360 Luxury",
    titleEn: "360 Luxury Booth",
    descEs: "La experiencia mas completa para eventos VIP",
    descEn: "The most complete experience for VIP events",
    featured: true,
  },
  // Original showcase videos
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
]

interface VideoCardProps {
  video: {
    src: string
    titleEs: string
    titleEn: string
    descEs: string
    descEn: string
    mediaType?: "video" | "image"
    featured?: boolean
  }
  index: number
  locale: "es" | "en"
}

function VideoCard({ video, index, locale }: VideoCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true) // Start playing by default
  const [isMuted, setIsMuted] = useState(true) // Always start muted for autoplay
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isVideo = video.mediaType !== "image"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Autoplay when visible
          if (videoRef.current && isVideo) {
            videoRef.current.play().catch(() => {
              // Autoplay failed, user interaction required
              setIsPlaying(false)
            })
          }
        } else {
          // Pause when not visible to save resources
          if (videoRef.current && isVideo) {
            videoRef.current.pause()
          }
        }
      },
      { threshold: 0.3 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isVideo])

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
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-700 hover:border-gold/20 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
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
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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
      <section id="galeria" className="relative px-6 py-28">
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

          {/* Social Media Live Feed Section */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="gradient-neon-text mb-3 text-[11px] font-medium uppercase tracking-[0.35em]">
                {locale === "es" ? "Siguenos en Redes" : "Follow Us"}
              </p>
              <h3 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
                {locale === "es" ? "Contenido en Vivo" : "Live Content"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                {locale === "es" 
                  ? "Mira nuestros eventos mas recientes directamente desde nuestras redes sociales"
                  : "Watch our latest events directly from our social media"
                }
              </p>
            </div>

            {/* Social Media Links */}
            <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/eventos360mx"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCAF45]/10 p-8 transition-all hover:border-[#E1306C]/50 hover:shadow-lg hover:shadow-[#E1306C]/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white shadow-lg">
                  <Instagram className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-foreground">@eventos360mx</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === "es" ? "Reels, Stories y mas" : "Reels, Stories and more"}
                  </p>
                </div>
                <span className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </span>
              </a>

              {/* Facebook Card */}
              <a
                href="https://www.facebook.com/eventos360mx"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-[#1877F2]/5 p-8 transition-all hover:border-[#1877F2]/50 hover:shadow-lg hover:shadow-[#1877F2]/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-lg">
                  <Facebook className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-foreground">Eventos 360</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === "es" ? "Videos en vivo y albumes" : "Live videos and albums"}
                  </p>
                </div>
                <span className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </span>
              </a>
            </div>

            {/* Embedded Feed Note */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              {locale === "es" 
                ? "Los videos de la galeria se actualizan automaticamente con nuestro contenido mas reciente"
                : "Gallery videos are automatically updated with our latest content"
              }
            </p>
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
