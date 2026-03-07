"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
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
  Grid3X3,
  MessageCircle,
  X,
} from "lucide-react"
import { catalog, type CatalogCategory } from "@/lib/catalog-data"
import { QRCodesGrid } from "@/components/kiosk/qr-codes-grid"
import { cn } from "@/lib/utils"

// Dynamically import VoiceAssistant to avoid SSR issues with Web Speech API
const VoiceAssistant = dynamic(
  () => import("@/components/kiosk/voice-assistant").then((mod) => mod.VoiceAssistant),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center">
        <div className="h-[280px] w-[280px] animate-pulse rounded-full bg-gold/10" />
        <div className="mt-4 h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
    )
  }
)

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

type KioskView = "main" | "categories" | "category-detail"
type Language = "es" | "en"

const TRANSLATIONS = {
  es: {
    welcome: "Bienvenido a",
    tagline: "Producción Integral de Eventos",
    explore: "Explorar Catálogo",
    askLuna: "Pregúntale a Luna",
    services: "Nuestros Servicios",
    servicesDesc: "Toca una categoría para ver los productos",
    products: "productos",
    back: "Volver",
    viewMore: "Ver más categorías",
    quoteNow: "Cotizar ahora",
    location: "Centro de Negocios de Querétaro",
    event: "Expo 2026",
    footer: "Toca la pantalla o habla con Luna para interactuar",
  },
  en: {
    welcome: "Welcome to",
    tagline: "Full-Service Event Production",
    explore: "Explore Catalog",
    askLuna: "Ask Luna",
    services: "Our Services",
    servicesDesc: "Tap a category to see products",
    products: "products",
    back: "Back",
    viewMore: "View more categories",
    quoteNow: "Get a quote",
    location: "Querétaro Business Center",
    event: "Expo 2026",
    footer: "Touch the screen or talk to Luna to interact",
  },
}

export default function KioskPage() {
  const [view, setView] = useState<KioskView>("main")
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null)
  const [language, setLanguage] = useState<Language>("es")
  const [showAssistant, setShowAssistant] = useState(true)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  const t = TRANSLATIONS[language]

  // Auto-return to main screen after 90s of inactivity
  const resetIdleTimer = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer)
    const timer = setTimeout(() => {
      setView("main")
      setSelectedCategory(null)
      setShowAssistant(true)
    }, 90000)
    setIdleTimer(timer)
  }, [idleTimer])

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
  }, [resetIdleTimer, idleTimer])

  return (
    <div className="flex min-h-screen flex-col bg-background select-none overflow-hidden">
      {/* Kiosk header */}
      <header className="flex items-center justify-between border-b border-border bg-card/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <h1 className="text-lg font-bold text-foreground">
              EVENTOS <span className="text-gold">360</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {t.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-gold">
              <MapPin className="h-3 w-3" />
              {t.location}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {t.event}
            </div>
          </div>
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex h-8 items-center gap-1.5 rounded-full border border-gold/30 bg-card px-3 text-xs font-medium text-foreground transition-all hover:bg-gold/10"
          >
            {language === "es" ? "🇲🇽 ES" : "🇺🇸 EN"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {/* ==================== MAIN VIEW ==================== */}
        {view === "main" && (
          <div className="flex h-full">
            {/* Left side - Voice Assistant */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
              {/* Branding */}
              <div className="mb-6 text-center">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                  {t.welcome}
                </p>
                <h2 className="text-4xl font-bold text-foreground">
                  EVENTOS <span className="text-glow-gold text-gold">360</span>
                </h2>
              </div>

              {/* Voice Assistant with Orb */}
              {showAssistant && (
                <VoiceAssistant
                  onNavigate={(dest) => {
                    if (dest === "catalog") setView("categories")
                  }}
                />
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => setView("categories")}
                  className="flex items-center gap-3 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-95"
                >
                  <Grid3X3 className="h-4 w-4" />
                  {t.explore}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side - QR Codes */}
            <div className="hidden w-80 flex-shrink-0 border-l border-border bg-card/30 p-6 lg:block">
              <QRCodesGrid language={language} />
            </div>
          </div>
        )}

        {/* ==================== CATEGORIES VIEW ==================== */}
        {view === "categories" && (
          <div className="flex h-full">
            {/* Categories grid */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setView("main")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4 text-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t.services}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t.servicesDesc}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.map((category) => {
                  const Icon = iconMap[category.icon] || Sparkles
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category)
                        setView("category-detail")
                      }}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 text-left backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card/80 active:scale-[0.98]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-0.5 text-sm font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <p className="mb-1.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gold">
                          {category.items.length} {t.products}
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right side - QR Codes (persistent) */}
            <div className="hidden w-72 flex-shrink-0 border-l border-border bg-card/30 p-4 lg:block">
              <QRCodesGrid language={language} />
            </div>
          </div>
        )}

        {/* ==================== CATEGORY DETAIL VIEW ==================== */}
        {view === "category-detail" && selectedCategory && (
          <div className="flex h-full">
            {/* Products grid */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setView("categories")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4 text-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-gold/30"
                  >
                    {/* Image placeholder */}
                    <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
                      <Image
                        src="/images/logo.png"
                        alt={item.name}
                        width={40}
                        height={40}
                        className="opacity-20"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                        {item.price}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="mb-0.5 text-xs font-semibold text-foreground">
                        {item.name}
                      </h4>
                      <p className="mb-1.5 text-[10px] leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <span className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-medium text-gold">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setView("categories")}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-secondary active:scale-95"
                >
                  {t.viewMore}
                </button>
                <button
                  onClick={() => setView("main")}
                  className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t.quoteNow}
                </button>
              </div>
            </div>

            {/* Right side - QR Codes (persistent) */}
            <div className="hidden w-72 flex-shrink-0 border-l border-border bg-card/30 p-4 lg:block">
              <QRCodesGrid language={language} />
            </div>
          </div>
        )}
      </main>

      {/* Floating mini assistant toggle (when browsing categories) */}
      {view !== "main" && (
        <button
          onClick={() => setView("main")}
          className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-full border border-gold/30 bg-card/90 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:border-gold/60 hover:bg-card"
        >
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-foreground">{t.askLuna}</span>
        </button>
      )}

      {/* Mobile QR drawer toggle */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <MobileQRDrawer language={language} />
      </div>

      {/* Kiosk footer */}
      <footer className="border-t border-border bg-card/50 px-6 py-2.5 text-center backdrop-blur-xl">
        <p className="text-[10px] text-muted-foreground">
          EVENTOS 360 Querétaro — {t.event} — {t.footer}
        </p>
      </footer>
    </div>
  )
}

// Mobile QR drawer component
function MobileQRDrawer({ language }: { language: Language }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-card/90 shadow-lg backdrop-blur-md transition-all hover:bg-card"
      >
        <Grid3X3 className="h-5 w-5 text-gold" />
      </button>

      {/* Drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {language === "es" ? "Códigos QR" : "QR Codes"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <QRCodesGrid language={language} />
          </div>
        </div>
      )}
    </>
  )
}
