"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, Home, ShoppingBag, Image, Users, Mail, Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/providers"

// Navigation sections - portals with clear boundaries
const navSections = [
  { id: "inicio", labelEs: "Inicio", labelEn: "Home", labelFr: "Accueil", icon: Home, href: "#" },
  { id: "servicios", labelEs: "Servicios", labelEn: "Services", labelFr: "Services", icon: Sparkles, href: "#servicios" },
  { id: "catalogo", labelEs: "Catalogo", labelEn: "Catalog", labelFr: "Catalogue", icon: ShoppingBag, href: "/catalogo" },
  { id: "galeria", labelEs: "Galeria", labelEn: "Gallery", labelFr: "Galerie", icon: Image, href: "#galeria" },
  { id: "contacto", labelEs: "Contacto", labelEn: "Contact", labelFr: "Contact", icon: Mail, href: "#contacto" },
]

interface NavbarProps {
  showBack?: boolean
  backHref?: string
  onLunaToggle?: () => void
  lunaActive?: boolean
}

export function Navbar({ showBack, backHref = "/", onLunaToggle, lunaActive }: NavbarProps) {
  const { t, locale, cycleLocale, theme, toggleTheme } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")

  const getLabel = (section: typeof navSections[0]) => {
    if (locale === "es") return section.labelEs
    if (locale === "fr") return section.labelFr
    return section.labelEn
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Detect active section
      const sections = ["contacto", "galeria", "servicios", "inicio"]
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const localeLabel = locale === "es" ? "ES" : locale === "en" ? "EN" : "FR"

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          isScrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Left side - Text Logo only (no image) */}
          <div className="flex items-center gap-3">
            {showBack && (
              <Link 
                href={backHref}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card/50 transition-all hover:border-gold hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
              >
                <ArrowLeft className="h-4 w-4 text-foreground" />
              </Link>
            )}
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold tracking-tight">
                <span className="bg-gradient-to-r from-neon-orange via-gold to-neon-yellow bg-clip-text text-transparent">
                  eventos
                </span>
                <span className="text-foreground">360</span>
              </span>
            </Link>
          </div>

          {/* Desktop Dock Navigation - Apple-style */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-0.5 rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm p-1 transition-all hover:border-gold/30">
              {navSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                const isExternal = section.href.startsWith("/")
                
                const content = (
                  <div className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1 relative group cursor-pointer rounded-xl transition-all",
                    isActive && "bg-gradient-to-b from-gold/10 to-transparent"
                  )}>
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-gradient-to-br from-neon-orange to-gold shadow-[0_0_12px_hsl(32,100%,52%,0.5)]" 
                        : "bg-transparent group-hover:bg-gold/10"
                    )}>
                      <Icon className={cn(
                        "h-3.5 w-3.5 transition-colors",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-gold"
                      )} />
                    </div>
                    <span className={cn(
                      "text-[9px] font-medium transition-colors",
                      isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {getLabel(section)}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                    )}
                  </div>
                )
                
                if (isExternal) {
                  return <Link key={section.id} href={section.href}>{content}</Link>
                }
                return <a key={section.id} href={section.href}>{content}</a>
              })}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Luna AI Toggle - Prominent */}
            {onLunaToggle && (
              <button
                onClick={onLunaToggle}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                  lunaActive
                    ? "border-gold bg-gradient-to-br from-neon-orange to-gold shadow-[0_0_20px_hsl(32,100%,52%,0.5)]"
                    : "border-border bg-card/50 hover:border-gold/50 hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
                )}
                aria-label="Toggle Luna AI"
              >
                <div className={cn(
                  "w-4 h-4 rounded-full transition-all duration-500",
                  lunaActive 
                    ? "bg-white animate-pulse" 
                    : "bg-gradient-to-br from-gold to-neon-orange"
                )}>
                  {lunaActive && (
                    <div className="absolute inset-0 m-2.5 rounded-full bg-white/50 animate-ping" />
                  )}
                </div>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={cycleLocale}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card/50 text-xs font-bold text-foreground transition-all hover:border-gold hover:shadow-[0_0_15px_hsl(32,100%,52%,0.2)]"
              aria-label="Toggle language"
            >
              {localeLabel}
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

            {/* Mobile menu toggle */}
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
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute top-20 left-4 right-4 rounded-2xl border-2 border-border bg-card/95 p-4 shadow-2xl">
            <div className="grid grid-cols-3 gap-2">
              {navSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                const isExternal = section.href.startsWith("/")
                
                const content = (
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 transition-all",
                      isActive 
                        ? "bg-gradient-to-br from-neon-orange/20 to-gold/20 border-2 border-gold" 
                        : "border-2 border-transparent hover:border-gold/30 hover:bg-card"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                      isActive 
                        ? "bg-gradient-to-br from-neon-orange to-gold shadow-[0_0_15px_hsl(32,100%,52%,0.4)]" 
                        : "bg-muted"
                    )}>
                      <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                    </div>
                    <span className={cn("text-xs font-medium", isActive ? "text-gold" : "text-muted-foreground")}>
                      {getLabel(section)}
                    </span>
                  </div>
                )
                
                if (isExternal) {
                  return <Link key={section.id} href={section.href}>{content}</Link>
                }
                return <a key={section.id} href={section.href}>{content}</a>
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
