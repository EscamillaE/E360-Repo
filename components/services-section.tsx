"use client"

import { useEffect, useRef, useState } from "react"
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
} from "lucide-react"
import { useApp } from "@/components/providers"

const icons = [Music, Camera, Lightbulb, Flame, Zap, Disc, Sparkles, Armchair, UtensilsCrossed]

function ServiceCard({
  title,
  description,
  highlight,
  Icon,
  index,
}: {
  title: string
  description: string
  highlight: string
  Icon: React.ElementType
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl border-2 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 ${
        isHovered 
          ? "border-gold shadow-[0_0_30px_hsl(32,100%,52%,0.25)] bg-card/80" 
          : "border-border hover:border-gold/30"
      } ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
        isHovered ? "bg-gradient-to-br from-neon-orange to-gold shadow-[0_0_20px_hsl(32,100%,52%,0.4)]" : "bg-gold/10"
      }`}>
        <Icon className={`h-5 w-5 transition-colors ${isHovered ? "text-white" : "text-gold"}`} />
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all ${
        isHovered ? "bg-gold/20 text-gold" : "bg-gold/10 text-gold"
      }`}>
        {highlight}
      </span>
    </div>
  )
}

export function ServicesSection() {
  const { t } = useApp()

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
          {t.services.items.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              highlight={service.highlight}
              Icon={icons[index]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
