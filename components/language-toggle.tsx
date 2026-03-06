"use client"

import { useI18n, type Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  const toggle = () => {
    setLocale(locale === "en" ? "es" : "en")
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 items-center gap-1 rounded-full border border-border/40 bg-muted/50 px-3 text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={locale === "en" ? "Cambiar a Espa\u00F1ol" : "Switch to English"}
    >
      <span className={locale === "en" ? "text-foreground" : "text-muted-foreground/50"}>EN</span>
      <span className="text-border">/</span>
      <span className={locale === "es" ? "text-foreground" : "text-muted-foreground/50"}>ES</span>
    </button>
  )
}
