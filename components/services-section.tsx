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
      className={`group relative rounded-2xl border border-border bg-card/50 p-6 transition-all duration-700 hover:border-gold/20 hover:bg-card ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/15">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <h3 className="mb-2 text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <span className="text-[11px] font-medium text-gold">{highlight}</span>
    </div>
  )
}

export function ServicesSection() {
  const { t } = useApp()

  return (
    <section id="servicios" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
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
