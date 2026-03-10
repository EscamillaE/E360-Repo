"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  Play,
  X,
  Phone,
  Mail,
  Volume2,
  VolumeX,
  Home,
  Grid3X3,
  Star,
  Check,
  MessageCircle,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"
import { QRCodeSVG } from "qrcode.react"

const iconMap: Record<string, React.ElementType> = {
  music: Music,
  flame: Flame,
  zap: Zap,
  disc: Disc,
  armchair: Armchair,
  utensils: Music,
  camera: Camera,
  star: Sparkles,
  sparkles: Sparkles,
  bolt: Zap,
}

type KioskView = "screensaver" | "welcome" | "categories" | "category-detail" | "product-detail" | "contact"

const IDLE_TIMEOUT = 45000 // 45 seconds to screensaver
const SCREENSAVER_ATTRACT_INTERVAL = 5000 // 5 seconds between attract messages

const attractMessages = [
  "Toca para explorar",
  "Descubre nuestros servicios",
  "Crea tu evento perfecto",
  "Cabina 360, DJ, Efectos y mas",
]

export default function KioskPage() {
  const [view, setView] = useState<KioskView>("welcome")
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null)
  const [attractIndex, setAttractIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [touchCount, setTouchCount] = useState(0)
  const [showAdminHint, setShowAdminHint] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastTouchTime = useRef(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset to screensaver after inactivity
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setView("screensaver")
      setSelectedCategory(null)
      setSelectedProduct(null)
      setShowVideo(false)
    }, IDLE_TIMEOUT)
  }, [])

  // Screensaver attract message rotation
  useEffect(() => {
    if (view === "screensaver") {
      const interval = setInterval(() => {
        setAttractIndex((prev) => (prev + 1) % attractMessages.length)
      }, SCREENSAVER_ATTRACT_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [view])

  // Handle all interactions
  useEffect(() => {
    const handleInteraction = () => {
      if (view === "screensaver") {
        setView("welcome")
      }
      resetIdleTimer()
    }

    window.addEventListener("touchstart", handleInteraction)
    window.addEventListener("click", handleInteraction)
    resetIdleTimer()

    return () => {
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("click", handleInteraction)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [view, resetIdleTimer])

  // Admin access via logo tap (5 taps in 3 seconds)
  const handleLogoTap = () => {
    const now = Date.now()
    if (now - lastTouchTime.current > 3000) {
      setTouchCount(1)
    } else {
      setTouchCount((prev) => prev + 1)
    }
    lastTouchTime.current = now

    if (touchCount >= 4) {
      setShowAdminHint(true)
      setTimeout(() => setShowAdminHint(false), 3000)
      setTouchCount(0)
    }
  }

  const navigateTo = (newView: KioskView) => {
    setView(newView)
    resetIdleTimer()
  }

  const selectCategory = (category: CatalogCategory) => {
    setSelectedCategory(category)
    navigateTo("category-detail")
  }

  const selectProduct = (product: CatalogItem) => {
    setSelectedProduct(product)
    setCurrentVideoIndex(0)
    navigateTo("product-detail")
  }

  const goBack = () => {
    if (view === "product-detail") {
      setSelectedProduct(null)
      navigateTo("category-detail")
    } else if (view === "category-detail") {
      setSelectedCategory(null)
      navigateTo("categories")
    } else if (view === "categories" || view === "contact") {
      navigateTo("welcome")
    }
  }

  // Featured products for welcome screen
  const featuredProducts = catalog.flatMap((cat) => cat.items).slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col bg-background select-none overflow-hidden touch-manipulation">
      {/* SCREENSAVER */}
      {view === "screensaver" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-neon-orange/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold/3 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8">
            <div className="relative mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="absolute inset-0 -m-8 rounded-full bg-gold/20 blur-3xl" />
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={180}
                height={180}
                className="relative drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="mb-4 text-5xl font-bold text-foreground">
              EVENTOS <span className="text-glow-gold text-gold">360</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground transition-opacity duration-500">
              {attractMessages[attractIndex]}
            </p>

            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 animate-pulse">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gold">Toca para comenzar</span>
            </div>

            <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Expo Centro de Negocios Queretaro 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Kiosk header - visible except in screensaver */}
      {view !== "screensaver" && (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3" onClick={handleLogoTap}>
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
                Produccion Integral de Eventos
              </p>
            </div>
          </div>

          {/* Navigation pills */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => navigateTo("welcome")}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                view === "welcome" ? "bg-gold text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <Home className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateTo("categories")}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                view === "categories" || view === "category-detail" || view === "product-detail"
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateTo("contact")}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                view === "contact" ? "bg-gold text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-[10px] text-gold">
              <MapPin className="h-3 w-3" />
              Centro de Negocios Queretaro
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Expo 2026
            </div>
          </div>

          {/* Admin hint */}
          {showAdminHint && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 rounded-lg bg-gold px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg">
              Visita /admin para panel administrativo
            </div>
          )}
        </header>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* WELCOME SCREEN */}
        {view === "welcome" && (
          <div className="px-6 py-8">
            {/* Hero section */}
            <div className="mb-10 flex flex-col items-center text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Bienvenido a
              </p>
              <h2 className="mb-3 text-4xl font-bold text-foreground">
                Tu evento, <span className="text-glow-gold text-gold">nuestra pasion</span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Cabina 360, DJ profesional, iluminacion, efectos especiales y todo lo que necesitas para crear momentos inolvidables.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigateTo("categories")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95 sm:w-auto"
              >
                Explorar Catalogo
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/30 px-8 py-4 text-base font-medium text-foreground transition-all hover:border-gold/60 active:scale-95 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Contactar Asesor
              </button>
            </div>

            {/* Featured categories */}
            <div className="mb-8">
              <h3 className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Categorias destacadas
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {catalog.slice(0, 8).map((category) => {
                  const Icon = iconMap[category.icon] || Sparkles
                  return (
                    <button
                      key={category.id}
                      onClick={() => selectCategory(category)}
                      className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:border-gold/30 hover:bg-card active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <span className="text-center text-xs font-medium text-foreground line-clamp-2">
                        {category.name}
                      </span>
                      <span className="text-[10px] text-gold">
                        {category.items.length} productos
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Featured products carousel */}
            <div>
              <h3 className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Productos populares
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {featuredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      const cat = catalog.find((c) => c.items.some((i) => i.id === product.id))
                      if (cat) setSelectedCategory(cat)
                      selectProduct(product)
                    }}
                    className="flex-shrink-0 w-64 snap-center rounded-2xl border border-border bg-card/50 overflow-hidden transition-all hover:border-gold/30 active:scale-[0.98]"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-gold/10 via-card to-card flex items-center justify-center">
                      <Image
                        src="/images/logo.png"
                        alt={product.name}
                        width={40}
                        height={40}
                        className="opacity-20"
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {product.price}
                      </div>
                      {product.videos && product.videos.length > 0 && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] text-foreground">
                          <Play className="h-3 w-3 text-gold" />
                          Video
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="mb-1 text-sm font-semibold text-foreground line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {view === "categories" && (
          <div className="px-6 py-6">
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={goBack}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground">Nuestros Servicios</h2>
                <p className="text-xs text-muted-foreground">
                  Toca una categoria para ver los productos
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((category) => {
                const Icon = iconMap[category.icon] || Sparkles
                return (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category)}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-4 text-left backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card active:scale-[0.98]"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                      <Icon className="h-7 w-7 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
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
          </div>
        )}

        {/* CATEGORY DETAIL VIEW */}
        {view === "category-detail" && selectedCategory && (
          <div className="px-6 py-6">
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={goBack}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {selectedCategory.name}
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {selectedCategory.description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCategory.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectProduct(item)}
                  className="group overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-gold/30 text-left active:scale-[0.98]"
                >
                  <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
                    <Image
                      src="/images/logo.png"
                      alt={item.name}
                      width={40}
                      height={40}
                      className="opacity-20"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                      {item.price}
                    </div>
                    {item.videos && item.videos.length > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] text-foreground backdrop-blur-sm">
                        <Play className="h-3 w-3 text-gold" />
                        Ver video
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 text-sm font-semibold text-foreground line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                        {item.unit}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigateTo("contact")}
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
              >
                Cotizar ahora
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT DETAIL VIEW */}
        {view === "product-detail" && selectedProduct && (
          <div className="px-6 py-6">
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={goBack}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground line-clamp-1">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedCategory?.name}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Media section */}
              <div className="space-y-4">
                {/* Main media */}
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gold/10 via-card to-card">
                  {showVideo && selectedProduct.videos && selectedProduct.videos[currentVideoIndex] ? (
                    <div className="relative h-full w-full">
                      <video
                        ref={videoRef}
                        src={selectedProduct.videos[currentVideoIndex]}
                        className="h-full w-full object-cover"
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                      />
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5 text-foreground" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-gold" />
                        )}
                      </button>
                      <button
                        onClick={() => setShowVideo(false)}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm"
                      >
                        <X className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Image
                        src="/images/logo.png"
                        alt={selectedProduct.name}
                        width={80}
                        height={80}
                        className="opacity-20"
                      />
                      {selectedProduct.videos && selectedProduct.videos.length > 0 && (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="absolute inset-0 flex items-center justify-center bg-background/20 transition-colors hover:bg-background/30"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold shadow-lg shadow-gold/30">
                            <Play className="h-7 w-7 text-primary-foreground ml-1" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Video thumbnails */}
                {selectedProduct.videos && selectedProduct.videos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideoIndex(index)
                          setShowVideo(true)
                        }}
                        className={`flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg border transition-all ${
                          showVideo && currentVideoIndex === index
                            ? "border-gold bg-gold/20"
                            : "border-border bg-card/50 hover:border-gold/30"
                        }`}
                      >
                        <Play className="h-5 w-5 text-gold" />
                        <span className="ml-1 text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info section */}
              <div className="space-y-5">
                {/* Price badge */}
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-gold px-4 py-2 text-lg font-bold text-primary-foreground">
                    {selectedProduct.price}
                  </div>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                    {selectedProduct.unit}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedProduct.description}
                </p>

                {/* Service hours */}
                {selectedProduct.serviceHours && (
                  <div className="flex items-center gap-2 rounded-xl bg-card/50 border border-border p-3">
                    <Calendar className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duracion del servicio</p>
                      <p className="text-sm font-medium text-foreground">{selectedProduct.serviceHours}</p>
                    </div>
                  </div>
                )}

                {/* Includes */}
                {selectedProduct.includes && selectedProduct.includes.length > 0 && (
                  <div className="rounded-xl bg-card/50 border border-border p-4">
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Incluye
                    </h4>
                    <ul className="space-y-2">
                      {selectedProduct.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => navigateTo("contact")}
                  className="w-full rounded-full bg-gold py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-[0.98]"
                >
                  Cotizar este producto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT VIEW */}
        {view === "contact" && (
          <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-6 py-8">
            <div className="w-full max-w-md text-center">
              <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gold/10">
                <Send className="h-7 w-7 text-gold" />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Contactanos
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                Escanea el codigo QR para enviarnos un mensaje por WhatsApp o usa la informacion de contacto.
              </p>

              {/* QR Code */}
              <div className="mb-8 mx-auto flex flex-col items-center">
                <div className="rounded-2xl border border-border bg-white p-4 shadow-lg">
                  <QRCodeSVG
                    value="https://wa.me/5214427953753?text=Hola%2C%20los%20vi%20en%20la%20expo%20del%20Centro%20de%20Negocios%20de%20Queretaro%20y%20me%20interesa%20cotizar%20un%20evento"
                    size={180}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0a0a0a"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Escanea con tu celular para WhatsApp
                </p>
              </div>

              {/* Contact info */}
              <div className="mb-8 space-y-3">
                <a
                  href="https://wa.me/5214427953753?text=Hola%2C%20los%20vi%20en%20la%20expo%20del%20Centro%20de%20Negocios%20de%20Queretaro%20y%20me%20interesa%20cotizar%20un%20evento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-full bg-gold py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar WhatsApp
                </a>

                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone className="h-4 w-4 text-gold" />
                    442-795-3753
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="h-4 w-4 text-gold" />
                    proyectos360.qro@gmail.com
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo("welcome")}
                className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Kiosk footer - visible except in screensaver */}
      {view !== "screensaver" && (
        <footer className="sticky bottom-0 z-30 border-t border-border bg-card/95 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>EVENTOS 360 Queretaro</span>
            <span>Expo Centro de Negocios 2026</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Interactivo
            </span>
          </div>
        </footer>
      )}
    </div>
  )
}
