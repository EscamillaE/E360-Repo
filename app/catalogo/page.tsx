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
      const scrollAmount = 380
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="mb-20">
      {/* Category Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-neon-orange/10 border border-gold/30 shadow-lg shadow-gold/10">
            <Icon className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{category.name}</h2>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              {category.items.length} {category.items.length === 1 ? "producto" : "productos"} disponibles
            </p>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!carouselState.canScrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-all hover:bg-gold hover:text-background hover:border-gold hover:shadow-lg hover:shadow-gold/30 disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border disabled:hover:shadow-none"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!carouselState.canScrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-all hover:bg-gold hover:text-background hover:border-gold hover:shadow-lg hover:shadow-gold/30 disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border disabled:hover:shadow-none"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="carousel-premium flex gap-6 overflow-x-auto pb-6 pr-6"
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
      className={`group relative flex-shrink-0 w-[360px] overflow-hidden rounded-3xl premium-card ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${cartQuantity > 0 ? "border-gold/50 border-glow-animate" : ""}`}
      style={{ transitionDelay: `${index * 50}ms`, transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-secondary">
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover image-zoom"
            onError={() => setImgError(true)}
            sizes="360px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-background">
            <Sparkles className="h-16 w-16 text-gold/40" />
          </div>
        )}
        
        {/* Image Overlay */}
        <div className="absolute inset-0 image-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge - Large and prominent */}
        <div className="absolute right-4 top-4 price-badge rounded-2xl px-5 py-3 shadow-2xl">
          <span className="text-xl md:text-2xl font-black text-background">{item.price}</span>
        </div>
        
        {/* Service Hours Badge */}
        {item.serviceHours && (
          <div className="absolute left-4 top-4 rounded-xl bg-background/95 px-4 py-2 backdrop-blur-md border border-border/50 shadow-lg">
            <span className="text-sm font-bold text-foreground">{item.serviceHours}</span>
          </div>
        )}
        
        {/* Cart Quantity Badge */}
        {cartQuantity > 0 && (
          <div className="absolute left-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-black text-background shadow-lg shadow-gold/40 border-2 border-background/20">
            {cartQuantity}
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-background/95 px-4 py-2.5 text-sm font-bold text-foreground backdrop-blur-md border border-border/50 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gold hover:text-background hover:border-gold"
        >
          <Eye className="h-4 w-4" />
          Ver detalles
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-3 text-xl md:text-2xl font-black text-foreground leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="mb-5 text-base leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Unit & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gold bg-gold/15 px-4 py-2 rounded-xl border border-gold/20">
            {item.unit}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            {cartQuantity > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-105"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-[32px] text-center text-lg font-black text-foreground">
                  {cartQuantity}
                </span>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd()
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl btn-premium text-background hover:scale-105"
            >
              <Plus className="h-5 w-5" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl slide-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-muted-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-background hover:scale-105"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image */}
        <div className="relative h-80 w-full overflow-hidden bg-secondary">
          {item.image && !imgError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-background">
              <Sparkles className="h-20 w-20 text-gold/40" />
            </div>
          )}
          
          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-8 pt-24">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight">{item.name}</h2>
                <p className="text-lg text-muted-foreground mt-1">{item.category}</p>
              </div>
              <div className="price-badge rounded-2xl px-6 py-4 shadow-2xl">
                <span className="text-2xl md:text-3xl font-black text-background">{item.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Service Hours */}
          {item.serviceHours && (
            <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-gold/15 px-5 py-3 border border-gold/30">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="text-base font-bold text-foreground">{item.serviceHours}</span>
            </div>
          )}

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          {/* Includes List */}
          {item.includes && item.includes.length > 0 && (
            <div className="mb-8">
              <h4 className="mb-4 text-base font-black text-foreground uppercase tracking-wider">
                Incluye:
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {item.includes.map((inc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-secondary/60 px-4 py-3 border border-border/50"
                  >
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold shadow-sm shadow-gold/50" />
                    <span className="text-base text-muted-foreground leading-relaxed">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unit */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-base text-muted-foreground">Precio por:</span>
            <span className="rounded-xl bg-gold/15 px-4 py-2 text-base font-bold text-gold border border-gold/30">
              {item.unit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border pt-8">
            <div className="flex items-center gap-4">
              {cartQuantity > 0 ? (
                <>
                  <button
                    onClick={onRemove}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-105"
                  >
                    <Minus className="h-6 w-6" />
                  </button>
                  <span className="min-w-[48px] text-center text-2xl font-black text-foreground">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl btn-premium text-background hover:scale-105"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onAdd}
                  className="flex items-center gap-3 rounded-2xl btn-premium px-8 py-4 text-lg font-black text-background"
                >
                  <Plus className="h-6 w-6" />
                  Agregar a cotizacion
                </button>
              )}
            </div>
            
            {cartQuantity > 0 && (
              <div className="text-right">
                <p className="text-base text-muted-foreground">Subtotal</p>
                <p className="text-2xl md:text-3xl font-black text-gold">
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
    <div className="relative mb-12">
      <div
        ref={scrollRef}
        className="carousel-premium flex gap-3 overflow-x-auto pb-3"
      >
        <button
          onClick={() => onTabChange(null)}
          className={`flex-shrink-0 flex items-center gap-3 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
            activeTab === null
              ? "tab-premium-active"
              : "bg-card border-2 border-border text-muted-foreground hover:text-foreground hover:border-gold/40 hover:bg-gold/5"
          }`}
        >
          <Sparkles className="h-5 w-5" />
          Todos
        </button>
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Star
          return (
            <button
              key={category.id}
              onClick={() => onTabChange(category.id)}
              className={`flex-shrink-0 flex items-center gap-3 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
                activeTab === category.id
                  ? "tab-premium-active"
                  : "bg-card border-2 border-border text-muted-foreground hover:text-foreground hover:border-gold/40 hover:bg-gold/5"
              }`}
            >
              <Icon className="h-5 w-5" />
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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col bg-card border-l border-border shadow-2xl slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 border border-gold/30">
              <ShoppingCart className="h-7 w-7 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Tu Cotizacion</h2>
              <p className="text-base text-muted-foreground">{cart.length} productos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-gold hover:text-background transition-all hover:scale-105"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <p className="text-xl font-bold text-foreground">Tu cotizacion esta vacia</p>
              <p className="mt-3 text-base text-muted-foreground">
                Explora el catalogo y agrega productos
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="overflow-hidden rounded-2xl border border-border bg-background premium-card"
                >
                  <div className="flex gap-5 p-5">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                      {cartItem.item.image ? (
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sparkles className="h-8 w-8 text-gold/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-black text-foreground truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{cartItem.item.unit}</p>
                      <p className="mt-3 text-xl font-black text-gold">
                        ${(cartItem.item.priceValue * cartItem.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-gold hover:text-background transition-all"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <span className="text-base font-black text-foreground">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
                      >
                        <Minus className="h-5 w-5" />
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
          <div className="border-t border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base text-muted-foreground">Total estimado:</span>
              <span className="text-3xl md:text-4xl font-black text-gold">${total.toLocaleString()} MXN</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <button
                onClick={onExportPDF}
                className="flex items-center justify-center gap-3 rounded-xl border-2 border-border bg-card py-4 text-base font-bold text-foreground hover:bg-gold hover:text-background hover:border-gold transition-all"
              >
                <Download className="h-5 w-5" />
                Descargar PDF
              </button>
              <button
                onClick={onSendWhatsApp}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 text-base font-bold text-background hover:bg-[#22c55e] transition-all"
              >
                <Send className="h-5 w-5" />
                WhatsApp
              </button>
            </div>

            <button
              onClick={onSendEmail}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-card py-4 text-base font-bold text-foreground hover:bg-gold hover:text-background hover:border-gold transition-all mb-5"
            >
              <Mail className="h-5 w-5" />
              Enviar por Email
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-base text-muted-foreground hover:text-destructive transition-colors py-2"
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
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-all hover:text-gold"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="text-base font-semibold hidden sm:inline">Inicio</span>
            </Link>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-foreground">Catalogo Premium</h1>
                <p className="text-sm text-muted-foreground">Productos y servicios</p>
              </div>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-3 rounded-xl btn-premium px-6 py-3 text-base font-bold text-background"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cotizacion</span>
            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-sm font-black text-background ring-2 ring-card">
                {cart.reduce((sum, c) => sum + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gold/15 px-6 py-3 border border-gold/30">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="text-base font-bold text-gold">Catalogo Completo</span>
          </div>
          <h1 className="mb-6 hero-title font-black text-foreground text-balance">
            Productos y <span className="gradient-neon-text">Servicios</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Descubre nuestra completa gama de soluciones para eventos inolvidables.
            Todos los precios en pesos mexicanos (MXN).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos, paquetes, efectos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card py-5 pl-14 pr-6 text-lg text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Cart Summary Banner */}
        {cart.length > 0 && !isCartOpen && (
          <div className="mb-12 flex items-center justify-between rounded-3xl border-2 border-gold/40 bg-gold/10 p-6 glow-neon">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/25 border border-gold/30">
                <FileText className="h-7 w-7 text-gold" />
              </div>
              <div>
                <p className="text-lg font-black text-foreground">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)} productos en tu cotizacion
                </p>
                <p className="text-base text-muted-foreground">
                  Total estimado: <span className="font-black text-gold">${total.toLocaleString()} MXN</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-xl btn-premium px-6 py-3 text-base font-bold text-background"
            >
              Ver cotizacion
            </button>
          </div>
        )}

        {/* Search Results */}
        {searchQuery.trim() ? (
          <div>
            <p className="mb-8 text-lg text-muted-foreground">
              {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""} para{" "}
              <span className="font-bold text-foreground">{`"${searchQuery}"`}</span>
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
