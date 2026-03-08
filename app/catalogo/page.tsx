"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
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
  Play,
  Layers,
  Eye,
  EyeOff,
  Sparkles,
  GripVertical,
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

interface QuoteItem {
  item: CatalogItem
  quantity: number
}

// Video Showcase Component for Cabina 360
function VideoShowcase({ videos }: { videos: string[] }) {
  const [currentVideo, setCurrentVideo] = useState(0)

  if (!videos || videos.length === 0) return null

  return (
    <div className="relative w-full aspect-[9/16] max-h-[400px] rounded-2xl overflow-hidden bg-black/90">
      <video
        key={videos[currentVideo]}
        src={videos[currentVideo]}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      {videos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentVideo ? "bg-gold w-6" : "bg-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Service Card Component with drag-to-quote
function ServiceCard({
  item,
  isCenter,
  onTap,
  onDragToQuote,
  showPrice,
}: {
  item: CatalogItem
  isCenter: boolean
  onTap: () => void
  onDragToQuote: (item: CatalogItem) => void
  showPrice: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingDown, setIsDraggingDown] = useState(false)
  const y = useMotionValue(0)
  const dragOpacity = useTransform(y, [0, 100], [1, 0.5])
  const dragScale = useTransform(y, [0, 100], [1, 0.9])

  const handleDragEnd = (_: never, info: PanInfo) => {
    if (info.offset.y > 80) {
      onDragToQuote(item)
    }
    setIsDraggingDown(false)
  }

  return (
    <motion.div
      className={`relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isCenter ? "scale-100 z-10" : "scale-90 opacity-70"
      }`}
      style={{ opacity: dragOpacity, scale: dragScale, y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDrag={(_, info) => {
        if (info.offset.y > 20) setIsDraggingDown(true)
      }}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        {/* Image / Video Section */}
        <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
          {item.videos && item.videos.length > 0 ? (
            <video
              src={item.videos[0]}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
              <Star className="h-16 w-16 text-gold/30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground">
            {item.category}
          </div>
          
          {/* Service hours */}
          {item.serviceHours && (
            <div className="absolute top-4 right-4 rounded-full bg-gold/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              {item.serviceHours}
            </div>
          )}
          
          {/* Content on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2 text-balance">
              {item.name}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
        
        {/* Price Section - revealed on hover/tap */}
        <AnimatePresence>
          {(showPrice || isHovered) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 border-t border-border/30 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Precio</p>
                    <p className="text-2xl font-bold text-gold">{item.price}</p>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Drag indicator */}
        {isDraggingDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center text-gold"
          >
            <ChevronRight className="h-5 w-5 rotate-90 animate-bounce" />
            <span className="text-xs font-medium">Soltar para cotizar</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Horizontal Carousel Component
function CatalogCarousel({
  items,
  onAddToQuote,
  onOpenModal,
}: {
  items: CatalogItem[]
  onAddToQuote: (item: CatalogItem) => void
  onOpenModal: (item: CatalogItem) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPrices, setShowPrices] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return
    const cardWidth = containerRef.current.offsetWidth > 640 ? 360 : 280
    const gap = 24
    const scrollPosition = index * (cardWidth + gap)
    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    })
    setCurrentIndex(index)
  }, [])

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return
    const cardWidth = containerRef.current.offsetWidth > 640 ? 360 : 280
    const gap = 24
    const scrollPosition = containerRef.current.scrollLeft
    const newIndex = Math.round(scrollPosition / (cardWidth + gap))
    setCurrentIndex(Math.max(0, Math.min(newIndex, items.length - 1)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    startX.current = e.pageX - containerRef.current.offsetLeft
    scrollLeft.current = containerRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    containerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    handleScroll()
  }

  return (
    <div className="relative">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
        <button
          onClick={() => setShowPrices(!showPrices)}
          className="flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors"
        >
          {showPrices ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPrices ? "Ocultar precios" : "Ver precios"}
        </button>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-[calc(50%-140px)] sm:px-[calc(50%-160px)] md:px-[calc(50%-180px)] pb-8 cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: "x mandatory" }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {items.map((item, index) => (
          <div key={item.id} style={{ scrollSnapAlign: "center" }}>
            <ServiceCard
              item={item}
              isCenter={index === currentIndex}
              onTap={() => onOpenModal(item)}
              onDragToQuote={onAddToQuote}
              showPrice={showPrices}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border text-foreground shadow-lg hover:bg-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => scrollToIndex(Math.min(items.length - 1, currentIndex + 1))}
        disabled={currentIndex === items.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border text-foreground shadow-lg hover:bg-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {items.slice(0, Math.min(7, items.length)).map((_, index) => {
          const actualIndex = items.length > 7 
            ? Math.max(0, Math.min(currentIndex - 3 + index, items.length - 1))
            : index
          return (
            <button
              key={index}
              onClick={() => scrollToIndex(actualIndex)}
              className={`h-2 rounded-full transition-all ${
                actualIndex === currentIndex
                  ? "w-8 bg-gold"
                  : "w-2 bg-border hover:bg-muted-foreground"
              }`}
            />
          )
        })}
        {items.length > 7 && (
          <span className="text-xs text-muted-foreground ml-2">+{items.length - 7}</span>
        )}
      </div>
    </div>
  )
}

// Service Modal Component
function ServiceModal({
  item,
  isOpen,
  onClose,
  onAddToQuote,
}: {
  item: CatalogItem | null
  isOpen: boolean
  onClose: () => void
  onAddToQuote: (item: CatalogItem) => void
}) {
  if (!isOpen || !item) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="sticky top-0 flex justify-center py-3 bg-card/80 backdrop-blur-sm z-10">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

        {/* Video/Image Gallery */}
        <div className="px-6">
          {item.videos && item.videos.length > 0 ? (
            <VideoShowcase videos={item.videos} />
          ) : item.image ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-gold uppercase tracking-wide">{item.category}</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">{item.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>

          {/* Includes */}
          {item.includes && item.includes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                Incluye:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="text-3xl font-bold text-gold">{item.price}</p>
              <p className="text-xs text-muted-foreground">{item.unit}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onAddToQuote(item)
                onClose()
              }}
              className="flex items-center gap-2 rounded-2xl bg-gold px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg hover:bg-gold-light transition-colors"
            >
              <Plus className="h-5 w-5" />
              Agregar a cotizacion
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Quote Stack Component (floating tray)
function QuoteStack({
  items,
  isExpanded,
  onToggle,
  onUpdateQuantity,
  onRemove,
  onViewSummary,
}: {
  items: QuoteItem[]
  isExpanded: boolean
  onToggle: () => void
  onUpdateQuantity: (itemId: string, delta: number) => void
  onRemove: (itemId: string) => void
  onViewSummary: () => void
}) {
  const total = items.reduce((sum, q) => sum + q.item.priceValue * q.quantity, 0)
  const itemCount = items.reduce((sum, q) => sum + q.quantity, 0)

  if (items.length === 0) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
    >
      <motion.div
        layout
        className="max-w-lg mx-auto rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl pointer-events-auto overflow-hidden"
      >
        {/* Collapsed view - Stack preview */}
        <motion.button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-4">
            {/* Stacked cards preview */}
            <div className="relative w-16 h-12">
              {items.slice(0, 3).map((q, index) => (
                <motion.div
                  key={q.item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-10 h-10 rounded-xl bg-secondary border border-border shadow-lg overflow-hidden"
                  style={{
                    left: index * 10,
                    top: index * 2,
                    zIndex: 3 - index,
                  }}
                >
                  {q.item.image ? (
                    <Image src={q.item.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gold/10">
                      <Star className="h-4 w-4 text-gold" />
                    </div>
                  )}
                </motion.div>
              ))}
              {items.length > 3 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
                  +{items.length - 3}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {itemCount} {itemCount === 1 ? "servicio" : "servicios"}
              </p>
              <p className="text-lg font-bold text-gold">${total.toLocaleString()} MXN</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
          >
            <ChevronRight className="h-5 w-5 rotate-90" />
          </motion.div>
        </motion.button>

        {/* Expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {items.map((q) => (
                    <motion.div
                      key={q.item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        {q.item.image ? (
                          <Image src={q.item.image} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gold/10">
                            <Star className="h-5 w-5 text-gold" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{q.item.name}</p>
                        <p className="text-sm text-gold font-medium">
                          ${(q.item.priceValue * q.quantity).toLocaleString()} MXN
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(q.item.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{q.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(q.item.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemove(q.item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Summary button */}
              <div className="p-4 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onViewSummary}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-sm font-bold text-primary-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ver cotizacion completa
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// Quote Summary Panel
function QuoteSummary({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onClear,
}: {
  items: QuoteItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: string, delta: number) => void
  onRemove: (itemId: string) => void
  onClear: () => void
}) {
  const [includeIVA, setIncludeIVA] = useState(true)
  const subtotal = items.reduce((sum, q) => sum + q.item.priceValue * q.quantity, 0)
  const iva = includeIVA ? subtotal * 0.16 : 0
  const total = subtotal + iva

  const handleDownloadPDF = () => {
    // Generate quote text
    const quoteText = items
      .map((q) => `${q.item.name} (x${q.quantity}): $${(q.item.priceValue * q.quantity).toLocaleString()} MXN`)
      .join("\n")
    const fullText = `COTIZACION EVENTOS 360\n\n${quoteText}\n\nSubtotal: $${subtotal.toLocaleString()} MXN\n${includeIVA ? `IVA (16%): $${iva.toLocaleString()} MXN\n` : ""}Total: $${total.toLocaleString()} MXN`
    
    const blob = new Blob([fullText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cotizacion-eventos360.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa cotizar:\n\n${items
        .map((q) => `- ${q.item.name} (x${q.quantity})`)
        .join("\n")}\n\nTotal estimado: $${total.toLocaleString()} MXN`
    )
    window.open(`https://wa.me/524421234567?text=${message}`, "_blank")
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Tu Cotizacion</h2>
            <p className="text-sm text-muted-foreground">{items.length} servicios seleccionados</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.map((q) => (
              <div key={q.item.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  {q.item.image ? (
                    <Image src={q.item.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gold/10">
                      <Star className="h-6 w-6 text-gold" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{q.item.name}</h4>
                  <p className="text-xs text-muted-foreground">{q.item.unit}</p>
                  <p className="text-lg font-bold text-gold mt-1">
                    ${(q.item.priceValue * q.quantity).toLocaleString()} MXN
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(q.item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{q.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(q.item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onRemove(q.item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive ml-auto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 space-y-4">
          {/* IVA toggle */}
          <button
            onClick={() => setIncludeIVA(!includeIVA)}
            className="flex items-center justify-between w-full"
          >
            <span className="text-sm text-muted-foreground">Incluir IVA (16%)</span>
            <div className={`relative w-12 h-6 rounded-full transition-colors ${includeIVA ? "bg-gold" : "bg-secondary"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${includeIVA ? "left-7" : "left-1"}`} />
            </div>
          </button>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">${subtotal.toLocaleString()} MXN</span>
            </div>
            {includeIVA && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (16%)</span>
                <span className="text-foreground font-medium">${iva.toLocaleString()} MXN</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2">
              <span className="text-foreground">Total</span>
              <span className="text-gold">${total.toLocaleString()} MXN</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-medium text-white hover:bg-[#22c55e] transition-colors"
            >
              <Send className="h-4 w-4" />
              WhatsApp
            </button>
          </div>

          <button
            className="w-full rounded-xl bg-gold py-4 text-sm font-bold text-primary-foreground hover:bg-gold-light transition-colors"
          >
            Iniciar Reservacion
          </button>

          <button
            onClick={onClear}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpiar cotizacion
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Category Tab Component
function CategoryTab({
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
      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium transition-all ${
        isActive
          ? "bg-gold text-primary-foreground shadow-lg glow-neon"
          : "bg-card/80 backdrop-blur-sm border border-border text-foreground hover:border-gold/30"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{category.name}</span>
    </button>
  )
}

// Main Catalog Page
export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(catalog[0]?.id || "")
  const [quote, setQuote] = useState<QuoteItem[]>([])
  const [quoteExpanded, setQuoteExpanded] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  const currentCategory = catalog.find((c) => c.id === selectedCategory) || catalog[0]

  const filteredItems = searchQuery
    ? catalog.flatMap((c) => c.items).filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCategory?.items || []

  const addToQuote = (item: CatalogItem) => {
    setQuote((prev) => {
      const existing = prev.find((q) => q.item.id === item.id)
      if (existing) {
        return prev.map((q) =>
          q.item.id === item.id ? { ...q, quantity: q.quantity + 1 } : q
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
    setQuoteExpanded(true)
  }

  const updateQuoteQuantity = (itemId: string, delta: number) => {
    setQuote((prev) =>
      prev
        .map((q) =>
          q.item.id === itemId ? { ...q, quantity: Math.max(0, q.quantity + delta) } : q
        )
        .filter((q) => q.quantity > 0)
    )
  }

  const removeFromQuote = (itemId: string) => {
    setQuote((prev) => prev.filter((q) => q.item.id !== itemId))
  }

  const clearQuote = () => {
    setQuote([])
    setShowSummary(false)
    setQuoteExpanded(false)
  }

  const openModal = (item: CatalogItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Volver</span>
          </Link>

          <h1 className="text-lg font-bold text-foreground">Catalogo</h1>

          <button
            onClick={() => setShowSummary(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {quote.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-primary-foreground">
                {quote.reduce((sum, q) => sum + q.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar servicios..."
              className="w-full rounded-2xl bg-card border border-border py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        {!searchQuery && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4">
            {catalog.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pb-32">
        {/* Category header */}
        {!searchQuery && currentCategory && (
          <div className="px-4 sm:px-6 py-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {currentCategory.name}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {currentCategory.description}
            </p>
          </div>
        )}

        {/* Search results header */}
        {searchQuery && (
          <div className="px-4 sm:px-6 py-6">
            <p className="text-muted-foreground">
              {filteredItems.length} resultados para &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {/* Carousel */}
        {filteredItems.length > 0 ? (
          <CatalogCarousel
            items={filteredItems}
            onAddToQuote={addToQuote}
            onOpenModal={openModal}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No se encontraron servicios</p>
          </div>
        )}

        {/* Drag hint */}
        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
          <GripVertical className="h-4 w-4" />
          <span>Arrastra hacia abajo para agregar a tu cotizacion</span>
        </div>
      </main>

      {/* Quote Stack */}
      <QuoteStack
        items={quote}
        isExpanded={quoteExpanded}
        onToggle={() => setQuoteExpanded(!quoteExpanded)}
        onUpdateQuantity={updateQuoteQuantity}
        onRemove={removeFromQuote}
        onViewSummary={() => setShowSummary(true)}
      />

      {/* Service Modal */}
      <AnimatePresence>
        {showModal && (
          <ServiceModal
            item={selectedItem}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onAddToQuote={addToQuote}
          />
        )}
      </AnimatePresence>

      {/* Quote Summary */}
      <AnimatePresence>
        {showSummary && (
          <QuoteSummary
            items={quote}
            isOpen={showSummary}
            onClose={() => setShowSummary(false)}
            onUpdateQuantity={updateQuoteQuantity}
            onRemove={removeFromQuote}
            onClear={clearQuote}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
