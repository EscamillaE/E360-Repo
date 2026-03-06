"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, Globe, User, LogIn, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/providers"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const { t, locale, setLocale, theme, toggleTheme } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? { email: user.email || '' } : null)
      setIsLoading(false)
    }
    
    checkAuth()
    
    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ? { email: session.user.email || '' } : null)
    })
    
    return () => subscription.unsubscribe()
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
            <Sparkles className="h-4 w-4 text-gold" />
            <div className="absolute inset-0 bg-gold/10 blur-xl rounded-full" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground">
            EVENTOS <span className="text-gold">360</span>
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

          {/* Auth buttons */}
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/cliente"
                  className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:bg-secondary sm:flex"
                >
                  <User className="h-3.5 w-3.5 text-gold" />
                  {locale === "es" ? "Mi Cuenta" : "My Account"}
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground transition-all hover:bg-secondary sm:flex"
                >
                  <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
                  {locale === "es" ? "Ingresar" : "Login"}
                </Link>
              )}
            </>
          )}

          {/* CTA */}
          <Link
            href="/cotizador"
            className="hidden rounded-full bg-gold px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-gold-light sm:inline-flex"
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
          isMobileOpen ? "max-h-[500px]" : "max-h-0 border-b-0"
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
          
          {/* Mobile auth */}
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/cliente"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gold transition-colors hover:bg-secondary"
                >
                  <User className="h-4 w-4" />
                  {locale === "es" ? "Mi Cuenta" : "My Account"}
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  {locale === "es" ? "Iniciar Sesion" : "Login"}
                </Link>
              )}
            </>
          )}
          
          <Link
            href="/cotizador"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 rounded-full bg-gold px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            {t.nav.quoteNow}
          </Link>
        </div>
      </div>
    </nav>
  )
}
