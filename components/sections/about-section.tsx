"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Shield, Layers, DollarSign, Calendar, Users, Award } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

const stats = [
  { value: "500+", labelEn: "Events Produced", labelEs: "Eventos Producidos", icon: Calendar },
  { value: "200+", labelEn: "Happy Clients", labelEs: "Clientes Satisfechos", icon: Users },
  { value: "8+", labelEn: "Years of Experience", labelEs: "Anos de Experiencia", icon: Award },
]

export function AboutSection() {
  const { t, locale } = useI18n()

  const values = [
    { icon: Shield, title: t("about.value1.title"), desc: t("about.value1.desc") },
    { icon: Layers, title: t("about.value2.title"), desc: t("about.value2.desc") },
    { icon: DollarSign, title: t("about.value3.title"), desc: t("about.value3.desc") },
  ]

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">

          {/* Left: Image stack with overlay stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7 }}
            className="relative flex-shrink-0 lg:w-[460px]"
          >
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/about-team.jpg"
                alt={locale === "es" ? "Equipo de produccion Eventos 360" : "E360 event production team at work"}
                width={460}
                height={560}
                className="h-auto w-full object-cover"
                style={{ width: "100%", height: "auto" }}
              />
              {/* Cinematic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-4 rounded-2xl border border-border/30 bg-card/95 p-5 shadow-2xl backdrop-blur-xl lg:-right-8"
            >
              <div className="flex gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="flex justify-center mb-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold)]/10">
                        <stat.icon size={14} className="text-[var(--gold)]" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground leading-tight max-w-[60px]">
                      {locale === "es" ? stat.labelEs : stat.labelEn}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Logo badge */}
            <div className="absolute -top-3 -left-3 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background bg-card shadow-xl lg:-left-5">
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={48}
                height={48}
                className="object-contain"
                style={{ width: 48, height: 48 }}
              />
            </div>

            {/* Gold accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }}
            />
          </motion.div>

          {/* Right: Story + values */}
          <div className="flex-1">
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.25em] text-[var(--gold)] uppercase"
            >
              {t("about.label")}
            </motion.p>
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance"
            >
              {t("about.title")}
            </motion.h2>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-7 space-y-5 text-muted-foreground leading-relaxed text-base lg:text-lg"
            >
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p className="font-medium text-foreground/80">{t("about.p3")}</p>
            </motion.div>

            {/* Values */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="group rounded-xl border border-border/30 bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-[var(--gold)]/20 hover:bg-card/70"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/8 transition-colors group-hover:bg-[var(--gold)]/15">
                    <v.icon size={20} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
