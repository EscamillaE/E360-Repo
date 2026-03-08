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
  Home,
  Grid3X3,
  MessageCircle,
  Mic,
  Facebook,
  Instagram,
  Globe,
  ShoppingBag,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"
import { VoiceAssistant } from "@/components/kiosk/voice-assistant"
import { slideshowSettings, socialLinks } from "@/lib/brand-styles"

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

type KioskView = "welcome" | "catalog" | "contact"

// QR Code Component - Large and scannable from distance
function LargeQRCode({ 
  title, 
  subtitle, 
  icon: Icon, 
  url, 
  color 
}: { 
  title: string
  subtitle: string
  icon: React.ElementType
  url: string
  color: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 180
    const moduleSize = 6
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    const seed = url.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    ctx.fillStyle = "#000000"

    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(size - 7 * moduleSize, 0)
    drawFinderPattern(0, size - 7 * moduleSize)

    const modules = Math.floor(size / moduleSize)
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        if ((i < 8 && j < 8) || (i < 8 && j > modules - 9) || (i > modules - 9 && j < 8)) continue
        const hash = (seed * (i + 1) * (j + 1)) % 100
        if (hash < 45) {
          ctx.fillStyle = "#000000"
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [url])

  return (
    <div className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_hsl(32,100%,52%,0.25)]">
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <canvas
        ref={canvasRef}
        className="rounded-lg border-4 border-white shadow-xl"
        style={{ width: 180, height: 180 }}
      />
      <div className="text-center">
        <h4 className="text-xl font-semibold text-foreground">{title}</h4>
        <p className="text-base text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

// Slideshow Component - Shows when idle
function IdleSlideshow({ 
  onInteract,
  language 
}: { 
  onInteract: () => void
  language: "es" | "en"
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = slideshowSettings.slides

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slideshowSettings.slideInterval)
    return () => clearInterval(timer)
  }, [slides.length])

  const qrCodes = [
    { key: "facebook", title: "Facebook", subtitle: socialLinks.facebook.handle, icon: Facebook, url: socialLinks.facebook.url, color: "bg-[#1877F2]" },
    { key: "instagram", title: "Instagram", subtitle: socialLinks.instagram.handle, icon: Instagram, url: socialLinks.instagram.url, color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]" },
    { key: "whatsapp", title: "WhatsApp", subtitle: socialLinks.whatsapp.displayNumber, icon: MessageCircle, url: socialLinks.whatsapp.url, color: "bg-[#25D366]" },
    { key: "website", title: language === "es" ? "Sitio Web" : "Website", subtitle: socialLinks.website.display, icon: Globe, url: socialLinks.website.url, color: "bg-gold" },
    { key: "catalog", title: language === "es" ? "Catalogo" : "Catalog", subtitle: language === "es" ? "Ver productos" : "View products", icon: ShoppingBag, url: `${socialLinks.website.url}/catalogo`, color: "bg-neon-orange" },
  ]

  const slide = slides[currentSlide]

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl cursor-pointer"
      onClick={onInteract}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-4">
        <Image src="/images/logo.png" alt="Eventos 360" width={80} height={80} className="rounded-full border-2 border-gold/30" />
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            EVENTOS <span className="gradient-neon-text">360</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {language === "es" ? "Produccion Integral de Eventos" : "Complete Event Production"}
          </p>
        </div>
      </div>

      {/* Slide Title */}
      <h2 className="mb-2 text-5xl font-bold text-foreground text-center">
        <span className="gradient-neon-text">{slide.title[language]}</span>
      </h2>
      <p className="mb-12 text-2xl text-muted-foreground">{slide.subtitle[language]}</p>

      {/* QR Codes */}
      {slide.type === "qr" && (
        <div className="flex flex-wrap justify-center gap-8">
          {qrCodes
            .filter(qr => slide.qrTargets?.includes(qr.key))
            .map(({ key, ...rest }) => (
              <LargeQRCode key={key} {...rest} />
            ))}
        </div>
      )}

      {slide.type === "catalog" && (
        <div className="flex flex-wrap justify-center gap-8">
          {qrCodes.filter(qr => qr.key === "catalog" || qr.key === "website").map(({ key, ...rest }) => (
            <LargeQRCode key={key} {...rest} />
          ))}
        </div>
      )}

      {slide.type === "promo" && (
        <div className="flex flex-wrap justify-center gap-8">
          {qrCodes.filter(qr => qr.key === "whatsapp").map(({ key, ...rest }) => (
            <LargeQRCode key={key} {...rest} />
          ))}
        </div>
      )}

      {/* Slide indicators */}
      <div className="mt-12 flex gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === currentSlide ? "w-10 bg-gold" : "w-3 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Tap to interact hint */}
      <p className="mt-10 animate-pulse text-xl text-muted-foreground">
        {language === "es" ? "Toca la pantalla para interactuar" : "Tap the screen to interact"}
      </p>
    </div>
  )
}

// Category Card - Semi-transparent with neon outline
function CategoryCard({ 
  category, 
  isActive,
  onClick 
}: { 
  category: CatalogCategory
  isActive: boolean
  onClick: () => void 
}) {
  const Icon = iconMap[category.icon] || Sparkles
  
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left backdrop-blur-sm transition-all duration-300 ${
        isActive 
          ? "border-gold bg-gold/10 shadow-[0_0_30px_hsl(32,100%,52%,0.35),0_0_60px_hsl(25,100%,55%,0.15)]" 
          : "border-border bg-card/50 hover:border-gold/50 hover:shadow-[0_0_20px_hsl(32,100%,52%,0.15)]"
      }`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
        isActive 
          ? "bg-gradient-to-br from-neon-orange to-gold" 
          : "bg-gold/15 group-hover:bg-gold/25"
      }`}>
        <Icon className={`h-7 w-7 ${isActive ? "text-background" : "text-gold"}`} />
      </div>
      
      <div className="flex-1">
        <h3 className={`mb-1 text-xl font-semibold ${isActive ? "text-gold" : "text-foreground"}`}>
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-gold">
        <span className="text-sm font-medium">{category.items.length} productos</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`} />
      </div>
    </button>
  )
}

// Product Card - Semi-transparent with neon outline
function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <div className="min-w-[320px] max-w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:shadow-[0_0_25px_hsl(32,100%,52%,0.25)]">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gold/5 via-card to-card">
        <Image
          src={item.image || "/images/logo.png"}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-neon-orange to-gold px-4 py-2 shadow-lg">
          <span className="text-lg font-bold text-background">{item.price}</span>
        </div>

        {/* Service hours */}
        {item.serviceHours && (
          <div className="absolute left-3 top-3 rounded-full border border-gold/30 bg-card/80 px-3 py-1 backdrop-blur-sm">
            <span className="text-sm font-medium text-gold">{item.serviceHours}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">{item.name}</h4>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {item.unit}
          </span>
          <button className="flex items-center gap-1 text-sm font-medium text-gold transition-all hover:underline">
            Ver detalles
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Products Carousel per Category
function CategoryProducts({ category }: { category: CatalogCategory }) {
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
    el.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-border bg-card/90 text-foreground shadow-xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-background active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-border bg-card/90 text-foreground shadow-xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-background active:scale-95"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-1 pb-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {category.items.map((item) => (
          <div key={item.id} style={{ scrollSnapAlign: "start" }}>
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function KioskPage() {
  const [view, setView] = useState<KioskView>("welcome")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [language, setLanguage] = useState<"es" | "en">("es")
  const [showSlideshow, setShowSlideshow] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastInteractionRef = useRef<number>(Date.now())

  // Reset idle timer on any interaction
  const resetIdleTimer = useCallback(() => {
    lastInteractionRef.current = Date.now()
    setShowSlideshow(false)

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    
    idleTimerRef.current = setTimeout(() => {
      setShowSlideshow(true)
    }, slideshowSettings.idleTimeout)
  }, [])

  useEffect(() => {
    const handleInteraction = () => resetIdleTimer()
    window.addEventListener("touchstart", handleInteraction)
    window.addEventListener("click", handleInteraction)
    window.addEventListener("mousemove", handleInteraction)
    resetIdleTimer()

    return () => {
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer])

  const handleNavigate = (newView: string, categoryId?: string) => {
    if (categoryId) {
      setActiveCategory(categoryId)
      setView("catalog")
    } else {
      setView(newView as KioskView)
    }
    resetIdleTimer()
  }

  const selectedCategory = activeCategory ? catalog.find(c => c.id === activeCategory) : null

  return (
    <div className="flex min-h-screen flex-col bg-background select-none overflow-hidden">
      {/* Idle Slideshow */}
      {showSlideshow && (
        <IdleSlideshow 
          onInteract={() => {
            setShowSlideshow(false)
            resetIdleTimer()
          }}
          language={language}
        />
      )}

      {/* Premium Header */}
      <header className="relative z-40 flex items-center justify-between border-b border-border bg-card/80 px-8 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full bg-gold/20 blur-xl" />
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={52}
              height={52}
              className="relative rounded-full border-2 border-gold/30"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              EVENTOS <span className="gradient-neon-text">360</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "es" ? "Produccion Integral de Eventos" : "Complete Event Production"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-base font-medium text-gold">
              <MapPin className="h-4 w-4" />
              Centro de Negocios de Queretaro
            </div>
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Expo 2026
            </div>
          </div>
          
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-gold active:scale-95"
          >
            <Globe className="h-4 w-4" />
            {language === "es" ? "ES" : "EN"}
          </button>
        </div>
      </header>

      {/* Navigation Tabs - Semi-transparent with neon outline when active */}
      <nav className="flex items-center gap-3 border-b border-border bg-card/30 px-8 py-3 backdrop-blur-sm">
        <button
          onClick={() => { setView("welcome"); setActiveCategory(null); }}
          className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-base font-medium transition-all duration-300 ${
            view === "welcome"
              ? "border-gold bg-gradient-to-r from-neon-orange to-gold text-background shadow-[0_4px_20px_hsl(32,100%,52%,0.4)]"
              : "border-border bg-card/50 text-foreground hover:border-gold/50"
          }`}
        >
          <Home className="h-4 w-4" />
          {language === "es" ? "Inicio" : "Home"}
        </button>
        <button
          onClick={() => setView("catalog")}
          className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-base font-medium transition-all duration-300 ${
            view === "catalog"
              ? "border-gold bg-gradient-to-r from-neon-orange to-gold text-background shadow-[0_4px_20px_hsl(32,100%,52%,0.4)]"
              : "border-border bg-card/50 text-foreground hover:border-gold/50"
          }`}
        >
          <Grid3X3 className="h-4 w-4" />
          {language === "es" ? "Catalogo" : "Catalog"}
        </button>
        <button
          onClick={() => setView("contact")}
          className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-base font-medium transition-all duration-300 ${
            view === "contact"
              ? "border-gold bg-gradient-to-r from-neon-orange to-gold text-background shadow-[0_4px_20px_hsl(32,100%,52%,0.4)]"
              : "border-border bg-card/50 text-foreground hover:border-gold/50"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {language === "es" ? "Contacto" : "Contact"}
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {/* WELCOME VIEW */}
        {view === "welcome" && (
          <div className="flex h-full flex-col items-center justify-center px-8 py-8">
            <VoiceAssistant onNavigate={handleNavigate} />
            
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <button
                onClick={() => setView("catalog")}
                className="flex items-center gap-3 rounded-full bg-gradient-to-r from-neon-orange to-gold px-10 py-4 text-xl font-semibold text-background shadow-lg transition-all hover:shadow-[0_8px_30px_hsl(32,100%,52%,0.5)] hover:-translate-y-1 active:scale-95"
              >
                {language === "es" ? "Explorar Catalogo" : "Explore Catalog"}
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={() => setView("contact")}
                className="rounded-full border-2 border-border bg-card/50 px-8 py-3.5 text-lg font-medium text-foreground backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10 active:scale-95"
              >
                {language === "es" ? "Contactar asesor" : "Contact advisor"}
              </button>
            </div>
          </div>
        )}

        {/* CATALOG VIEW - Independent category tabs */}
        {view === "catalog" && (
          <div className="flex h-full">
            {/* Category sidebar */}
            <aside className="w-80 flex-shrink-0 overflow-y-auto border-r border-border bg-card/20 p-4 backdrop-blur-sm">
              <h2 className="mb-4 px-2 text-lg font-semibold text-foreground">
                {language === "es" ? "Categorias" : "Categories"}
              </h2>
              <div className="space-y-3">
                {catalog.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isActive={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </aside>

            {/* Products area */}
            <div className="flex-1 overflow-y-auto p-8">
              {selectedCategory ? (
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card/50 transition-all hover:border-gold hover:bg-gold hover:text-background active:scale-95"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedCategory.name}
                      </h2>
                      <p className="text-base text-muted-foreground">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                  <CategoryProducts category={selectedCategory} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/15">
                    <Grid3X3 className="h-10 w-10 text-gold" />
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">
                    {language === "es" ? "Selecciona una categoria" : "Select a category"}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {language === "es" 
                      ? "Elige una categoria del menu lateral para ver los productos" 
                      : "Choose a category from the side menu to view products"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACT VIEW */}
        {view === "contact" && (
          <div className="flex h-full flex-col items-center justify-center px-8 py-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-neon-orange/10 shadow-lg">
              <Send className="h-8 w-8 text-gold" />
            </div>

            <h2 className="mb-2 text-4xl font-bold text-foreground">
              <span className="gradient-neon-text">
                {language === "es" ? "Contactanos" : "Contact Us"}
              </span>
            </h2>
            <p className="mb-8 max-w-lg text-center text-xl text-muted-foreground">
              {language === "es" 
                ? "Escanea cualquier codigo QR para conectar con nosotros"
                : "Scan any QR code to connect with us"}
            </p>

            {/* QR Codes Grid */}
            <div className="flex flex-wrap justify-center gap-6">
              <LargeQRCode
                title="Facebook"
                subtitle={socialLinks.facebook.handle}
                icon={Facebook}
                url={socialLinks.facebook.url}
                color="bg-[#1877F2]"
              />
              <LargeQRCode
                title="Instagram"
                subtitle={socialLinks.instagram.handle}
                icon={Instagram}
                url={socialLinks.instagram.url}
                color="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
              />
              <LargeQRCode
                title="WhatsApp"
                subtitle={socialLinks.whatsapp.displayNumber}
                icon={MessageCircle}
                url={socialLinks.whatsapp.url}
                color="bg-[#25D366]"
              />
            </div>

            {/* Contact info */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={socialLinks.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full bg-gradient-to-r from-neon-orange to-gold px-8 py-3 text-lg font-semibold text-background shadow-lg transition-all hover:shadow-[0_8px_30px_hsl(32,100%,52%,0.5)] hover:-translate-y-1 active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                {language === "es" ? "Enviar WhatsApp" : "Send WhatsApp"}
              </a>
              <p className="text-xl font-semibold text-foreground">{socialLinks.whatsapp.displayNumber}</p>
              <p className="text-base text-muted-foreground">{socialLinks.email.address}</p>
            </div>
          </div>
        )}
      </main>

      {/* Floating "Ask Luna" button */}
      {view !== "welcome" && (
        <button
          onClick={() => setView("welcome")}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border-2 border-gold/50 bg-card/90 px-5 py-3 text-base font-medium text-foreground shadow-xl backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-background active:scale-95"
        >
          <Mic className="h-5 w-5" />
          {language === "es" ? "Pregunta a Luna" : "Ask Luna"}
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-8 py-3 text-center backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-gold">EVENTOS 360</span> Queretaro - Expo Centro de Negocios 2026
        </p>
      </footer>
    </div>
  )
}
