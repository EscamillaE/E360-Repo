"use client"

import Image from "next/image"
import Link from "next/link"
import { useApp } from "@/components/providers"

export function Footer() {
  const { t } = useApp()

  return (
    <footer id="contacto" className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* CTA */}
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t.footer.heading}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t.footer.subtitle}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light"
            >
              {t.footer.whatsapp}
            </a>
            <a
              href="mailto:contacto@eventos360.com"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
            >
              {t.footer.email}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="Eventos 360" width={48} height={48} className="mb-4" />
          <p className="mb-6 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            {t.footer.description}
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-4 text-[13px]">
            <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.catalog}
            </Link>
            <Link href="/cliente" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.portals.client}
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.portals.admin}
            </Link>
            <Link href="/kiosk" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.portals.kiosk}
            </Link>
          </div>
          <div className="w-full border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              {"2026 Eventos 360 Queretaro. "}{t.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
