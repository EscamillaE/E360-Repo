"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"

const videos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.40.23%20PM-TEnmltgz51xqaT95dIKs8CgDWKq5KG.mp4",
    title: "Experiencia Inmersiva",
    description: "Shows de iluminacion y efectos especiales",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.38.45%20PM-kriPLucQ1f1shcpFABnIJTstVchrQf.mp4",
    title: "Produccion Premium",
    description: "Audio y DJ de alta calidad",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-02-27%20at%2011.38.21%20PM-gCEBykq0xpRQHSsV5xGYv0f9oJPYlv.mp4",
    title: "Momentos Unicos",
    description: "Cada detalle importa",
  },
]

function VideoCard({
  video,
  index,
}: {
  video: (typeof videos)[0]
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
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

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 transition-all duration-700 hover:border-gold/30 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className="relative aspect-[9/16] max-h-[400px] cursor-pointer overflow-hidden"
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
          onEnded={() => setIsPlaying(false)}
        />

        {/* Play overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-background/30 transition-opacity duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 text-primary-foreground shadow-lg transition-transform hover:scale-110">
            <Play className="h-6 w-6 ml-0.5" />
          </div>
        </div>

        {/* Mute toggle */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-all hover:bg-background/80"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {video.description}
        </p>
      </div>
    </div>
  )
}

export function VideoShowcase() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Nuestro Trabajo
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Eventos que inspiran
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Cada evento es una obra maestra. Descubre nuestras producciones mas
            recientes.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <VideoCard key={video.src} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
