"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/providers"

export function Navbar() {
  const { t, locale, setLocale, theme, toggleTheme } = useApp()
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
        {/* Company Name */}
        <Link href="/" className="flex items-center">
          <span className="text-lg font-bold tracking-wide text-foreground">
            EVENTOS <span className="gradient-neon-text">360</span>
          </span>
        </Link>

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

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* EN/ES Toggle */}
          <button
            onClick={() => setLocale(locale === "es" ? "en" : "es")}
            className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 text-xs font-medium text-foreground transition-all hover:bg-secondary"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{locale === "es" ? "ES" : "EN"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/50 transition-all hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-muted-foreground" />
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border lg:hidden"
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
