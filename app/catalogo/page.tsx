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
  Bolt,
  UtensilsCrossed,
  Camera,
  Star,
  Search,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { catalog, type CatalogCategory, type CatalogItem } from "@/lib/catalog-data"

const iconMap: Record<string, React.ElementType> = {
  music: Music,
  flame: Flame,
  zap: Zap,
  disc: Disc,
  armchair: Armchair,
  bolt: Bolt,
  utensils: UtensilsCrossed,
  camera: Camera,
  star: Star,
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

function ProductCard({ item, index }: { item: CatalogItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
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
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image placeholder with gold gradient */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 via-card to-card">
          <Image
            src="/images/logo.png"
            alt={item.name}
            width={60}
            height={60}
            className="opacity-20"
          />
        </div>
        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-primary-foreground">
          {item.price}
        </div>
      </div>

      <div className="p-5">
        <h4 className="mb-1 text-base font-semibold text-foreground">
          {item.name}
        </h4>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.unit}</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hola, me interesa cotizar: ${item.name} (${item.price})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-all hover:bg-gold/20"
          >
            Cotizar
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Inicio</span>
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
            <h1 className="text-lg font-bold text-foreground">
              Catalogo de Productos
            </h1>
          </div>
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

        {/* Search results */}
        {searchQuery.trim() && (
          <div className="mb-8">
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredItems.length} resultado{filteredItems.length !== 1 ? "s" : ""} para{" "}
              {'"'}{searchQuery}{'"'}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} />
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
                <ProductCard key={item.id} item={item} index={i} />
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
    </div>
  )
}
