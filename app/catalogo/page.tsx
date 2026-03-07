"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Music,
  Flame,
  Zap,
  Disc,
  Armchair,
  UtensilsCrossed,
  Camera,
  Star,
  Search,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  ShoppingCart,
  Download,
  Send,
  Mail,
  X,
  FileText,
  Sparkles,
  Eye,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"

const iconMap: Record<string, React.ElementType> = {
  music: Music,
  flame: Flame,
  zap: Zap,
  disc: Disc,
  armchair: Armchair,
  bolt: Zap,
  utensils: UtensilsCrossed,
  camera: Camera,
  star: Star,
}

interface CartItem {
  item: CatalogItem
  quantity: number
}

interface CarouselState {
  scrollPosition: number
  canScrollLeft: boolean
  canScrollRight: boolean
}

// Carousel component for each category with independent state
function CategoryCarousel({
  category,
  cart,
  onAddToCart,
  onRemoveFromCart,
  getCartQuantity,
}: {
  category: CatalogCategory
  cart: CartItem[]
  onAddToCart: (item: CatalogItem) => void
  onRemoveFromCart: (itemId: string) => void
  getCartQuantity: (itemId: string) => number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [carouselState, setCarouselState] = useState<CarouselState>({
    scrollPosition: 0,
    canScrollLeft: false,
    canScrollRight: true,
  })
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
  const Icon = iconMap[category.icon] || Star

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCarouselState({
        scrollPosition: scrollLeft,
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 10,
      })
    }
  }, [])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", updateScrollState)
      updateScrollState()
      return () => scrollElement.removeEventListener("scroll", updateScrollState)
    }
  }, [updateScrollState])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="mb-16">
      {/* Category Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Icon className="h-7 w-7 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
            <p className="text-sm text-muted-foreground">
              {category.items.length} {category.items.length === 1 ? "producto" : "productos"} disponibles
            </p>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!carouselState.canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-gold hover:text-background hover:border-gold disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!carouselState.canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-gold hover:text-background hover:border-gold disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="carousel-container flex gap-5 overflow-x-auto pb-4"
      >
        {category.items.map((item, index) => (
          <ProductCard
            key={item.id}
            item={item}
            index={index}
            cartQuantity={getCartQuantity(item.id)}
            onAdd={() => onAddToCart(item)}
            onRemove={() => onRemoveFromCart(item.id)}
            onViewDetails={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          cartQuantity={getCartQuantity(selectedItem.id)}
          onClose={() => setSelectedItem(null)}
          onAdd={() => onAddToCart(selectedItem)}
          onRemove={() => onRemoveFromCart(selectedItem.id)}
        />
      )}
    </section>
  )
}

// Product Card Component
function ProductCard({
  item,
  index,
  cartQuantity,
  onAdd,
  onRemove,
  onViewDetails,
}: {
  item: CatalogItem
  index: number
  cartQuantity: number
  onAdd: () => void
  onRemove: () => void
  onViewDetails: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [imgError, setImgError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    <div
      ref={ref}
      className={`carousel-item group relative flex-shrink-0 w-[320px] overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 card-glow ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${cartQuantity > 0 ? "ring-2 ring-gold/50 border-gold/30" : "hover:border-gold/20"}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-secondary">
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover image-zoom"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/5 via-card to-card">
            <Sparkles className="h-12 w-12 text-gold/30" />
          </div>
        )}
        
        {/* Price Badge - Large and prominent */}
        <div className="absolute right-3 top-3 rounded-xl bg-gold px-4 py-2 shadow-lg pulse-glow">
          <span className="text-lg font-black text-background price-glow">{item.price}</span>
        </div>
        
        {/* Service Hours Badge */}
        {item.serviceHours && (
          <div className="absolute left-3 top-3 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur-sm border border-border">
            <span className="text-xs font-semibold text-foreground">{item.serviceHours}</span>
          </div>
        )}
        
        {/* Cart Quantity Badge */}
        {cartQuantity > 0 && (
          <div className="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-black text-background shadow-lg">
            {cartQuantity}
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm border border-border opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gold hover:text-background hover:border-gold"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver detalles
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-foreground leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Unit & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gold/80 bg-gold/10 px-2 py-1 rounded-md">
            {item.unit}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            {cartQuantity > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[28px] text-center text-sm font-bold text-foreground">
                  {cartQuantity}
                </span>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd()
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Detail Modal
function ProductDetailModal({
  item,
  cartQuantity,
  onClose,
  onAdd,
  onRemove,
}: {
  item: CatalogItem
  cartQuantity: number
  onClose: () => void
  onAdd: () => void
  onRemove: () => void
}) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl slide-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-gold hover:text-background"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="relative h-72 w-full overflow-hidden bg-secondary">
          {item.image && !imgError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/5 via-card to-card">
              <Sparkles className="h-16 w-16 text-gold/30" />
            </div>
          )}
          
          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6 pt-16">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-foreground">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="rounded-xl bg-gold px-5 py-3 shadow-lg">
                <span className="text-2xl font-black text-background">{item.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Hours */}
          {item.serviceHours && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2 border border-gold/20">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-foreground">{item.serviceHours}</span>
            </div>
          )}

          <p className="mb-6 text-base leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          {/* Includes List */}
          {item.includes && item.includes.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wider">
                Incluye:
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {item.includes.map((inc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                  >
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                    <span className="text-sm text-muted-foreground">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unit */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Precio por:</span>
            <span className="rounded-md bg-gold/10 px-2 py-1 text-xs font-semibold text-gold">
              {item.unit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center gap-3">
              {cartQuantity > 0 ? (
                <>
                  <button
                    onClick={onRemove}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="min-w-[40px] text-center text-xl font-bold text-foreground">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-background transition-all hover:bg-gold-light"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onAdd}
                  className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-base font-bold text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/30"
                >
                  <Plus className="h-5 w-5" />
                  Agregar a cotizacion
                </button>
              )}
            </div>
            
            {cartQuantity > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-xl font-black text-gold">
                  ${(item.priceValue * cartQuantity).toLocaleString()} MXN
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Tab Navigation
function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: {
  categories: CatalogCategory[]
  activeTab: string | null
  onTabChange: (id: string | null) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative mb-10">
      <div
        ref={scrollRef}
        className="carousel-container flex gap-2 overflow-x-auto pb-2"
      >
        <button
          onClick={() => onTabChange(null)}
          className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === null
              ? "tab-active text-background"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Todos
        </button>
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Star
          return (
            <button
              key={category.id}
              onClick={() => onTabChange(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === category.id
                  ? "tab-active text-background"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Cart Sidebar
function CartSidebar({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onClearCart,
  onExportPDF,
  onSendWhatsApp,
  onSendEmail,
}: {
  cart: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: string, delta: number) => void
  onClearCart: () => void
  onExportPDF: () => void
  onSendWhatsApp: () => void
  onSendEmail: () => void
}) {
  const total = cart.reduce((sum, c) => sum + c.item.priceValue * c.quantity, 0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-card border-l border-border shadow-2xl slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <ShoppingCart className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Tu Cotizacion</h2>
              <p className="text-sm text-muted-foreground">{cart.length} productos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-gold hover:text-background transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-lg font-semibold text-foreground">Tu cotizacion esta vacia</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Explora el catalogo y agrega productos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="overflow-hidden rounded-xl border border-border bg-background"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {cartItem.item.image ? (
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sparkles className="h-6 w-6 text-gold/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{cartItem.item.unit}</p>
                      <p className="mt-2 text-lg font-black text-gold">
                        ${(cartItem.item.priceValue * cartItem.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-gold hover:text-background transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-bold text-foreground">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-background p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total estimado:</span>
              <span className="text-3xl font-black text-gold">${total.toLocaleString()} MXN</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={onExportPDF}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground hover:bg-gold hover:text-background hover:border-gold transition-all"
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </button>
              <button
                onClick={onSendWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-background hover:bg-[#22c55e] transition-colors"
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </button>
            </div>

            <button
              onClick={onSendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground hover:bg-gold hover:text-background hover:border-gold transition-all mb-4"
            >
              <Mail className="h-4 w-4" />
              Enviar por Email
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Limpiar cotizacion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const filteredCategories = activeTab
    ? catalog.filter((c) => c.id === activeTab)
    : catalog

  const searchResults = searchQuery.trim()
    ? catalog
        .flatMap((cat) => cat.items)
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : []

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find((c) => c.item.id === itemId)
    return cartItem?.quantity || 0
  }

  const addToCart = (item: CatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
      }
      return prev.filter((c) => c.item.id !== itemId)
    })
  }

  const updateCartQuantity = (itemId: string, delta: number) => {
    if (delta > 0) {
      const item = cart.find((c) => c.item.id === itemId)?.item
      if (item) addToCart(item)
    } else {
      removeFromCart(itemId)
    }
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, c) => sum + c.item.priceValue * c.quantity, 0)

  const generateQuoteText = () => {
    const lines = cart.map(
      (c) =>
        `- ${c.item.name} x${c.quantity} ($${(c.item.priceValue * c.quantity).toLocaleString()} MXN)`
    )
    return `Cotizacion Eventos 360\n\nProductos seleccionados:\n${lines.join("\n")}\n\nTotal estimado: $${total.toLocaleString()} MXN`
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/quote/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cotizacion-eventos360-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        window.print()
      }
    } catch {
      window.print()
    }
  }

  const handleSendWhatsApp = () => {
    const text = generateQuoteText()
    window.open(
      `https://wa.me/5214427953753?text=${encodeURIComponent(text)}`,
      "_blank"
    )
  }

  const handleSendEmail = () => {
    const text = generateQuoteText()
    window.open(
      `mailto:Proyectos360.qro@gmail.com?subject=Cotizacion%20Eventos%20360&body=${encodeURIComponent(text)}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Inicio</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-foreground">Catalogo Premium</h1>
                <p className="text-xs text-muted-foreground">Productos y servicios</p>
              </div>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/30"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cotizacion</span>
            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-black text-background ring-2 ring-card">
                {cart.reduce((sum, c) => sum + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 border border-gold/20">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold text-gold">Catalogo Completo</span>
          </div>
          <h1 className="mb-4 text-4xl font-black text-foreground md:text-5xl lg:text-6xl text-balance">
            Productos y <span className="gradient-neon-text">Servicios</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Descubre nuestra completa gama de soluciones para eventos inolvidables.
            Todos los precios en pesos mexicanos (MXN).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos, paquetes, efectos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Cart Summary Banner */}
        {cart.length > 0 && !isCartOpen && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/5 p-5 glow-neon">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20">
                <FileText className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)} productos en tu cotizacion
                </p>
                <p className="text-sm text-muted-foreground">
                  Total estimado: <span className="font-bold text-gold">${total.toLocaleString()} MXN</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-background hover:bg-gold-light transition-colors"
            >
              Ver cotizacion
            </button>
          </div>
        )}

        {/* Search Results */}
        {searchQuery.trim() ? (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""} para{" "}
              <span className="font-semibold text-foreground">{`"${searchQuery}"`}</span>
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((item, i) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  cartQuantity={getCartQuantity(item.id)}
                  onAdd={() => addToCart(item)}
                  onRemove={() => removeFromCart(item.id)}
                  onViewDetails={() => {}}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <CategoryTabs
              categories={catalog}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Category Carousels */}
            {filteredCategories.map((category) => (
              <CategoryCarousel
                key={category.id}
                category={category}
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                getCartQuantity={getCartQuantity}
              />
            ))}
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
        onExportPDF={handleExportPDF}
        onSendWhatsApp={handleSendWhatsApp}
        onSendEmail={handleSendEmail}
      />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-quote,
          .print-quote * {
            visibility: visible;
          }
          .print-quote {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
