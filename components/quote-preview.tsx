"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronRight, Calculator } from "lucide-react"

const popularPackages = [
  { name: "Cabina Blanca", price: "$4,830", duration: "5 hrs" },
  { name: "Party con pantallas", price: "$11,000", duration: "5 hrs" },
  { name: "Luxury", price: "$30,800", duration: "6 hrs" },
  { name: "Sweet Dream", price: "$46,200", duration: "7 hrs" },
]

export function QuotePreview() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

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

  return (
    <section ref={ref} id="cotizador" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div
          className={`overflow-hidden rounded-3xl border border-gold/20 bg-card/50 backdrop-blur-sm transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left - CTA */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                <Calculator className="h-6 w-6 text-gold" />
              </div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                Calcula tu Cotizacion
              </p>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl text-balance">
                Arma tu evento perfecto
              </h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Selecciona los servicios que necesitas y obtendras un estimado
                al instante. Todos los precios en pesos mexicanos (MXN). Envia
                tu cotizacion por WhatsApp con un solo clic.
              </p>
              <Link
                href="/cotizador"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
              >
                Abrir Cotizador
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right - Popular packages preview */}
            <div className="border-t border-border bg-secondary/20 p-8 lg:border-l lg:border-t-0 lg:p-12">
              <h3 className="mb-5 text-sm font-semibold text-foreground">
                Paquetes populares
              </h3>
              <div className="space-y-3">
                {popularPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3 transition-all hover:bg-card"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {pkg.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.duration}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gold">
                      {pkg.price}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                +40 servicios disponibles en el cotizador completo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
