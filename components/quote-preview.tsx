"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronRight, Calculator } from "lucide-react"
import { useApp } from "@/components/providers"

const popularPackages = [
  { name: "Magic", price: "$6,500", duration: "5 hrs servicio continuo" },
  { name: "Magic Pixeles", price: "$8,184", duration: "5 hrs servicio continuo" },
  { name: "Fancy", price: "$21,120", duration: "6 hrs servicio continuo" },
  { name: "Luxury", price: "$36,960", duration: "6 hrs servicio continuo" },
  { name: "Gold Bar", price: "$43,560", duration: "6 hrs servicio continuo" },
  { name: "Sweet Dream", price: "$55,440", duration: "7 hrs servicio continuo" },
]

export function QuotePreview() {
  const { t } = useApp()
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div
          className={`overflow-hidden rounded-3xl border border-border bg-card transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10">
                <Calculator className="h-5 w-5 text-gold" />
              </div>
              <p className="gradient-neon-text mb-2 text-[11px] font-medium uppercase tracking-[0.35em]">
                {t.quote.label}
              </p>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl text-balance">
                {t.quote.heading}
              </h2>
              <p className="mb-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                {t.quote.subtitle}
              </p>
              <Link
                href="/catalogo"
                className="btn-neon inline-flex w-fit items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white"
              >
                {t.quote.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border-t border-border bg-secondary/30 p-8 lg:border-l lg:border-t-0 lg:p-12">
              <h3 className="mb-5 text-sm font-semibold text-foreground">
                {t.quote.popular}
              </h3>
              <div className="space-y-2">
                {popularPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center justify-between rounded-xl bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">{pkg.duration}</p>
                    </div>
                    <span className="text-sm font-semibold text-gold">{pkg.price}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{t.quote.moreServices}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
