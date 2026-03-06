"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export function FooterSection() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="border-t border-border/30 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: 40, height: 40 }}
            />
            <div>
              <p className="font-serif text-sm font-semibold text-foreground">Eventos 360</p>
              <p className="text-xs text-muted-foreground">{t("footer.tagline")}</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { label: t("nav.services"), href: "#services" },
              { label: t("nav.packages" as never), href: "/packages", isLink: true },
              { label: t("nav.portfolio"), href: "#portfolio" },
              { label: t("nav.about"), href: "#about" },
              { label: t("nav.contact"), href: "#contact" },
            ].map((link) => (
              'isLink' in link && link.isLink ? (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </button>
              )
            ))}
            <Link href="/operations" className="transition-colors hover:text-foreground">{t("nav.staff")}</Link>
          </div>
        </div>

        {/* Gold accent divider */}
        <div className="mt-10 mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--gold)/30, transparent)" }} />

        <p className="text-center text-xs text-muted-foreground">
          {`\u00A9 ${year} Eventos 360. ${t("footer.rights")}`}
        </p>
      </div>
    </footer>
  )
}
