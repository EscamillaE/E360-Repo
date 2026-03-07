"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import {
  Music,
  Flame,
  Zap,
  Disc,
  Armchair,
  Camera,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Send,
  X,
  Menu,
  Home,
  Grid3X3,
  MessageCircle,
  Mic,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"
import { VoiceAssistant } from "@/components/kiosk/voice-assistant"
import { QRCodesGrid, QRCodesSidebar } from "@/components/kiosk/qr-codes-grid"

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

type KioskView = "welcome" | "categories" | "category-detail" | "contact" | "qr-codes"

// Premium Product Carousel Component
function ProductCarousel({ 
  items, 
  categoryName 
}: { 
  items: CatalogItem[]
  categoryName: string 
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener("scroll", checkScroll)
      return () => el.removeEventListener("scroll", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 400
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  return (
    <div className="relative">
      {/* Navigation arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-card/90 text-foreground shadow-xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground active:scale-95"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-card/90 text-foreground shadow-xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground active:scale-95"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="carousel-premium flex gap-6 overflow-x-auto px-2 pb-4"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="premium-card min-w-[340px] max-w-[340px] flex-shrink-0 overflow-hidden rounded-3xl"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image container */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gold/5 via-card to-card">
              <Image
                src={item.image || "/images/logo.png"}
                alt={item.name}
                fill
                className="object-cover image-zoom"
              />
              <div className="image-overlay absolute inset-0" />
              
              {/* Price badge */}
              <div className="absolute right-4 top-4 price-badge rounded-full px-4 py-2">
                <span className="text-xl font-black text-primary-foreground">
                  {item.price}
                </span>
              </div>

              {/* Service hours badge */}
              {item.serviceHours && (
                <div className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-gold">{item.serviceHours}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="mb-2 text-xl font-bold text-foreground">{item.name}</h4>
              <p className="mb-4 text-base leading-relaxed text-muted-foreground line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">
                  {item.unit}
                </span>
                <button className="btn-premium rounded-full px-5 py-2.5 text-sm font-bold text-primary-foreground">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Category Card Component
function CategoryCard({ 
  category, 
  onClick 
}: { 
  category: CatalogCategory
  onClick: () => void 
}) {
  const Icon = iconMap[category.icon] || Sparkles
  
  return (
    <button
      onClick={onClick}
      className="group premium-card flex flex-col items-start gap-5 rounded-3xl p-7 text-left"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-neon-orange/10">
        <Icon className="h-8 w-8 text-gold" />
      </div>
      
      <div className="flex-1">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          {category.name}
        </h3>
        <p className="mb-4 text-base leading-relaxed text-muted-foreground line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-gold">
          <span className="text-base font-semibold">{category.items.length} productos</span>
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </button>
  )
}

export default function KioskPage() {
  const [view, setView] = useState<KioskView>("welcome")
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null)
  const [showQRDrawer, setShowQRDrawer] = useState(false)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  // Auto-return to welcome screen after 90s of inactivity
  const resetIdleTimer = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer)
    const timer = setTimeout(() => {
      setView("welcome")
      setSelectedCategory(null)
      setShowQRDrawer(false)
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
  }, [])

  const handleNavigate = (newView: string, categoryId?: string) => {
    if (categoryId) {
      const cat = catalog.find(c => c.id === categoryId)
      if (cat) {
        setSelectedCategory(cat)
        setView("category-detail")
        return
      }
    }
    setView(newView as KioskView)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background select-none overflow-hidden">
      {/* Premium Header */}
      <header className="relative z-50 flex items-center justify-between border-b border-border bg-card/80 px-8 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full bg-gold/20 blur-xl" />
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={56}
              height={56}
              className="relative rounded-full border-2 border-gold/30"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              EVENTOS <span className="gradient-neon-text">360</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Produccion Integral de Eventos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-base font-semibold text-gold">
              <MapPin className="h-4 w-4" />
              Centro de Negocios de Queretaro
            </div>
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Expo 2026
            </div>
          </div>
          
          {/* QR Drawer toggle for mobile */}
          <button
            onClick={() => setShowQRDrawer(!showQRDrawer)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-card/50 text-foreground transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Navigation bar */}
      {view !== "welcome" && (
        <nav className="flex items-center gap-4 border-b border-border bg-card/50 px-8 py-3 backdrop-blur-sm">
          <button
            onClick={() => setView("welcome")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-all ${
              view === "welcome" 
                ? "tab-premium-active" 
                : "border border-border bg-card/50 text-foreground hover:border-gold/30"
            }`}
          >
            <Home className="h-4 w-4" />
            Inicio
          </button>
          <button
            onClick={() => setView("categories")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-all ${
              view === "categories" || view === "category-detail"
                ? "tab-premium-active" 
                : "border border-border bg-card/50 text-foreground hover:border-gold/30"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Catalogo
          </button>
          <button
            onClick={() => setView("contact")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-all ${
              view === "contact" 
                ? "tab-premium-active" 
                : "border border-border bg-card/50 text-foreground hover:border-gold/30"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Contacto
          </button>
        </nav>
      )}

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {/* WELCOME SCREEN */}
          {view === "welcome" && (
            <div className="flex min-h-full flex-col items-center justify-center px-8 py-12">
              {/* Voice Assistant with Orb */}
              <VoiceAssistant onNavigate={handleNavigate} />

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <button
                  onClick={() => setView("categories")}
                  className="btn-premium flex items-center gap-3 rounded-full px-10 py-5 text-xl font-bold text-primary-foreground"
                >
                  Explorar Catalogo
                  <ChevronRight className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setView("contact")}
                  className="rounded-full border-2 border-gold/30 px-8 py-4 text-lg font-semibold text-foreground transition-all hover:border-gold hover:bg-gold/10 active:scale-95"
                >
                  Contactar un asesor
                </button>
              </div>
            </div>
          )}

          {/* CATEGORIES VIEW */}
          {view === "categories" && (
            <div className="px-8 py-10">
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-foreground mb-2">
                  Nuestros <span className="gradient-neon-text">Servicios</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Toca una categoria para explorar los productos disponibles
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setView("category-detail")
                    }}
                  />
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setView("contact")}
                  className="btn-premium rounded-full px-10 py-4 text-lg font-bold text-primary-foreground"
                >
                  Solicitar cotizacion personalizada
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY DETAIL VIEW */}
          {view === "category-detail" && selectedCategory && (
            <div className="px-8 py-10">
              <div className="mb-8 flex items-center gap-5">
                <button
                  onClick={() => setView("categories")}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card/50 transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground active:scale-95"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>

              {/* Product Carousel */}
              <ProductCarousel 
                items={selectedCategory.items} 
                categoryName={selectedCategory.name}
              />

              {/* Action buttons */}
              <div className="mt-10 flex justify-center gap-4">
                <button
                  onClick={() => setView("categories")}
                  className="rounded-full border-2 border-border px-8 py-4 text-lg font-semibold text-foreground transition-all hover:border-gold/50 hover:bg-card active:scale-95"
                >
                  Ver mas categorias
                </button>
                <button
                  onClick={() => setView("contact")}
                  className="btn-premium rounded-full px-8 py-4 text-lg font-bold text-primary-foreground"
                >
                  Cotizar ahora
                </button>
              </div>
            </div>
          )}

          {/* CONTACT VIEW */}
          {view === "contact" && (
            <div className="flex min-h-full flex-col items-center px-8 py-12">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-neon-orange/10 glow-neon">
                <Send className="h-10 w-10 text-gold" />
              </div>

              <h2 className="mb-3 text-4xl font-bold text-foreground">
                <span className="gradient-neon-text">Contactanos</span>
              </h2>
              <p className="mb-10 max-w-lg text-center text-xl leading-relaxed text-muted-foreground">
                Escanea cualquier codigo QR para conectar con nosotros o enviarnos un mensaje directo.
              </p>

              {/* QR Codes Grid */}
              <QRCodesGrid layout="grid" />

              {/* Contact info */}
              <div className="mt-10 flex flex-col items-center gap-4">
                <a
                  href="https://wa.me/5214427953753?text=Hola%2C%20los%20vi%20en%20la%20expo%20del%20Centro%20de%20Negocios%20de%20Queretaro%20y%20me%20interesa%20cotizar%20un%20evento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex items-center gap-3 rounded-full px-10 py-4 text-lg font-bold text-primary-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar WhatsApp
                </a>
                <p className="text-xl font-bold text-foreground">442-795-3753</p>
                <p className="text-lg text-muted-foreground">proyectos360.qro@gmail.com</p>
              </div>

              <button
                onClick={() => setView("welcome")}
                className="mt-8 text-lg text-muted-foreground underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </main>

        {/* QR Codes Sidebar - Desktop only */}
        <aside className="hidden w-80 shrink-0 border-l border-border bg-card/20 p-6 backdrop-blur-sm lg:block">
          <QRCodesSidebar />
        </aside>
      </div>

      {/* Mobile QR Drawer */}
      {showQRDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowQRDrawer(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-gold/20 bg-card p-6 slide-in">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Conecta con nosotros</h3>
              <button
                onClick={() => setShowQRDrawer(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <QRCodesGrid layout="grid" />
          </div>
        </div>
      )}

      {/* Floating "Ask Luna" button when browsing */}
      {view !== "welcome" && (
        <button
          onClick={() => setView("welcome")}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-3 rounded-full border-2 border-gold/50 bg-card/90 px-6 py-4 text-lg font-semibold text-foreground shadow-2xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground active:scale-95 pulse-glow lg:right-[calc(20rem+2rem)]"
        >
          <Mic className="h-5 w-5" />
          Pregunta a Luna
        </button>
      )}

      {/* Premium Footer */}
      <footer className="border-t border-border bg-card/50 px-8 py-4 text-center backdrop-blur-xl">
        <p className="text-base font-medium text-muted-foreground">
          <span className="text-gold">EVENTOS 360</span> Queretaro - Expo Centro de Negocios 2026 - Toca la pantalla para interactuar
        </p>
      </footer>
    </div>
  )
}
