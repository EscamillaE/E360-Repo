"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"
import { useApp } from "@/components/providers"

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
]

function VideoCard({
  video,
  index,
  locale,
}: {
  video: (typeof defaultVideos)[0]
  index: number
  locale: "es" | "en"
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
        className="relative aspect-[9/16] max-h-[380px] cursor-pointer overflow-hidden"
        onClick={handlePlay}
      >
        <video
          ref={videoRef}
          src={video.src}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-background/20 transition-opacity duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md transition-transform hover:scale-110">
            <Play className="h-5 w-5 text-foreground ml-0.5" />
          </div>
        </div>
        {isPlaying && (
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

  return (
    <section id="galeria" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
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
          {defaultVideos.map((video, index) => (
            <VideoCard key={video.src} video={video} index={index} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
