"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Sun, Moon, Globe, Home, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/providers"
import { LunaOrbButton } from "@/components/luna-orb-button"

interface NavbarProps {
  showBack?: boolean
  backHref?: string
  onLunaClick?: () => void
}

export function Navbar({ showBack, backHref = "/", onLunaClick }: NavbarProps) {
  const { t, locale, cycleLocale, theme, toggleTheme } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.services, href: "#servicios" },
    { label: t.nav.catalog, href: "/catalogo" },
    { label: t.nav.gallery, href: "#galeria" },
    { label: t.nav.contact, href: "#contacto" },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const localeLabel = locale === "es" ? "ES" : locale === "en" ? "EN" : "FR"

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        isScrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left side - Logo or Back button */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link 
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card/50 transition-all hover:border-gold hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </Link>
          ) : null}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="text-sm font-semibold tracking-wide text-foreground">
              EVENTOS <span className="gradient-neon-text">360</span>
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls - Always visible */}
        <div className="flex items-center gap-2">
          {/* Luna Orb Button - AI Assistant */}
          {onLunaClick && (
            <LunaOrbButton 
              onClick={onLunaClick}
              size="sm"
              className="mr-1"
            />
          )}

          {/* Language Toggle (ES/EN/FR) */}
          <button
            onClick={cycleLocale}
            className="flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-card/50 px-3 text-xs font-medium text-foreground transition-all hover:border-gold hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-gold" />
            <span>{localeLabel}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card/50 transition-all hover:border-gold hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-gold" />
            ) : (
              <Moon className="h-4 w-4 text-gold" />
            )}
          </button>

          {/* CTA */}
          <Link
            href="/catalogo"
            className="btn-neon hidden rounded-full px-5 py-2 text-xs font-semibold text-white sm:inline-flex"
          >
            {t.nav.quote}
          </Link>

          {/* Mobile menu */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card/50 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="h-4 w-4 text-foreground" />
            ) : (
              <Menu className="h-4 w-4 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          isMobileOpen ? "max-h-96" : "max-h-0 border-b-0"
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            onClick={() => setIsMobileOpen(false)}
            className="btn-neon mt-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            {t.nav.quoteNow}
          </Link>
        </div>
      </div>
    </nav>
  )
}
