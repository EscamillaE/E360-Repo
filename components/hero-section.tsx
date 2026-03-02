"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Radial background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, hsla(38, 92%, 50%, 0.06) 0%, transparent 100%)",
        }}
      />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 -m-4 rounded-full blur-3xl bg-gold/10" />
          <Image
            src="/images/logo.png"
            alt="Eventos 360 Logo"
            width={180}
            height={180}
            className="relative drop-shadow-2xl"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          className={`mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold transition-all delay-300 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Premium Event Production
        </p>

        {/* Heading */}
        <h1
          className={`mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground transition-all delay-500 duration-700 md:text-6xl lg:text-7xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-balance">
            Experiencias que
            <br />
            <span className="text-glow-gold text-gold">trascienden</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`mb-10 max-w-lg text-base leading-relaxed text-muted-foreground transition-all delay-700 duration-700 md:text-lg ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          DJ, audio, iluminacion, efectos especiales, shows de robot LED,
          drones y todo lo que necesitas para crear eventos inolvidables.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:gap-4 transition-all delay-[900ms] duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <a
            href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            Cotizar Evento
          </a>
          <button
            onClick={() => {
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card"
          >
            Ver Servicios
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
