"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ShoppingBag, User, Shield, Monitor, ChevronRight } from "lucide-react"
import { useApp } from "@/components/providers"

export function PortalCards() {
  const { t } = useApp()
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

  const portals = [
    {
      icon: ShoppingBag,
      title: t.portals.catalog,
      description: t.portals.catalogDesc,
      href: "/catalogo",
    },
    {
      icon: User,
      title: t.portals.client,
      description: t.portals.clientDesc,
      href: "/cliente",
    },
    {
      icon: Shield,
      title: t.portals.admin,
      description: t.portals.adminDesc,
      href: "/admin",
    },
    {
      icon: Monitor,
      title: t.portals.kiosk,
      description: t.portals.kioskDesc,
      href: "/kiosk",
    },
  ]

  return (
    <section ref={ref} className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="gradient-neon-text mb-3 text-[11px] font-medium uppercase tracking-[0.35em]">
            {t.portals.label}
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t.portals.heading}
          </h2>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t.portals.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((portal, index) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className={`group relative rounded-2xl border-2 bg-card/50 backdrop-blur-sm p-5 transition-all duration-500 hover:border-gold hover:shadow-[0_0_30px_hsl(32,100%,52%,0.25)] hover:bg-card/80 ${
                  isVisible ? "translate-y-0 opacity-100 border-border" : "translate-y-6 opacity-0 border-transparent"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-neon-orange group-hover:to-gold group-hover:shadow-[0_0_20px_hsl(32,100%,52%,0.4)]">
                  <Icon className="h-5 w-5 text-gold transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">{portal.title}</h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  {portal.description}
                </p>
                <div className="flex items-center gap-1 text-xs font-medium text-gold transition-transform group-hover:translate-x-1">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Ver mas</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
