"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useState, useCallback } from "react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

const portfolioItems = [
  {
    image: "/images/portfolio-wedding.jpg",
    titleEn: "Luxury Wedding Reception",
    titleEs: "Recepcion de Boda de Lujo",
    descEn: "Full production with warm uplighting, LED screens, custom dance floor, and premium sound for 350 guests.",
    descEs: "Produccion completa con iluminacion calida, pantallas LED, pista personalizada y sonido premium para 350 invitados.",
    tags: ["Lighting", "Audio", "Decor"],
    tagsEs: ["Iluminacion", "Audio", "Decoracion"],
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    image: "/images/portfolio-corporate.jpg",
    titleEn: "Corporate Conference",
    titleEs: "Conferencia Corporativa",
    descEn: "LED video wall, broadcast-quality audio, and stage design for a 500+ person corporate event.",
    descEs: "Pantalla LED, audio de calidad broadcast y diseno de escenario para evento corporativo de 500+ personas.",
    tags: ["LED Screen", "Audio", "Stage"],
    tagsEs: ["Pantalla LED", "Audio", "Escenario"],
    span: "",
  },
  {
    image: "/images/portfolio-party.jpg",
    titleEn: "Private Celebration",
    titleEs: "Celebracion Privada",
    descEn: "LED pixel booth, robot show, cold spark pyrotechnics, and fog effects.",
    descEs: "Cabina pixeles LED, show de robot, pirotecnia fria y efectos de humo.",
    tags: ["DJ", "Robot Show", "FX"],
    tagsEs: ["DJ", "Show Robot", "FX"],
    span: "",
  },
  {
    image: "/images/portfolio-quince.jpg",
    titleEn: "Quinceanera Celebration",
    titleEs: "Fiesta de Quinceanera",
    descEn: "Custom LED dance floor, giant XV letters, moving heads, cold sparks, and magical atmosphere.",
    descEs: "Pista LED personalizada, letras XV gigantes, cabezas moviles, chisperos y atmosfera magica.",
    tags: ["Dance Floor", "Letters", "FX"],
    tagsEs: ["Pista", "Letras", "FX"],
    span: "sm:col-span-2",
  },
  {
    image: "/images/portfolio-bar.jpg",
    titleEn: "Premium Bar Experience",
    titleEs: "Experiencia Bar Premium",
    descEn: "Gold Bar package with illuminated bar counter, two professional bartenders, and cocktail service.",
    descEs: "Paquete Gold Bar con barra iluminada, dos bartenders profesionales y servicio de cocteleria.",
    tags: ["Bar", "Cocktails", "VIP"],
    tagsEs: ["Barra", "Cocteles", "VIP"],
    span: "sm:col-span-2",
  },
] as const

export function PortfolioSection() {
  const { t, locale } = useI18n()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % portfolioItems.length : null))
  }, [])
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + portfolioItems.length) % portfolioItems.length : null))
  }, [])

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] text-[var(--gold)] uppercase"
          >
            {t("portfolio.label")}
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance"
          >
            {t("portfolio.title")}
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-muted-foreground leading-relaxed text-lg"
          >
            {t("portfolio.description")}
          </motion.p>
        </div>

        {/* Portfolio grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioItems.map((item, i) => (
            <motion.button
              key={i}
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              onClick={() => openLightbox(i)}
              className={`group relative overflow-hidden rounded-2xl text-left ${item.span}`}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  item.span.includes("row-span-2") ? "aspect-square" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={locale === "es" ? item.titleEs : item.titleEn}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              </div>

              {/* Tags */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {(locale === "es" ? item.tagsEs : item.tags).map((tag, j) => (
                  <span
                    key={j}
                    className="rounded-full border border-[var(--gold)]/30 bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-[var(--gold-neon)] backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-80 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="font-serif text-base font-semibold text-white lg:text-lg">
                  {locale === "es" ? item.titleEs : item.titleEn}
                </h3>
                <p className="mt-1 text-sm text-white/70 leading-relaxed">
                  {locale === "es" ? item.descEs : item.descEn}
                </p>
              </div>

              {/* Gold accent bottom border on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
              />
            </motion.button>
          ))}
        </div>

        {/* Video highlight reel */}
        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.25 }} className="mt-8">
          <div
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/20"
            onClick={() => setVideoPlaying(true)}
          >
            {videoPlaying ? (
              <video autoPlay controls playsInline className="w-full max-h-[480px] object-cover">
                <source src="/videos/event-highlight.mov" type="video/mp4" />
              </video>
            ) : (
              <>
                <div className="relative w-full overflow-hidden" style={{ height: 420 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/event-setup.jpg"
                    alt="Event highlight reel"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
                </div>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold)]/90 shadow-2xl shadow-[var(--gold)]/30 transition-transform duration-300 group-hover:scale-110">
                    <Play size={32} className="ml-1 text-background" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="font-serif text-xl font-semibold text-white lg:text-2xl">
                    {locale === "es" ? "Mira Nuestro Trabajo" : "Watch Our Work"}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {locale === "es" ? "Video resumen de eventos recientes" : "Highlight reel of recent events"}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-white transition-colors hover:bg-foreground/20"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-white transition-colors hover:bg-foreground/20"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-white transition-colors hover:bg-foreground/20"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={portfolioItems[lightboxIndex].image}
                alt={locale === "es" ? portfolioItems[lightboxIndex].titleEs : portfolioItems[lightboxIndex].titleEn}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-auto object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="font-serif text-xl font-semibold text-white">
                  {locale === "es" ? portfolioItems[lightboxIndex].titleEs : portfolioItems[lightboxIndex].titleEn}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {locale === "es" ? portfolioItems[lightboxIndex].descEs : portfolioItems[lightboxIndex].descEn}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
