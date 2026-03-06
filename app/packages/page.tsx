"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Sparkles,
  Star,
} from "lucide-react"
import { CATALOG, CATEGORY_INFO, type ServiceCategory, type CatalogPackage } from "@/lib/catalog-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { E360Logo } from "@/components/e360-logo"
import { useI18n } from "@/lib/i18n"
import { motion, AnimatePresence } from "motion/react"

const categories: ServiceCategory[] = ["audio-dj", "special-effects", "shows", "decor"]

export default function PackagesPage() {
  const { locale } = useI18n()
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all")
  const [selectedPackage, setSelectedPackage] = useState<CatalogPackage | null>(null)

  const filteredPackages =
    activeCategory === "all" ? CATALOG : CATALOG.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-muted/50 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <E360Logo size="small" />
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="hidden h-9 rounded-full px-5 text-xs font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-sm shadow-[var(--gold)]/10 sm:flex"
            >
              <Link href="/configure">
                {locale === "es" ? "Cotizar" : "Get a Quote"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {/* Page title */}
        <div className="mb-10 max-w-2xl">
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            <span
              style={{
                background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {locale === "es" ? "Catalogo de Servicios" : "Service Catalog"}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {locale === "es"
              ? "Explora nuestra gama completa de paquetes de produccion. Desde setups intimos hasta producciones de gran escala."
              : "Explore our complete range of production packages. From intimate setups to grand-scale productions."}
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "border-[var(--gold)] bg-[var(--gold)]/10 text-foreground"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {locale === "es" ? "Todos" : "All"} ({CATALOG.length})
          </button>
          {categories.map((cat) => {
            const info = CATEGORY_INFO[cat]
            const count = CATALOG.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "all" : cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-foreground"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {locale === "es" ? info.labelEs : info.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Package grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={`group relative overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm transition-all hover:bg-card/80 cursor-pointer ${
                  pkg.featured
                    ? "border-[var(--gold)]/40 ring-1 ring-[var(--gold)]/10"
                    : "border-border/30 hover:border-[var(--gold)]/20"
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {/* Featured badge */}
                {pkg.featured && (
                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold tracking-wider text-background uppercase"
                    style={{ background: "linear-gradient(90deg, var(--gold-deep), var(--gold), var(--gold-neon))" }}
                  >
                    <Star size={10} fill="currentColor" />
                    {locale === "es" ? "Popular" : "Popular"}
                  </div>
                )}

                {/* Image */}
                <div className={`relative aspect-[16/10] overflow-hidden ${pkg.featured ? "mt-6" : ""}`}>
                  <Image
                    src={pkg.image}
                    alt={locale === "es" ? pkg.nameEs : pkg.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Tier badge */}
                  {pkg.tier && (
                    <div className="absolute top-3 right-3 rounded-full border border-[var(--gold)]/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-[var(--gold-neon)] uppercase tracking-wider backdrop-blur-sm">
                      {pkg.tier}
                    </div>
                  )}
                  {/* Price */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-2xl font-bold text-white">${pkg.price.toLocaleString()}</span>
                    <span className="ml-1 text-xs text-white/60">MXN</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {locale === "es" ? pkg.nameEs : pkg.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {locale === "es" ? pkg.categoryLabelEs : pkg.categoryLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock size={12} />
                      <span>{locale === "es" ? pkg.durationEs : pkg.duration}</span>
                    </div>
                  </div>

                  {/* Includes preview */}
                  <ul className="mt-4 space-y-1.5">
                    {(locale === "es" ? pkg.includesEs : pkg.includes).slice(0, 4).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check size={12} className="mt-0.5 flex-shrink-0 text-[var(--gold)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 4 && (
                      <li className="text-xs text-[var(--gold)]/70 font-medium">
                        +{pkg.includes.length - 4} {locale === "es" ? "mas incluidos" : "more included"}
                      </li>
                    )}
                  </ul>

                  {/* Variants */}
                  {pkg.variants && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pkg.variants.map((v, j) => (
                        <span key={j} className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] text-muted-foreground">
                          {locale === "es" ? v.labelEs : v.label}: ${v.price.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View details hint */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--gold)] opacity-0 transition-opacity group-hover:opacity-100">
                    <span>{locale === "es" ? "Ver detalles" : "View details"}</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-muted-foreground leading-relaxed">
            {locale === "es"
              ? "No encuentras lo que buscas? Creamos paquetes personalizados para cada evento."
              : "Can't find what you're looking for? We create custom packages for every event."}
          </p>
          <Button
            asChild
            size="lg"
            className="h-13 rounded-full pl-7 pr-5 text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-lg shadow-[var(--gold)]/15"
          >
            <Link href="/configure">
              <span>{locale === "es" ? "Cotiza tu Evento" : "Get a Custom Quote"}</span>
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Package detail modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/30 bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header image */}
              <div className="relative aspect-[21/9] overflow-hidden">
                <Image
                  src={selectedPackage.image}
                  alt={locale === "es" ? selectedPackage.nameEs : selectedPackage.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <span className="text-lg">&times;</span>
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {/* Title & meta */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-[var(--gold)] uppercase">
                      {locale === "es" ? selectedPackage.categoryLabelEs : selectedPackage.categoryLabel}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-bold text-foreground lg:text-3xl">
                      {locale === "es" ? selectedPackage.nameEs : selectedPackage.name}
                    </h2>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-foreground lg:text-3xl">
                      ${selectedPackage.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">MXN</p>
                  </div>
                </div>

                {/* Duration & tier */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {locale === "es" ? selectedPackage.durationEs : selectedPackage.duration}
                  </span>
                  {selectedPackage.tier && (
                    <span className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-xs font-medium text-[var(--gold)] uppercase tracking-wider">
                      {selectedPackage.tier}
                    </span>
                  )}
                  {selectedPackage.featured && (
                    <span className="flex items-center gap-1 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-xs font-medium text-[var(--gold)]">
                      <Sparkles size={10} />
                      {locale === "es" ? "Popular" : "Popular"}
                    </span>
                  )}
                </div>

                {/* Full includes list */}
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
                    {locale === "es" ? "Incluye" : "Includes"}
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {(locale === "es" ? selectedPackage.includesEs : selectedPackage.includes).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-[var(--gold)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Variants */}
                {selectedPackage.variants && selectedPackage.variants.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
                      {locale === "es" ? "Variantes" : "Variants"}
                    </h3>
                    <div className="grid gap-2">
                      {selectedPackage.variants.map((v, j) => (
                        <div key={j} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-4 py-2.5">
                          <span className="text-sm text-foreground">
                            {locale === "es" ? v.labelEs : v.label}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            ${v.price.toLocaleString()} MXN
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-8 flex gap-3">
                  <Button
                    asChild
                    className="flex-1 h-12 rounded-xl text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors"
                  >
                    <Link href="/configure">
                      {locale === "es" ? "Cotizar Este Paquete" : "Quote This Package"}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPackage(null)}
                    className="h-12 rounded-xl border border-border/50 px-6"
                  >
                    {locale === "es" ? "Cerrar" : "Close"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
