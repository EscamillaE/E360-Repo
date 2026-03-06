"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Volume2,
  Lightbulb,
  Video,
  Building,
  Armchair,
  Sparkles,
  Star,
  Search,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import type { CategoryWithItems, CatalogItem } from "@/lib/actions/catalog"
import { useApp } from "@/components/providers"

const iconMap: Record<string, React.ElementType> = {
  Volume2: Volume2,
  Lightbulb: Lightbulb,
  Video: Video,
  Building: Building,
  Armchair: Armchair,
  Sparkles: Sparkles,
  Star: Star,
}

function CategoryCard({
  category,
  onClick,
  index,
  lang,
}: {
  category: CategoryWithItems
  onClick: () => void
  index: number
  lang: 'es' | 'en'
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

  const Icon = iconMap[category.icon || ''] || Star
  const name = lang === 'es' ? category.name_es : category.name_en

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
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {category.items.length} {category.items.length === 1 ? (lang === 'es' ? "producto" : "product") : (lang === 'es' ? "productos" : "products")}
          </span>
          <ChevronRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  )
}

function ProductCard({ item, index, lang }: { item: CatalogItem; index: number; lang: 'es' | 'en' }) {
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

  const name = lang === 'es' ? item.name_es : item.name_en
  const description = lang === 'es' ? item.description_es : item.description_en

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
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <Sparkles className="h-12 w-12 text-gold/30" />
          )}
        </div>
        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-primary-foreground">
          ${item.price.toLocaleString()} MXN
        </div>
        {/* Popular badge */}
        {item.is_popular && (
          <div className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            {lang === 'es' ? 'Popular' : 'Popular'}
          </div>
        )}
      </div>

      <div className="p-5">
        <h4 className="mb-1 text-base font-semibold text-foreground">
          {name}
        </h4>
        {description && (
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link
            href={`/cotizador?item=${item.id}`}
            className="rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-all hover:bg-gold/20"
          >
            {lang === 'es' ? 'Agregar a cotizacion' : 'Add to quote'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CatalogClient({ categories }: { categories: CategoryWithItems[] }) {
  const { locale: language } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const activeCategory = categories.find((c) => c.id === selectedCategory)

  const allItems = useMemo(() => categories.flatMap(cat => cat.items), [categories])

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return allItems.filter(item =>
      item.name_es.toLowerCase().includes(query) ||
      item.name_en.toLowerCase().includes(query) ||
      item.description_es?.toLowerCase().includes(query) ||
      item.description_en?.toLowerCase().includes(query)
    )
  }, [searchQuery, allItems])

  const t = {
    es: {
      home: "Inicio",
      catalog: "Catalogo de Productos",
      search: "Buscar productos...",
      results: "resultados para",
      back: "Volver a categorias",
      subtitle: "Nuestro Catalogo Completo",
      title: "Productos y Servicios",
      description: "Descubre nuestra completa gama de soluciones para eventos inolvidables. Todos los precios en pesos mexicanos (MXN).",
    },
    en: {
      home: "Home",
      catalog: "Product Catalog",
      search: "Search products...",
      results: "results for",
      back: "Back to categories",
      subtitle: "Our Complete Catalog",
      title: "Products & Services",
      description: "Discover our complete range of solutions for unforgettable events. All prices in Mexican pesos (MXN).",
    }
  }[language]

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
            <span className="text-sm">{t.home}</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              {t.catalog}
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
            placeholder={t.search}
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
              {filteredItems.length} {t.results}{" "}
              {'"'}{searchQuery}{'"'}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} lang={language} />
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
              {t.back}
            </button>

            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                {language === 'es' ? activeCategory.name_es : activeCategory.name_en}
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeCategory.items.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} lang={language} />
              ))}
            </div>
          </div>
        )}

        {/* Categories grid */}
        {!searchQuery.trim() && !selectedCategory && (
          <div>
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                {t.subtitle}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
                {t.title}
              </h2>
              <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
                {t.description}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, i) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => setSelectedCategory(category.id)}
                  index={i}
                  lang={language}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
