"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
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
  RotateCcw,
  CreditCard,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"

// Dynamically import Stripe checkout to avoid SSR issues
const StripeCheckout = dynamic(() => import("@/components/checkout/stripe-checkout"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
    </div>
  ),
})

const IVA_RATE = 0.16 // 16% Mexican IVA

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

// Flip Card Component - Front shows name, description, price; Back shows details
function FlipProductCard({
  item,
  index,
  cartQuantity,
  onAdd,
  onRemove,
}: {
  item: CatalogItem
  index: number
  cartQuantity: number
  onAdd: () => void
  onRemove: () => void
}) {
  const [isFlipped, setIsFlipped] = useState(false)
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

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div
      ref={ref}
      className={`flip-card flex-shrink-0 w-[340px] h-[480px] cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isFlipped ? "flipped" : ""}`}
      style={{ transitionDelay: `${index * 50}ms`, transition: "transform 0.5s, opacity 0.5s" }}
      onClick={handleFlip}
    >
      <div className="flip-card-inner w-full h-full">
        {/* Front of Card */}
        <div className={`flip-card-front rounded-2xl overflow-hidden card-hover-outline ${cartQuantity > 0 ? "border-gold/60" : ""}`}>
          {/* Image */}
          <div className="relative h-56 w-full overflow-hidden bg-secondary">
            {item.image && !imgError ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="340px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-background">
                <Sparkles className="h-14 w-14 text-gold/40" />
              </div>
            )}
            
            {/* Price Badge */}
            <div className="absolute right-3 top-3 rounded-xl bg-gradient-to-r from-neon-orange to-gold px-4 py-2 shadow-lg">
              <span className="text-lg font-bold text-background">{item.price}</span>
            </div>
            
            {/* Cart Badge */}
            {cartQuantity > 0 && (
              <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-base font-bold text-background shadow-lg">
                {cartQuantity}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 bg-card h-[224px] flex flex-col">
            <h3 className="text-xl font-semibold text-foreground leading-tight mb-2 line-clamp-2">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
              {item.description}
            </p>
            
            {/* Service Hours & Unit */}
            <div className="mt-3 flex items-center justify-between">
              {item.serviceHours && (
                <span className="text-xs font-medium text-gold bg-gold/10 px-3 py-1.5 rounded-lg border border-gold/20">
                  {item.serviceHours}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{item.unit}</span>
            </div>

            {/* Flip hint */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-3 w-3" />
              <span>Toca para ver detalles</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back rounded-2xl overflow-hidden card-hover-outline bg-card">
          <div className="p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gold">{item.price}</span>
                <p className="text-xs text-muted-foreground">{item.unit}</p>
              </div>
            </div>

            {/* Service Hours */}
            {item.serviceHours && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gold bg-gold/10 px-3 py-2 rounded-lg border border-gold/20">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">{item.serviceHours}</span>
              </div>
            )}

            {/* Includes List */}
            {item.includes && item.includes.length > 0 && (
              <div className="flex-1 overflow-y-auto mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Incluye:
                </h4>
                <ul className="space-y-1.5">
                  {item.includes.slice(0, 8).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      <span className="leading-tight">{inc}</span>
                    </li>
                  ))}
                  {item.includes.length > 8 && (
                    <li className="text-xs text-muted-foreground">
                      +{item.includes.length - 8} mas...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
              {cartQuantity > 0 ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all hover-outline"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[28px] text-center text-lg font-semibold text-foreground">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAdd()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-neon-orange to-gold text-background transition-all hover:shadow-lg hover:shadow-gold/30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-right">
                    <span className="text-sm text-muted-foreground">Subtotal:</span>
                    <p className="text-lg font-bold text-gold">
                      ${(item.priceValue * cartQuantity).toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdd()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-orange to-gold px-4 py-3 text-sm font-semibold text-background hover:shadow-lg hover:shadow-gold/30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Agregar a cotizacion
                </button>
              )}
            </div>

            {/* Flip back hint */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-3 w-3" />
              <span>Toca para volver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
      const scrollAmount = 360
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30">
            <Icon className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">{category.name}</h2>
            <p className="text-sm text-muted-foreground">
              {category.items.length} {category.items.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!carouselState.canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground hover-outline"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!carouselState.canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-gold hover:text-gold disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground hover-outline"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="carousel-premium flex gap-5 overflow-x-auto pb-4 pr-4"
      >
        {category.items.map((item, index) => (
          <FlipProductCard
            key={item.id}
            item={item}
            index={index}
            cartQuantity={getCartQuantity(item.id)}
            onAdd={() => onAddToCart(item)}
            onRemove={() => onRemoveFromCart(item.id)}
          />
        ))}
      </div>
    </section>
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
        className="carousel-premium flex gap-2 overflow-x-auto pb-2"
      >
        <button
          onClick={() => onTabChange(null)}
          className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover-outline ${
            activeTab === null
              ? "bg-gradient-to-r from-neon-orange to-gold text-background shadow-lg shadow-gold/30"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold"
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
              className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover-outline ${
                activeTab === category.id
                  ? "bg-gradient-to-r from-neon-orange to-gold text-background shadow-lg shadow-gold/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold"
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

// Payment method selection
type PaymentMethod = "stripe" | "mercadopago" | null

// Cart Sidebar with IVA calculation and payment options
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
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const subtotal = cart.reduce((sum, c) => sum + c.item.priceValue * c.quantity, 0)
  const iva = subtotal * IVA_RATE
  const total = subtotal + iva

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      setSelectedPayment(null)
      setShowCheckout(false)
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method)
    if (method === "stripe") {
      setShowCheckout(true)
    } else if (method === "mercadopago") {
      // For MercadoPago, open WhatsApp with the quote
      const text = `Hola! Me gustaria pagar mi cotizacion con MercadoPago:\n\n${cart.map(c => `- ${c.item.name} x${c.quantity}`).join('\n')}\n\nSubtotal: $${subtotal.toLocaleString()} MXN\nIVA (16%): $${iva.toLocaleString()} MXN\nTotal: $${total.toLocaleString()} MXN`
      window.open(`https://wa.me/5214427953753?text=${encodeURIComponent(text)}`, "_blank")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-card border-l border-border shadow-2xl slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30">
              <ShoppingCart className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Tu Cotizacion</h2>
              <p className="text-sm text-muted-foreground">{cart.length} productos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-gold hover:text-background transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {showCheckout && selectedPayment === "stripe" ? (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowCheckout(false)
                  setSelectedPayment(null)
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la cotizacion
              </button>
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
                </div>
              }>
                <StripeCheckout
                  items={cart.map(c => ({
                    id: c.item.id,
                    name: c.item.name,
                    priceValue: c.item.priceValue,
                    quantity: c.quantity,
                    unit: c.item.unit,
                  }))}
                  subtotal={subtotal}
                  iva={iva}
                  total={total}
                />
              </Suspense>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
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
                  className="overflow-hidden rounded-xl border border-border bg-background card-hover-outline"
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
                          <Sparkles className="h-6 w-6 text-gold/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cartItem.item.unit}</p>
                      <p className="mt-2 text-base font-bold text-gold">
                        ${(cartItem.item.priceValue * cartItem.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-gold hover:text-background transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-semibold text-foreground">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
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

        {/* Footer with IVA breakdown and payment options */}
        {cart.length > 0 && !showCheckout && (
          <div className="border-t border-border bg-background p-5">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">${subtotal.toLocaleString()} MXN</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">IVA (16%):</span>
                <span className="font-medium text-foreground">${iva.toLocaleString()} MXN</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-base font-semibold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-gold">${total.toLocaleString()} MXN</span>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={onExportPDF}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:border-gold hover:text-gold transition-all hover-outline"
              >
                <Download className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={onSendWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-medium text-white hover:bg-[#22c55e] transition-all"
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </button>
            </div>

            <button
              onClick={onSendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:border-gold hover:text-gold transition-all mb-4 hover-outline"
            >
              <Mail className="h-4 w-4" />
              Enviar por Email
            </button>

            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Metodos de Pago
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePaymentSelect("stripe")}
                  className={`payment-badge flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                    selectedPayment === "stripe" ? "selected" : ""
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-[#635BFF]" />
                  <span className="text-xs font-medium text-foreground">Tarjeta</span>
                  <span className="text-[10px] text-muted-foreground">Stripe</span>
                </button>
                <button
                  onClick={() => handlePaymentSelect("mercadopago")}
                  className={`payment-badge flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                    selectedPayment === "mercadopago" ? "selected" : ""
                  }`}
                >
                  <div className="h-6 w-6 rounded bg-[#00B1EA] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">MP</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">MercadoPago</span>
                  <span className="text-[10px] text-muted-foreground">Via WhatsApp</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClearCart}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-2 mt-4"
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

  const subtotal = cart.reduce((sum, c) => sum + c.item.priceValue * c.quantity, 0)
  const iva = subtotal * IVA_RATE
  const total = subtotal + iva

  const generateQuoteText = () => {
    const lines = cart.map(
      (c) =>
        `- ${c.item.name} x${c.quantity} ($${(c.item.priceValue * c.quantity).toLocaleString()} MXN)`
    )
    return `Cotizacion Eventos 360\n\nProductos seleccionados:\n${lines.join("\n")}\n\nSubtotal: $${subtotal.toLocaleString()} MXN\nIVA (16%): $${iva.toLocaleString()} MXN\nTotal: $${total.toLocaleString()} MXN`
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/quote/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, subtotal, iva, total }),
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-all hover:text-gold"
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
                className="rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold text-foreground">Catalogo</h1>
                <p className="text-xs text-muted-foreground">Productos y servicios</p>
              </div>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-orange to-gold px-4 py-2.5 text-sm font-medium text-background hover:shadow-lg hover:shadow-gold/30 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cotizacion</span>
            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background ring-2 ring-card">
                {cart.reduce((sum, c) => sum + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 border border-gold/20">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Catalogo Completo</span>
          </div>
          <h1 className="mb-4 text-3xl md:text-4xl font-semibold text-foreground">
            Productos y <span className="text-gold">Servicios</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            Descubre nuestra gama de soluciones para eventos. Precios en MXN + IVA.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-5 text-base text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Cart Summary Banner */}
        {cart.length > 0 && !isCartOpen && (
          <div className="mb-10 flex items-center justify-between rounded-xl border border-gold/30 bg-gold/5 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 border border-gold/30">
                <FileText className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)} productos
                </p>
                <p className="text-xs text-muted-foreground">
                  Total: <span className="font-medium text-gold">${total.toLocaleString()} MXN</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-lg bg-gradient-to-r from-neon-orange to-gold px-4 py-2 text-sm font-medium text-background hover:shadow-lg hover:shadow-gold/30 transition-all"
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
              <span className="font-medium text-foreground">&quot;{searchQuery}&quot;</span>
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((item, i) => (
                <FlipProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  cartQuantity={getCartQuantity(item.id)}
                  onAdd={() => addToCart(item)}
                  onRemove={() => removeFromCart(item.id)}
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
