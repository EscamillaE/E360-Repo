"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useApp } from "@/components/providers"

export function HeroSection() {
  const { t } = useApp()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 relative">
          <Image
            src="/images/logo.png"
            alt="Eventos 360 Logo"
            width={140}
            height={140}
            className="relative drop-shadow-lg"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          className={`mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-gold transition-all delay-300 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.tagline}
        </p>

        {/* Heading */}
        <h1
          className={`mb-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground transition-all delay-500 duration-700 md:text-6xl lg:text-7xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-balance">
            {t.hero.heading1}
            <br />
            <span className="text-gold">{t.hero.heading2}</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`mb-10 max-w-md text-[15px] leading-relaxed text-muted-foreground transition-all delay-700 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.subtitle}
        </p>

        {/* CTA */}
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:gap-4 transition-all delay-[900ms] duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light"
          >
            {t.hero.cta1}
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
          >
            {t.hero.cta2}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
