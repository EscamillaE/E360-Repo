"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  FileText,
  Users,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"

export type AdminTab = "inicio" | "calendario" | "catalogo" | "cotizaciones" | "contactos"

const NAV_ITEMS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "inicio", label: "Inicio", icon: LayoutDashboard },
  { key: "calendario", label: "Calendario", icon: Calendar },
  { key: "catalogo", label: "Catalogo", icon: ShoppingBag },
  { key: "cotizaciones", label: "Cotizaciones", icon: FileText },
  { key: "contactos", label: "Contactos", icon: Users },
]

interface AdminShellProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  children: React.ReactNode
}

export function AdminShell({ activeTab, onTabChange, children }: AdminShellProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.classList.toggle("light", next === "light")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar-background">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold text-gold-foreground font-sans text-sm font-black tracking-tight">
            E3
          </div>
          <div>
            <div className="font-sans text-sm font-black tracking-tight text-sidebar-foreground">EVENTOS 360</div>
            <div className="font-sans text-xs text-muted-foreground">Admin QRO</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar-background flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold text-gold-foreground font-sans text-sm font-black tracking-tight">
                  E3
                </div>
                <div className="font-sans text-sm font-black tracking-tight text-sidebar-foreground">EVENTOS 360</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = activeTab === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => { onTabChange(item.key); setSidebarOpen(false) }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="px-3 pb-4">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
              >
                {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-8 h-16 border-b border-border bg-card/50 glass shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-sans text-base font-bold text-foreground">
                {NAV_ITEMS.find((n) => n.key === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold text-gold-foreground font-sans text-xs font-black">
              E3
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden flex items-center justify-around border-t border-border bg-card/80 glass py-2 px-1 shrink-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  active ? "text-gold" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label.slice(0, 6)}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
