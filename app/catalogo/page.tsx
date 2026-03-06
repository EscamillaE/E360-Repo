"use client"

import { useState, useRef, useEffect } from "react"
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
  Plus,
  Minus,
  ShoppingCart,
  Download,
  Send,
  Mail,
  X,
  FileText,
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

function CategoryCard({
  category,
  onClick,
  index,
}: {
  category: CatalogCategory
  onClick: () => void
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const Icon = iconMap[category.icon] || Star

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-700 hover:border-gold/30 hover:bg-card/80 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
          <Icon className="h-6 w-6 text-gold" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {category.name}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {category.items.length} {category.items.length === 1 ? "producto" : "productos"}
          </span>
          <ChevronRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  )
}

function ProductCard({ 
  item, 
  index, 
  cartQuantity,
  onAdd,
  onRemove 
}: { 
  item: CatalogItem
  index: number
  cartQuantity: number
  onAdd: () => void
  onRemove: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
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
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-700 hover:border-gold/30 hover:bg-card/80 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${cartQuantity > 0 ? "ring-2 ring-gold/40" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary">
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
            <Image
              src="/images/logo.png"
              alt={item.name}
              width={60}
              height={60}
              className="opacity-20"
            />
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
        
        {/* Includes toggle */}
        {item.includes && item.includes.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-medium text-gold hover:text-gold-light transition-colors"
            >
              {showDetails ? "Ocultar detalles" : `Ver que incluye (${item.includes.length})`}
            </button>
            {showDetails && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground max-h-32 overflow-y-auto">
                {item.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-gold mt-0.5">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.unit}</span>
          
          {/* Add/Remove buttons */}
          <div className="flex items-center gap-2">
            {cartQuantity > 0 && (
              <button
                onClick={onRemove}
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
              onClick={onAdd}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary-foreground hover:bg-gold-light transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
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
                          <Image
                            src="/images/logo.png"
                            alt=""
                            width={24}
                            height={24}
                            className="opacity-20"
                          />
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

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

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
        // Fallback: open print dialog
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
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h1 className="text-lg font-bold text-foreground hidden sm:block">
                Catalogo de Productos
              </h1>
            </div>
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
        {/* Search */}
        <div className="relative mb-8">
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, i) => (
                <ProductCard 
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
        )}

        {/* Category view */}
        {!searchQuery.trim() && selectedCategory && activeCategory && (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver a categorias
            </button>

            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                {activeCategory.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeCategory.description}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeCategory.items.map((item, i) => (
                <ProductCard 
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
        )}

        {/* Categories grid */}
        {!searchQuery.trim() && !selectedCategory && (
          <div>
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                Nuestro Catalogo Completo
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
                Productos y Servicios
              </h2>
              <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
                Descubre nuestra completa gama de soluciones para eventos
                inolvidables. Todos los precios en pesos mexicanos (MXN).
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((category, i) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => setSelectedCategory(category.id)}
                  index={i}
                />
              ))}
            </div>
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
      `}</style>
    </div>
  )
}
