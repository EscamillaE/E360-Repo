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
  Shuffle,
  Grid3X3,
  Layers,
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

// Shuffle Card Stack Component
function ShuffleCardStack({
  items,
  cartQuantities,
  onAdd,
  onRemove,
}: {
  items: CatalogItem[]
  cartQuantities: Record<string, number>
  onAdd: (item: CatalogItem) => void
  onRemove: (itemId: string) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)

  const handleNext = useCallback(() => {
    if (isShuffling || items.length <= 1) return
    setDirection("left")
    setIsShuffling(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
      setIsShuffling(false)
      setDirection(null)
    }, 300)
  }, [isShuffling, items.length])

  const handlePrev = useCallback(() => {
    if (isShuffling || items.length <= 1) return
    setDirection("right")
    setIsShuffling(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
      setIsShuffling(false)
      setDirection(null)
    }, 300)
  }, [isShuffling, items.length])

  const handleShuffle = () => {
    if (isShuffling || items.length <= 1) return
    setIsShuffling(true)
    setDirection("left")
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length)
      setCurrentIndex(randomIndex)
      setIsShuffling(false)
      setDirection(null)
    }, 300)
  }

  // Touch/Mouse drag handling
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    startXRef.current = clientX
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - startXRef.current
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (Math.abs(dragOffset) > 80) {
      if (dragOffset > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    setDragOffset(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNext, handlePrev])

  if (items.length === 0) return null

  const getCardStyle = (index: number) => {
    const relativeIndex = (index - currentIndex + items.length) % items.length
    const isActive = relativeIndex === 0
    const isNext = relativeIndex === 1 || (currentIndex === items.length - 1 && index === 0)
    const isPrev = relativeIndex === items.length - 1 || (currentIndex === 0 && index === items.length - 1)

    let transform = "scale(0.85) translateY(40px)"
    let zIndex = 0
    let opacity = 0

    if (isActive) {
      const dragTransform = isDragging ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.02}deg)` : ""
      const shuffleTransform = isShuffling
        ? direction === "left"
          ? "translateX(-120%) rotate(-15deg)"
          : "translateX(120%) rotate(15deg)"
        : ""
      transform = `scale(1) translateY(0) ${shuffleTransform || dragTransform}`
      zIndex = 30
      opacity = 1
    } else if (isNext) {
      transform = "scale(0.92) translateY(16px) translateX(24px)"
      zIndex = 20
      opacity = 0.7
    } else if (isPrev) {
      transform = "scale(0.92) translateY(16px) translateX(-24px)"
      zIndex = 20
      opacity = 0.7
    } else if (relativeIndex === 2) {
      transform = "scale(0.84) translateY(32px) translateX(48px)"
      zIndex = 10
      opacity = 0.4
    } else if (relativeIndex === items.length - 2) {
      transform = "scale(0.84) translateY(32px) translateX(-48px)"
      zIndex = 10
      opacity = 0.4
    }

    return {
      transform,
      zIndex,
      opacity,
      transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }

  const currentItem = items[currentIndex]
  const cartQuantity = cartQuantities[currentItem?.id] || 0

  return (
    <div className="flex flex-col items-center">
      {/* Card Stack */}
      <div 
        ref={containerRef}
        className="relative h-[480px] w-full max-w-sm mx-auto mb-6 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {items.map((item, index) => {
          const style = getCardStyle(index)
          const itemCartQty = cartQuantities[item.id] || 0
          
          return (
            <div
              key={item.id}
              className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden shadow-xl"
              style={style}
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-secondary">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
                    <Star className="h-12 w-12 text-gold/30" />
                  </div>
                )}
                {/* Price badge */}
                <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-lg">
                  {item.price}
                </div>
                {/* Service hours badge */}
                {item.serviceHours && (
                  <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {item.serviceHours}
                  </div>
                )}
                {/* Cart quantity badge */}
                {itemCartQty > 0 && (
                  <div className="absolute left-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-primary-foreground shadow-lg">
                    {itemCartQty}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-medium text-gold mb-1">{item.category}</p>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  {item.name}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.unit}</span>
                  
                  {/* Add/Remove buttons */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {itemCartQty > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemove(item.id)
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                    {itemCartQty > 0 && (
                      <span className="min-w-[28px] text-center text-sm font-bold text-foreground">
                        {itemCartQty}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAdd(item)
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-primary-foreground hover:bg-gold-light transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={items.length <= 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {items.slice(0, Math.min(5, items.length)).map((_, index) => {
            const actualIndex = items.length > 5 
              ? (currentIndex - 2 + index + items.length) % items.length 
              : index
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`h-2 rounded-full transition-all ${
                  actualIndex === currentIndex 
                    ? "w-6 bg-gold" 
                    : "w-2 bg-border hover:bg-muted-foreground"
                }`}
              />
            )
          })}
          {items.length > 5 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{items.length - 5}
            </span>
          )}
        </div>
        
        <button
          onClick={handleNext}
          disabled={items.length <= 1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleShuffle}
          disabled={items.length <= 1}
          className="flex h-11 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 text-sm font-medium text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
        >
          <Shuffle className="h-4 w-4" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      {/* Counter */}
      <p className="mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} / {items.length}
      </p>
    </div>
  )
}

// Category Pill Button
function CategoryPill({
  category,
  isActive,
  onClick,
}: {
  category: CatalogCategory
  isActive: boolean
  onClick: () => void
}) {
  const Icon = iconMap[category.icon] || Star
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? "bg-gold text-primary-foreground shadow-lg"
          : "bg-card border border-border text-foreground hover:border-gold/30 hover:bg-card/80"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{category.name}</span>
      <span className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        ({category.items.length})
      </span>
    </button>
  )
}

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-background border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
              <ShoppingCart className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Tu Cotizacion</h2>
              <p className="text-xs text-muted-foreground">{cart.length} productos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">Tu cotizacion esta vacia</p>
              <p className="mt-1 text-sm text-muted-foreground/70">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="rounded-xl border border-border bg-card/50 p-3"
                >
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {cartItem.item.image ? (
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Star className="h-6 w-6 text-gold/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{cartItem.item.unit}</p>
                      <p className="mt-1 text-sm font-bold text-gold">
                        ${(cartItem.item.priceValue * cartItem.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold text-foreground">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                      >
                        <Minus className="h-3 w-3" />
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
          <div className="border-t border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total estimado:</span>
              <span className="text-2xl font-bold text-gold">${total.toLocaleString()} MXN</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={onExportPDF}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-card/80 transition-colors"
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </button>
              <button
                onClick={onSendWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white hover:bg-[#22c55e] transition-colors"
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
            
            <button
              onClick={onSendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-card/80 transition-colors mb-3"
            >
              <Mail className="h-4 w-4" />
              Enviar por Email
            </button>
            
            <button
              onClick={onClearCart}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpiar cotizacion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Grid view for products
function ProductGrid({
  items,
  cartQuantities,
  onAdd,
  onRemove,
}: {
  items: CatalogItem[]
  cartQuantities: Record<string, number>
  onAdd: (item: CatalogItem) => void
  onRemove: (itemId: string) => void
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const cartQuantity = cartQuantities[item.id] || 0
        
        return (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-card/80 ${
              cartQuantity > 0 ? "ring-2 ring-gold/40" : ""
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-secondary">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
                  <Star className="h-10 w-10 text-gold/30" />
                </div>
              )}
              {/* Price badge */}
              <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-primary-foreground">
                {item.price}
              </div>
              {/* Service hours badge */}
              {item.serviceHours && (
                <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
                  {item.serviceHours}
                </div>
              )}
              {/* Cart quantity badge */}
              {cartQuantity > 0 && (
                <div className="absolute left-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-primary-foreground">
                  {cartQuantity}
                </div>
              )}
            </div>

            <div className="p-5">
              <h4 className="mb-1 text-base font-semibold text-foreground">
                {item.name}
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.unit}</span>
                
                {/* Add/Remove buttons */}
                <div className="flex items-center gap-2">
                  {cartQuantity > 0 && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                  {cartQuantity > 0 && (
                    <span className="min-w-[24px] text-center text-sm font-semibold text-foreground">
                      {cartQuantity}
                    </span>
                  )}
                  <button
                    onClick={() => onAdd(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary-foreground hover:bg-gold-light transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"shuffle" | "grid">("shuffle")
  const categoriesRef = useRef<HTMLDivElement>(null)

  const activeCategory = catalog.find((c) => c.id === selectedCategory)

  const filteredItems = searchQuery.trim()
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

  const cartQuantities = cart.reduce((acc, c) => {
    acc[c.item.id] = c.quantity
    return acc
  }, {} as Record<string, number>)

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
      (c) => `- ${c.item.name} x${c.quantity} ($${(c.item.priceValue * c.quantity).toLocaleString()} MXN)`
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

  // Scroll categories horizontally
  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesRef.current) {
      const scrollAmount = 200
      categoriesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Inicio</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <h1 className="text-lg font-bold text-foreground">
              <span className="hidden sm:inline">Catalogo de </span>Productos
            </h1>
          </div>
          
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold-light transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cotizacion</span>
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {cart.reduce((sum, c) => sum + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Search & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos, paquetes, efectos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value) setSelectedCategory(null)
              }}
              className="w-full rounded-xl border border-border bg-card/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          
          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card/50 p-1">
            <button
              onClick={() => setViewMode("shuffle")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "shuffle"
                  ? "bg-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {!searchQuery.trim() && (
          <div className="relative mb-8">
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div
              ref={categoriesRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-gold text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-gold/30 hover:bg-card/80"
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Todos</span>
              </button>
              {catalog.map((category) => (
                <CategoryPill
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
            
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Quick cart summary */}
        {cart.length > 0 && !isCartOpen && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-gold/30 bg-gold/10 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)} productos en tu cotizacion
                </p>
                <p className="text-xs text-muted-foreground">
                  Total: ${total.toLocaleString()} MXN
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-gold-light transition-colors"
            >
              Ver cotizacion
            </button>
          </div>
        )}

        {/* Search results */}
        {searchQuery.trim() && (
          <div className="mb-8">
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredItems.length} resultado{filteredItems.length !== 1 ? "s" : ""} para{" "}
              {'"'}{searchQuery}{'"'}
            </p>
            {viewMode === "shuffle" ? (
              <ShuffleCardStack
                items={filteredItems}
                cartQuantities={cartQuantities}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ) : (
              <ProductGrid
                items={filteredItems}
                cartQuantities={cartQuantities}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            )}
          </div>
        )}

        {/* Category Products */}
        {!searchQuery.trim() && (
          <div>
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                {activeCategory ? activeCategory.name : "Nuestro Catalogo Completo"}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
                {activeCategory ? `${activeCategory.items.length} Productos` : "Productos y Servicios"}
              </h2>
              <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
                {activeCategory
                  ? activeCategory.description
                  : "Descubre nuestra completa gama de soluciones para eventos inolvidables. Todos los precios en pesos mexicanos (MXN)."}
              </p>
            </div>

            {viewMode === "shuffle" ? (
              <ShuffleCardStack
                items={activeCategory ? activeCategory.items : catalog.flatMap((c) => c.items)}
                cartQuantities={cartQuantities}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ) : (
              <ProductGrid
                items={activeCategory ? activeCategory.items : catalog.flatMap((c) => c.items)}
                cartQuantities={cartQuantities}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            )}
          </div>
        )}
      </div>

      {/* Cart sidebar */}
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

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-quote, .print-quote * {
            visibility: visible;
          }
          .print-quote {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
