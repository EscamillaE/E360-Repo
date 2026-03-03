"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { translations, type Locale, type Translations } from "@/lib/i18n"

interface AppContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")
  const [theme, setThemeState] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const saved = localStorage.getItem("e360-locale") as Locale | null
    if (saved === "en" || saved === "es") setLocaleState(saved)
    const savedTheme = localStorage.getItem("e360-theme") as "light" | "dark" | null
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")
    localStorage.setItem("e360-theme", theme)
  }, [theme])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem("e360-locale", l)
  }, [])

  const setTheme = useCallback((t: "light" | "dark") => {
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const t = translations[locale]

  return (
    <AppContext.Provider
      value={{ locale, setLocale, t, theme, setTheme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
