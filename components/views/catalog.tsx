"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Plus, Minus, ChevronRight } from "lucide-react"
import { cn, currencyMXN } from "@/lib/utils"
import { CATALOG, CATEGORY_META, getCategories, type CatalogProduct } from "@/lib/catalog"

export function CatalogView() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const categories = getCategories()

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return CATALOG.filter((p) => {
      const matchCat = !selectedCategory || p.category === selectedCategory
      const matchSearch = !q || `${p.id} ${p.name} ${p.category} ${p.subcategory || ""}`.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCategory])

  const groupedProducts = useMemo(() => {
    const map = new Map<string, CatalogProduct[]>()
    for (const p of filteredProducts) {
      const list = map.get(p.category) || []
      list.push(p)
      map.set(p.category, list)
    }
    return categories.filter((c) => map.has(c)).map((c) => ({ category: c, products: map.get(c)! }))
  }, [filteredProducts, categories])

  const totalInQuote = Object.values(quantities).reduce((s, q) => s + q, 0)

  function addQty(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  function subQty(id: string) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) - 1)
      if (next === 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-foreground text-balance">Catalogo de Servicios</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Explora por categoria o busca por nombre. Agrega items a tu cotizacion con + / -.
          </p>
        </div>
        {totalInQuote > 0 && (
          <span className="shrink-0 text-xs font-bold bg-gold/15 text-gold border border-gold/30 rounded-full px-3 py-1.5">
            {totalInQuote} en cotizacion
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, ID o categoria..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Todas las categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>{CATEGORY_META[c]?.label || c}</option>
          ))}
        </select>
      </div>

      {/* Category Shelves */}
      <div className="flex flex-col gap-8">
        {groupedProducts.map(({ category, products }) => {
          const meta = CATEGORY_META[category]
          const isExpanded = expandedCategory === category

          return (
            <section key={category} className="flex flex-col gap-4">
              {/* Category Header with Image */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="group relative h-40 rounded-xl overflow-hidden border border-border"
              >
                <Image
                  src={meta?.image || "/images/packages-dj.jpg"}
                  alt={meta?.label || category}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div>
                    <h3 className="font-sans text-lg font-black text-foreground">{meta?.label || category}</h3>
                    <p className="font-sans text-xs text-muted-foreground mt-1 max-w-md">{meta?.desc}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-gold bg-gold/10 border border-gold/20 rounded-full px-2.5 py-0.5">
                      {products.length} productos
                    </span>
                  </div>
                  <ChevronRight className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </div>
              </button>

              {/* Product Cards - Horizontal Scroll */}
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-80 opacity-100"
              )}>
                <div className={cn(
                  isExpanded
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                    : "flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                )}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      qty={quantities[product.id] || 0}
                      onAdd={() => addQty(product.id)}
                      onSub={() => subQty(product.id)}
                      isExpanded={isExpanded}
                    />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function ProductCard({
  product,
  qty,
  onAdd,
  onSub,
  isExpanded,
}: {
  product: CatalogProduct
  qty: number
  onAdd: () => void
  onSub: () => void
  isExpanded: boolean
}) {
  const meta = CATEGORY_META[product.category]

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-gold/30 group",
        isExpanded ? "" : "min-w-[240px] max-w-[240px] snap-start shrink-0"
      )}
    >
      {/* Product image */}
      <div className="relative h-28 overflow-hidden">
        <Image
          src={meta?.image || "/images/packages-dj.jpg"}
          alt={product.name}
          fill
          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold bg-background/60 glass text-foreground border border-border/50 rounded-full px-2 py-0.5">
            {meta?.label || product.category}
          </span>
        </div>
        {qty > 0 && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold bg-gold/90 text-gold-foreground rounded-full px-2 py-0.5">
              {qty}x
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-sans text-sm font-bold text-foreground truncate">{product.name}</div>
            <div className="font-sans text-xs text-muted-foreground">
              {product.unit}
              {product.subcategory ? ` / ${product.subcategory}` : ""}
              {product.size ? ` / ${product.size}` : ""}
              {product.hrs ? ` / ${product.hrs}h` : ""}
            </div>
          </div>
          <div className="font-sans text-sm font-black text-foreground shrink-0">
            {currencyMXN(product.price)}
          </div>
        </div>

        {product.priceNote && (
          <div className="text-[10px] text-muted-foreground">{product.priceNote}</div>
        )}

        {/* Quantity controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <div className="font-mono text-[10px] text-muted-foreground">{product.id}</div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onSub() }}
              disabled={qty <= 0}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-secondary text-foreground disabled:opacity-30 hover:bg-accent transition-all"
              aria-label={`Quitar ${product.name}`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-sans text-xs font-bold min-w-[20px] text-center text-foreground">{qty}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd() }}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 transition-all"
              aria-label={`Agregar ${product.name}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
