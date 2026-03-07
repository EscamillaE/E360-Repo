"use client"

import Image from "next/image"
import Link from "next/link"
import { useApp } from "@/components/providers"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

// Contact information
const CONTACT = {
  phone: "442-795-3753",
  phone2: "442-795-3749",
  whatsapp: "5214427953753",
  email: "proyectos360.qro@gmail.com",
  instagram: "eventos_360_qro",
  facebook: "Eventos360Qro",
  location: "Queretaro, Mexico",
}

export function Footer() {
  const { t, locale } = useApp()

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
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(locale === "es" ? "Hola, me interesa cotizar un evento con Eventos 360" : "Hello, I'm interested in getting a quote for an event with Eventos 360")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              {t.footer.whatsapp}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
            >
              <Mail className="h-4 w-4" />
              {t.footer.email}
            </a>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Phone */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {locale === "es" ? "Telefono" : "Phone"}
            </p>
            <a href={`tel:+52${CONTACT.phone.replace(/-/g, "")}`} className="text-sm font-semibold text-foreground hover:text-gold transition-colors">
              {CONTACT.phone}
            </a>
            <a href={`tel:+52${CONTACT.phone2.replace(/-/g, "")}`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
              {CONTACT.phone2}
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </p>
            <a href={`mailto:${CONTACT.email}`} className="text-sm font-semibold text-foreground hover:text-gold transition-colors break-all">
              {CONTACT.email}
            </a>
          </div>

          {/* Instagram */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Instagram className="h-5 w-5 text-gold" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Instagram
            </p>
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-gold transition-colors"
            >
              @{CONTACT.instagram}
            </a>
          </div>

          {/* Facebook */}
          <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Facebook className="h-5 w-5 text-gold" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Facebook
            </p>
            <a
              href={`https://facebook.com/${CONTACT.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-gold transition-colors"
            >
              Eventos 360 Qro
            </a>
          </div>
        </div>

        {/* Location Note */}
        <div className="mb-14 rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="font-medium">{CONTACT.location}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {locale === "es"
              ? "Si tu evento es fuera del cuadro de Queretaro, tiene un costo extra de traslado."
              : "Events outside of Queretaro city may incur additional transportation costs."}
          </p>
        </div>

        {/* Social Icons Row */}
        <div className="mb-8 flex justify-center gap-4">
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
            aria-label="WhatsApp"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={`https://instagram.com/${CONTACT.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={`https://facebook.com/${CONTACT.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="Eventos 360" width={48} height={48} className="mb-4" />
          <p className="mb-2 text-sm font-semibold text-foreground">
            {locale === "es" ? "Produccion de eventos, logistica, gestion y tecnica." : "Event production, logistics, management and technical services."}
          </p>
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
