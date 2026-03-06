"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ShoppingBag, User, Shield, Monitor, ChevronRight, LogIn } from "lucide-react"
import { useApp } from "@/components/providers"
import { createClient } from "@/lib/supabase/client"

export function PortalCards() {
  const { t, locale } = useApp()
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
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

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? { email: user.email || '' } : null)
    }
    checkAuth()
  }, [])

  const portals = [
    {
      icon: ShoppingBag,
      title: t.portals.catalog,
      description: t.portals.catalogDesc,
      href: "/catalogo",
      requiresAuth: false,
    },
    {
      icon: user ? User : LogIn,
      title: user 
        ? t.portals.client 
        : (locale === 'es' ? 'Iniciar Sesion' : 'Login'),
      description: user 
        ? t.portals.clientDesc 
        : (locale === 'es' ? 'Accede a tu cuenta para ver cotizaciones y eventos' : 'Access your account to view quotes and events'),
      href: user ? "/cliente" : "/auth/login",
      requiresAuth: false,
    },
    {
      icon: Shield,
      title: t.portals.admin,
      description: t.portals.adminDesc,
      href: "/admin",
      requiresAuth: true,
    },
    {
      icon: Monitor,
      title: t.portals.kiosk,
      description: t.portals.kioskDesc,
      href: "/kiosk",
      requiresAuth: false,
    },
  ]

  return (
    <section ref={ref} className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
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
                className={`group relative rounded-2xl border border-border bg-card/50 p-5 transition-all duration-700 hover:border-gold/20 hover:bg-card ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">{portal.title}</h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  {portal.description}
                </p>
                <ChevronRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
