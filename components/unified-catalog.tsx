"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
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
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Play,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Volume2,
  VolumeX,
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
  sparkles: Sparkles,
}

interface UnifiedCatalogProps {
  mode?: "full" | "compact" | "kiosk"
  onAddToQuote?: (item: CatalogItem) => void
  selectedCategory?: CatalogCategory | null
  onCategorySelect?: (category: CatalogCategory | null) => void
  showPrices?: boolean
  className?: string
}

// Video Showcase Component for products with videos
function ProductVideoShowcase({ videos, onClose }: { videos: string[]; onClose?: () => void }) {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!videos || videos.length === 0) return null

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90">
      <video
        ref={videoRef}
        key={videos[currentVideo]}
        src={videos[currentVideo]}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Mute toggle */}
      <button
        onClick={() => {
          setIsMuted(!isMuted)
          if (videoRef.current) videoRef.current.muted = !isMuted
        }}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 text-gold" />
        )}
      </button>
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
      )}
      
      {/* Video dots */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentVideo ? "bg-gold w-6" : "bg-foreground/40 w-2"
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
  mode,
}: {
  item: CatalogItem
  isCenter: boolean
  onTap: () => void
  onDragToQuote?: (item: CatalogItem) => void
  showPrice: boolean
  mode: "full" | "compact" | "kiosk"
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingDown, setIsDraggingDown] = useState(false)
  const y = useMotionValue(0)
  const dragOpacity = useTransform(y, [0, 100], [1, 0.5])
  const dragScale = useTransform(y, [0, 100], [1, 0.9])

  const handleDragEnd = (_: never, info: PanInfo) => {
    if (info.offset.y > 80 && onDragToQuote) {
      onDragToQuote(item)
    }
    setIsDraggingDown(false)
  }

  const cardWidth = mode === "kiosk" ? "w-[260px]" : "w-[280px] sm:w-[320px] md:w-[360px]"
  const imageHeight = mode === "kiosk" ? "h-[280px]" : "h-[320px] sm:h-[380px]"

  return (
    <motion.div
      className={`relative flex-shrink-0 ${cardWidth} cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isCenter ? "scale-100 z-10" : "scale-90 opacity-70"
      }`}
      style={{ opacity: dragOpacity, scale: dragScale, y }}
      drag={onDragToQuote ? "y" : false}
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
        <div className={`relative ${imageHeight} overflow-hidden`}>
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
          
          {/* Video indicator */}
          {item.videos && item.videos.length > 0 && (
            <div className="absolute bottom-20 left-4 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs text-foreground">
              <Play className="h-3 w-3 text-gold" />
              {item.videos.length} video{item.videos.length > 1 ? "s" : ""}
            </div>
          )}
          
          {/* Content on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl font-bold text-white mb-2 text-balance line-clamp-2">
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
                  {onDragToQuote && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDragToQuote(item)
                      }}
                    >
                      <Plus className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Drag indicator */}
        {isDraggingDown && onDragToQuote && (
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

// Category Tabs Component
function CategoryTabs({
  categories,
  selectedId,
  onSelect,
  mode,
}: {
  categories: CatalogCategory[]
  selectedId: string | null
  onSelect: (category: CatalogCategory | null) => void
  mode: "full" | "compact" | "kiosk"
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 sm:px-6">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
          !selectedId
            ? "bg-gold text-primary-foreground shadow-lg"
            : "bg-card/80 border border-border text-foreground hover:border-gold/30"
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
            onClick={() => onSelect(category)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedId === category.id
                ? "bg-gold text-primary-foreground shadow-lg"
                : "bg-card/80 border border-border text-foreground hover:border-gold/30"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className={mode === "kiosk" ? "hidden sm:inline" : ""}>{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}

// Horizontal Carousel Component
function CatalogCarousel({
  items,
  onAddToQuote,
  onOpenModal,
  showPrices,
  mode,
}: {
  items: CatalogItem[]
  onAddToQuote?: (item: CatalogItem) => void
  onOpenModal: (item: CatalogItem) => void
  showPrices: boolean
  mode: "full" | "compact" | "kiosk"
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const getCardWidth = useCallback(() => {
    if (!containerRef.current) return 320
    if (mode === "kiosk") return 260
    return containerRef.current.offsetWidth > 640 ? 360 : 280
  }, [mode])

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return
    const cardWidth = getCardWidth()
    const gap = 24
    const scrollPosition = index * (cardWidth + gap)
    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    })
    setCurrentIndex(index)
  }, [getCardWidth])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isDragging) return
    const cardWidth = getCardWidth()
    const gap = 24
    const scrollPosition = containerRef.current.scrollLeft
    const newIndex = Math.round(scrollPosition / (cardWidth + gap))
    setCurrentIndex(Math.max(0, Math.min(newIndex, items.length - 1)))
  }, [isDragging, items.length, getCardWidth])

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

  const centerPadding = mode === "kiosk" 
    ? "px-[calc(50%-130px)]" 
    : "px-[calc(50%-140px)] sm:px-[calc(50%-160px)] md:px-[calc(50%-180px)]"

  return (
    <div className="relative">
      {/* Carousel */}
      <div
        ref={containerRef}
        className={`flex gap-6 overflow-x-auto scrollbar-hide ${centerPadding} pb-8 cursor-grab active:cursor-grabbing`}
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
              mode={mode}
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

      {/* Current index indicator */}
      <div className="flex justify-center mt-2">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
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
  onAddToQuote?: (item: CatalogItem) => void
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
            <ProductVideoShowcase videos={item.videos} />
          ) : item.image ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gold/10 via-card to-card flex items-center justify-center">
              <Star className="h-16 w-16 text-gold/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-gold uppercase tracking-wide">{item.category}</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">{item.name}</h2>
              {item.serviceHours && (
                <p className="text-sm text-muted-foreground mt-1">{item.serviceHours}</p>
              )}
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
                <Check className="h-4 w-4 text-gold" />
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
            {onAddToQuote && (
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
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main Unified Catalog Component
export function UnifiedCatalog({
  mode = "full",
  onAddToQuote,
  selectedCategory: externalSelectedCategory,
  onCategorySelect,
  showPrices: externalShowPrices,
  className = "",
}: UnifiedCatalogProps) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<CatalogCategory | null>(null)
  const [internalShowPrices, setInternalShowPrices] = useState(false)
  const [modalItem, setModalItem] = useState<CatalogItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use external or internal state
  const selectedCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalSelectedCategory
  const showPrices = externalShowPrices !== undefined ? externalShowPrices : internalShowPrices

  const handleCategorySelect = (category: CatalogCategory | null) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    } else {
      setInternalSelectedCategory(category)
    }
  }

  // Get items to display
  const items = selectedCategory 
    ? selectedCategory.items 
    : catalog.flatMap(cat => cat.items)

  const openModal = (item: CatalogItem) => {
    setModalItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalItem(null)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {items.length} productos
          </span>
        </div>
        {externalShowPrices === undefined && (
          <button
            onClick={() => setInternalShowPrices(!internalShowPrices)}
            className="flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors"
          >
            {showPrices ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPrices ? "Ocultar precios" : "Ver precios"}
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-8">
        <CategoryTabs
          categories={catalog}
          selectedId={selectedCategory?.id || null}
          onSelect={handleCategorySelect}
          mode={mode}
        />
      </div>

      {/* Carousel */}
      <CatalogCarousel
        items={items}
        onAddToQuote={onAddToQuote}
        onOpenModal={openModal}
        showPrices={showPrices}
        mode={mode}
      />

      {/* Modal */}
      <AnimatePresence>
        <ServiceModal
          item={modalItem}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToQuote={onAddToQuote}
        />
      </AnimatePresence>
    </div>
  )
}

export default UnifiedCatalog
