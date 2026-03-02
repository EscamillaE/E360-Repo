"use client"

import { useEffect, useRef, useState } from "react"
import {
  Music,
  Flame,
  Armchair,
  Disc,
  Zap,
  UtensilsCrossed,
} from "lucide-react"

const services = [
  {
    icon: Music,
    title: "Paquetes DJ & Audio",
    description:
      "Desde la Cabina Blanca hasta Sweet Dream, paquetes completos con DJ profesional, audio premium e iluminacion de alto nivel.",
    highlight: "Desde $4,830 MXN",
  },
  {
    icon: Flame,
    title: "Efectos Especiales",
    description:
      "Fuego, CO2, chisperos, humo, laser y confeti. Momentos clave que dejan a todos sin aliento.",
    highlight: "Impacto visual",
  },
  {
    icon: Zap,
    title: "Shows en Vivo",
    description:
      "Robot LED interactivo y shows de drones con figuras personalizadas que transforman tu evento en un espectaculo unico.",
    highlight: "Robot LED & Drones",
  },
  {
    icon: Disc,
    title: "Pistas de Baile",
    description:
      "Pistas de pixeles LED, pistas blancas y pistas HD personalizadas. Desde 4x4 hasta 6x5 metros.",
    highlight: "LED interactivo",
  },
  {
    icon: Armchair,
    title: "Mobiliario Premium",
    description:
      "Sillas Tiffany, Chanel, Crossback, Thonik y Sewing. Elegancia en cada detalle de tu evento.",
    highlight: "Estilo y confort",
  },
  {
    icon: UtensilsCrossed,
    title: "Catering & Extras",
    description:
      "Coffee break, snacks, loza fina, cristaleria y cubiertos. Todo lo necesario para una experiencia completa.",
    highlight: "Servicio integral",
  },
]

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0]
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const Icon = service.icon

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-700 hover:border-gold/30 hover:bg-card/80 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Glow on hover */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/5 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10">
          <Icon className="h-5 w-5 text-gold" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {service.title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
          {service.highlight}
        </span>
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <section id="services" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Nuestros Servicios
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Todo para tu evento perfecto
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Desde la produccion de audio hasta los efectos especiales mas
            espectaculares, tenemos todo cubierto.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
