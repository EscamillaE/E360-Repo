"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Music,
  Flame,
  Zap,
  Disc,
  Armchair,
  Camera,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Send,
} from "lucide-react"
import { catalog, type CatalogCategory } from "@/lib/catalog-data"

const iconMap: Record<string, React.ElementType> = {
  music: Music,
  flame: Flame,
  zap: Zap,
  disc: Disc,
  armchair: Armchair,
  utensils: Music,
  camera: Camera,
  star: Sparkles,
  bolt: Zap,
}

type KioskView = "welcome" | "categories" | "category-detail" | "contact"

export default function KioskPage() {
  const [view, setView] = useState<KioskView>("welcome")
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  // Auto-return to welcome screen after 60s of inactivity
  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer)
    const timer = setTimeout(() => {
      setView("welcome")
      setSelectedCategory(null)
    }, 60000)
    setIdleTimer(timer)
  }

  useEffect(() => {
    const handleInteraction = () => resetIdleTimer()
    window.addEventListener("touchstart", handleInteraction)
    window.addEventListener("click", handleInteraction)
    resetIdleTimer()
    return () => {
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("click", handleInteraction)
      if (idleTimer) clearTimeout(idleTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background select-none overflow-hidden">
      {/* Kiosk header - always visible */}
      <header className="flex items-center justify-between border-b border-border bg-card/80 px-8 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              EVENTOS <span className="text-gold">360</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Produccion Integral de Eventos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-gold">
              <MapPin className="h-3 w-3" />
              Centro de Negocios de Queretaro
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Expo 2026
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {/* WELCOME SCREEN */}
        {view === "welcome" && (
          <div className="flex min-h-full flex-col items-center justify-center px-8 py-12 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 -m-6 rounded-full bg-gold/10 blur-3xl" />
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={200}
                height={200}
                className="relative drop-shadow-2xl"
                priority
              />
            </div>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Bienvenido a
            </p>
            <h2 className="mb-4 text-5xl font-bold text-foreground">
              EVENTOS <span className="text-glow-gold text-gold">360</span>
            </h2>
            <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
              Convierte tu evento en una experiencia inolvidable. Toca la
              pantalla para explorar nuestros servicios y productos.
            </p>

            <button
              onClick={() => setView("categories")}
              className="flex items-center gap-3 rounded-full bg-gold px-10 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-95"
            >
              Explorar Catalogo
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setView("contact")}
              className="mt-4 rounded-full border border-gold/30 px-8 py-3 text-sm font-medium text-foreground transition-all hover:border-gold/60 active:scale-95"
            >
              Contactar un asesor
            </button>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {view === "categories" && (
          <div className="px-8 py-8">
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => setView("welcome")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
              >
                <ArrowLeft className="h-4 w-4 text-foreground" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Nuestros Servicios
                </h2>
                <p className="text-sm text-muted-foreground">
                  Toca una categoria para ver los productos
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((category) => {
                const Icon = iconMap[category.icon] || Sparkles
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category)
                      setView("category-detail")
                    }}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-5 text-left backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card/80 active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-base font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gold">
                        {category.items.length} productos
                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setView("contact")}
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
              >
                Contactar un asesor
              </button>
            </div>
          </div>
        )}

        {/* CATEGORY DETAIL VIEW */}
        {view === "category-detail" && selectedCategory && (
          <div className="px-8 py-8">
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => setView("categories")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
              >
                <ArrowLeft className="h-4 w-4 text-foreground" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCategory.items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-gold/30"
                >
                  {/* Image placeholder */}
                  <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
                    <Image
                      src="/images/logo.png"
                      alt={item.name}
                      width={50}
                      height={50}
                      className="opacity-20"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-primary-foreground">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 text-sm font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="inline-block rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold">
                      {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => setView("categories")}
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-95"
              >
                Ver mas categorias
              </button>
              <button
                onClick={() => setView("contact")}
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
              >
                Cotizar ahora
              </button>
            </div>
          </div>
        )}

        {/* CONTACT VIEW */}
        {view === "contact" && (
          <div className="flex min-h-full flex-col items-center justify-center px-8 py-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <Send className="h-7 w-7 text-gold" />
            </div>

            <h2 className="mb-3 text-3xl font-bold text-foreground">
              Contactanos
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Escanea el codigo QR o contactanos directamente para recibir una
              cotizacion personalizada para tu evento.
            </p>

            {/* QR Placeholder */}
            <div className="mb-8 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-gold/30 bg-card/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">QR Code</p>
                <p className="mt-1 text-xs font-medium text-gold">WhatsApp</p>
              </div>
            </div>

            <div className="mb-6 flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">O contactanos en:</p>
              <a
                href="https://wa.me/5214427953753?text=Hola%2C%20los%20vi%20en%20la%20expo%20del%20Centro%20de%20Negocios%20de%20Queretaro%20y%20me%20interesa%20cotizar%20un%20evento"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
              >
                Enviar WhatsApp
              </a>
              <p className="text-sm font-medium text-foreground">442-795-3753</p>
              <p className="text-sm text-muted-foreground">
                proyectos360.qro@gmail.com
              </p>
            </div>

            <button
              onClick={() => setView("welcome")}
              className="mt-4 text-sm text-muted-foreground underline transition-colors hover:text-foreground"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </main>

      {/* Kiosk footer */}
      <footer className="border-t border-border bg-card/50 px-8 py-3 text-center backdrop-blur-xl">
        <p className="text-xs text-muted-foreground">
          EVENTOS 360 Queretaro - Expo Centro de Negocios 2026 - Toca la pantalla para interactuar
        </p>
      </footer>
    </div>
  )
}
