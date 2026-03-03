"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Calculator,
  User,
  Shield,
  Monitor,
  ChevronRight,
} from "lucide-react"

const portals = [
  {
    icon: ShoppingBag,
    title: "Catalogo",
    description:
      "Explora nuestra gama completa de productos y servicios con precios en MXN.",
    href: "/catalogo",
    accent: "Productos y precios",
  },
  {
    icon: Calculator,
    title: "Cotizador",
    description:
      "Arma tu evento paso a paso y obtiene un estimado al instante.",
    href: "/cotizador",
    accent: "Cotizacion rapida",
  },
  {
    icon: User,
    title: "Portal Cliente",
    description:
      "Accede a tus cotizaciones, da seguimiento a tus eventos y contacta a tu asesor.",
    href: "/cliente",
    accent: "Tu espacio",
  },
  {
    icon: Shield,
    title: "Admin",
    description:
      "Panel administrativo para gestionar catalogo, cotizaciones y clientes.",
    href: "/admin",
    accent: "Gestion total",
  },
  {
    icon: Monitor,
    title: "Modo Kiosk",
    description:
      "Vista interactiva optimizada para pantallas de expo y puntos de venta.",
    href: "/kiosk",
    accent: "Expo Queretaro 2026",
  },
]

export function PortalCards() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Plataforma Eventos 360
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Accede a nuestros portales
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
            Herramientas digitales para que explores, cotices y administres tus
            eventos de forma sencilla y rapida.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {portals.map((portal, index) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all duration-700 hover:border-gold/30 hover:bg-card/80 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {portal.title}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                    {portal.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-gold">
                    {portal.accent}
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
