"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Inicio", href: "#" },
  { label: "Servicios", href: "#services" },
  { label: "Galeria", href: "#gallery" },
  { label: "Contacto", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        isScrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-sm font-bold tracking-wide text-foreground">
            EVENTOS <span className="text-gold">360</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light"
          >
            Cotizar
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4 text-foreground" />
          ) : (
            <Menu className="h-4 w-4 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          isMobileOpen ? "max-h-80" : "max-h-0 border-b-0"
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-gold px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Cotizar Ahora
          </a>
        </div>
      </div>
    </nav>
  )
}
