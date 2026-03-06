"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATALOG, CATEGORY_INFO, type ServiceCategory } from "@/lib/catalog-data"
import { motion } from "motion/react"
import { useI18n } from "@/lib/i18n"
import { useState } from "react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

const categories: ServiceCategory[] = ["audio-dj", "special-effects", "shows", "decor"]

// Show a curated set of featured / popular packages
const featuredPackages = CATALOG.filter((p) => p.featured || p.tier === "premium" || p.tier === "luxury").slice(0, 4)

export function ServicesSection() {
  const { t, locale } = useI18n()
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all")

  const displayPackages =
    activeCategory === "all"
      ? featuredPackages
      : CATALOG.filter((p) => p.category === activeCategory).slice(0, 4)

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] text-[var(--gold)] uppercase"
          >
            {t("services.label")}
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance"
          >
            {t("services.title")}
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-muted-foreground leading-relaxed text-lg"
          >
            {t("services.description")}
          </motion.p>
        </div>

        {/* Category image cards -- visual overview */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((catKey, i) => {
            const info = CATEGORY_INFO[catKey]
            const count = CATALOG.filter((p) => p.category === catKey).length
            return (
              <motion.button
                key={catKey}
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.06 * i }}
                onClick={() => setActiveCategory(activeCategory === catKey ? "all" : catKey)}
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border text-left transition-all ${
                  activeCategory === catKey
                    ? "border-[var(--gold)]/50 ring-2 ring-[var(--gold)]/20"
                    : "border-border/20"
                }`}
              >
                <Image
                  src={info.image}
                  alt={locale === "es" ? info.labelEs : info.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors group-hover:from-black/90" />
                {/* Gold top accent on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, var(--gold-deep), var(--gold), var(--gold-neon))" }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-[var(--gold-neon)]" />
                    <span className="text-xs font-medium text-[var(--gold-neon)]">
                      {count} {locale === "es" ? "opciones" : "options"}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">
                    {locale === "es" ? info.labelEs : info.label}
                  </h3>
                  <p className="mt-1 text-sm text-white/70 leading-relaxed">
                    {locale === "es" ? info.descriptionEs : info.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Featured packages row */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {activeCategory === "all"
                ? locale === "es"
                  ? "Paquetes Destacados"
                  : "Featured Packages"
                : locale === "es"
                  ? CATEGORY_INFO[activeCategory].labelEs
                  : CATEGORY_INFO[activeCategory].label}
            </h3>
            <Link
              href="/packages"
              className="flex items-center gap-1 text-sm font-medium text-[var(--gold)] transition-colors hover:text-[var(--gold-neon)]"
            >
              {locale === "es" ? "Ver todos" : "View all"}
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm transition-all hover:border-[var(--gold)]/30 hover:bg-card/80"
              >
                {/* Package image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={locale === "es" ? pkg.nameEs : pkg.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Tier badge */}
                  {pkg.tier && (
                    <div className="absolute top-3 right-3 rounded-full border border-[var(--gold)]/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-[var(--gold-neon)] uppercase tracking-wider backdrop-blur-sm">
                      {pkg.tier}
                    </div>
                  )}
                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-2xl font-bold text-white">
                      ${pkg.price.toLocaleString()}
                    </span>
                    <span className="ml-1 text-xs text-white/60">MXN</span>
                  </div>
                </div>

                {/* Package details */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-semibold text-foreground">
                      {locale === "es" ? pkg.nameEs : pkg.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{locale === "es" ? pkg.durationEs : pkg.duration}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {locale === "es" ? pkg.categoryLabelEs : pkg.categoryLabel}
                  </p>

                  {/* Top 3 includes */}
                  <ul className="mt-3 space-y-1.5">
                    {(locale === "es" ? pkg.includesEs : pkg.includes).slice(0, 3).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check size={12} className="mt-0.5 flex-shrink-0 text-[var(--gold)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 3 && (
                      <li className="text-xs text-[var(--gold)]/70">
                        +{pkg.includes.length - 3} {locale === "es" ? "más" : "more"}
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-13 rounded-full pl-7 pr-5 text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-lg shadow-[var(--gold)]/15"
          >
            <Link href="/packages">
              <span>{locale === "es" ? "Ver Catálogo Completo" : "View Full Catalog"}</span>
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-13 rounded-full px-7 text-base text-foreground border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 transition-colors"
          >
            <Link href="/configure">
              <span>{t("services.cta")}</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
