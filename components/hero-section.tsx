"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Users, Calendar } from "lucide-react"
import { motion } from "motion/react"
import { useI18n } from "@/lib/i18n"

export default function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden">
      <div className="pb-20 pt-32 md:pb-32 lg:pb-28 lg:pt-44">
        <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:px-12">
          {/* Two-column: copy left, product hero right */}
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">

            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-2 backdrop-blur-sm"
              >
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground/70">
                  {t("hero.badge")}
                </span>
              </motion.div>

              {/* Brand Title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif max-w-xl text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl xl:text-6xl"
              >
                <span className="text-foreground">{t("hero.title1")} </span>
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t("hero.title2")}
                </span>
              </motion.h1>

              {/* Production subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-[11px] font-semibold tracking-[0.25em] text-[var(--gold)]/70 uppercase md:text-xs"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 max-w-lg text-pretty text-base text-muted-foreground leading-relaxed lg:text-lg"
              >
                {t("hero.description")}
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start"
              >
                {[
                  { icon: Calendar, value: "500+", label: t("hero.stat.events") },
                  { icon: Users, value: "200+", label: t("hero.stat.clients") },
                  { icon: Star, value: "4.9", label: t("hero.stat.rating") },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <div className="mr-2 h-10 w-px bg-border/40" />}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/8">
                      <stat.icon size={18} className="text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-13 min-w-[220px] rounded-full px-8 text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-lg shadow-[var(--gold)]/20"
                >
                  <Link href="/configure">
                    <span className="text-nowrap">{t("hero.cta.primary")}</span>
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-13 min-w-[220px] rounded-full px-8 text-base text-foreground border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 transition-colors"
                >
                  <Link href="/packages">
                    <span className="text-nowrap">{t("hero.cta.secondary")}</span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: DJ Booth Product Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-xl flex-1 lg:mx-0"
            >
              {/* Volumetric gold halo behind the booth */}
              <div
                className="absolute left-1/2 top-[45%] -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[60px]"
                style={{ background: "radial-gradient(circle, var(--gold-neon) 0%, var(--gold) 40%, transparent 70%)" }}
              />
              {/* Subtle secondary glow for depth */}
              <div
                className="absolute left-1/2 top-[50%] -z-10 h-[50%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-8 blur-[80px]"
                style={{ background: "radial-gradient(ellipse, var(--gold) 0%, transparent 70%)" }}
              />

              {/* DJ booth cutout -- treated as a product hero object */}
              <Image
                src="/images/dj-booth-cutout.jpg"
                alt="Professional E360 DJ booth with LED panels, truss towers, speakers, and PAR stage lighting"
                width={600}
                height={500}
                className="relative z-10 h-auto w-full object-contain drop-shadow-2xl"
                style={{ width: "100%", height: "auto" }}
                priority
              />

              {/* Realistic soft floor shadow */}
              <div className="absolute -bottom-2 left-1/2 -z-10 h-8 w-[85%] -translate-x-1/2 rounded-[50%] bg-foreground/8 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
