"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useApp } from "@/components/providers"
import { ParticlesBackground } from "@/components/particles-background"
import { E360AnimatedLogo } from "@/components/e360-animated-logo"

export function HeroSection() {
  const { t } = useApp()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      id="inicio"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Gradient Background - Neon Orange to Gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/5 via-background to-gold/5 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-orange/10 via-transparent to-transparent z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent z-0" />
      
      {/* Particles */}
      <ParticlesBackground />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Animated E360 Logo with Mic Activation */}
        <div className={`mb-8 transition-all delay-200 duration-700 ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
        }`}>
          <E360AnimatedLogo size={180} showMicButton className="mx-auto" />
        </div>

        {/* Tagline */}
        <p
          className={`gradient-neon-text mb-4 text-[11px] font-medium uppercase tracking-[0.35em] transition-all delay-400 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.tagline}
        </p>

        {/* Heading */}
        <h1
          className={`mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground transition-all delay-500 duration-700 md:text-5xl lg:text-6xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-balance">
            {t.hero.heading1}
            <br />
            <span className="gradient-neon-text">{t.hero.heading2}</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`mb-10 max-w-lg text-base leading-relaxed text-muted-foreground transition-all delay-700 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:gap-4 transition-all delay-[900ms] duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/catalogo"
            className="btn-neon inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_hsl(32,100%,52%,0.3)] hover:shadow-[0_0_40px_hsl(32,100%,52%,0.5)] transition-shadow"
          >
            {t.hero.cta1}
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full border-2 border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-gold hover:shadow-[0_0_25px_hsl(32,100%,52%,0.2)]"
          >
            {t.hero.cta2}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
