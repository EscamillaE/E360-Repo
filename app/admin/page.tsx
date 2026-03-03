"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Plus,
  ChevronRight,
  ArrowLeft,
  Eye,
} from "lucide-react"

type AdminTab = "dashboard" | "catalog" | "quotes" | "clients" | "settings"

const tabs = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog" as const, label: "Catalogo", icon: Package },
  { id: "quotes" as const, label: "Cotizaciones", icon: FileText },
  { id: "clients" as const, label: "Clientes", icon: Users },
  { id: "settings" as const, label: "Config", icon: Settings },
]

// Mock data for the dashboard
const recentQuotes = [
  { id: "Q-001", client: "Maria Lopez", event: "Boda", total: 46200, status: "pendiente", date: "2026-03-15" },
  { id: "Q-002", client: "Carlos Ruiz", event: "Corporativo", total: 17600, status: "aprobada", date: "2026-03-20" },
  { id: "Q-003", client: "Ana Gomez", event: "XV Anos", total: 30800, status: "en revision", date: "2026-04-01" },
  { id: "Q-004", client: "Roberto Diaz", event: "Social", total: 9900, status: "aprobada", date: "2026-04-10" },
  { id: "Q-005", client: "Sofia Martinez", event: "Boda", total: 36300, status: "pendiente", date: "2026-04-15" },
]

const stats = [
  { label: "Cotizaciones este mes", value: "24", change: "+12%", icon: FileText },
  { label: "Ingresos del mes", value: "$186,450", change: "+8%", icon: DollarSign },
  { label: "Eventos proximos", value: "7", change: "+3", icon: Calendar },
  { label: "Clientes activos", value: "42", change: "+5", icon: Users },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pendiente: "bg-amber-500/10 text-amber-400",
    aprobada: "bg-emerald-500/10 text-emerald-400",
    "en revision": "bg-blue-500/10 text-blue-400",
    rechazada: "bg-red-500/10 text-red-400",
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${colors[status] || "bg-secondary text-muted-foreground"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <h1 className="text-sm font-bold text-foreground">
              EVENTOS <span className="text-gold">360</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">Panel Administrativo</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-gold/10 font-medium text-gold"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-border px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  Resumen general de actividad
                </p>
              </div>

              {/* Stats grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border bg-card/50 p-5"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                          <Icon className="h-4 w-4 text-gold" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Recent quotes table */}
              <div className="rounded-2xl border border-border bg-card/50">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Cotizaciones Recientes
                  </h3>
                  <button className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-all hover:bg-gold/20">
                    <Plus className="h-3 w-3" />
                    Nueva
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Evento</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentQuotes.map((quote) => (
                        <tr
                          key={quote.id}
                          className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                        >
                          <td className="px-5 py-3 text-xs font-medium text-gold">
                            {quote.id}
                          </td>
                          <td className="px-5 py-3 text-sm text-foreground">
                            {quote.client}
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {quote.event}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium text-foreground">
                            ${quote.total.toLocaleString()} MXN
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={quote.status} />
                          </td>
                          <td className="px-5 py-3 text-xs text-muted-foreground">
                            {quote.date}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Catalog management */}
          {activeTab === "catalog" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Catalogo de Productos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Administra productos, precios y categorias
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light">
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <Package className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Gestion de Catalogo
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Aqui podras agregar, editar y eliminar productos y servicios
                  del catalogo. Conecta una base de datos para habilitar la
                  gestion completa.
                </p>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light"
                >
                  Ver catalogo publico
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Quotes management */}
          {activeTab === "quotes" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Cotizaciones
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gestiona todas las cotizaciones de tus clientes
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <FileText className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Gestion de Cotizaciones
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crea, edita y da seguimiento a cotizaciones. Conecta una base
                  de datos para habilitar la gestion completa de cotizaciones.
                </p>
              </div>
            </div>
          )}

          {/* Clients management */}
          {activeTab === "clients" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
                <p className="text-sm text-muted-foreground">
                  Directorio y gestion de clientes
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <Users className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Directorio de Clientes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Administra tu directorio de clientes, historial de eventos y
                  preferencias. Conecta una base de datos para habilitar la
                  gestion completa.
                </p>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Configuracion
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ajustes generales del sistema
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Informacion del Negocio
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Nombre, direccion, contacto y logotipo del negocio.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Precios y Moneda
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configuracion de precios base, impuestos y moneda (MXN).
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Integraciones
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp Business, redes sociales y pasarelas de pago.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Modo Kiosk
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configuracion del modo kiosk para expos y eventos presenciales.
                  </p>
                  <Link
                    href="/kiosk"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold transition-colors hover:text-gold-light"
                  >
                    Abrir modo kiosk
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
