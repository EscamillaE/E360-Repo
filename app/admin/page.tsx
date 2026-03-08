"use client"

import { useState, useEffect, useCallback } from "react"
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
  Plus,
  ChevronRight,
  ArrowLeft,
  Eye,
  Loader2,
  X,
  Trash2,
  Edit2,
  LogOut,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type AdminTab = "dashboard" | "catalog" | "quotes" | "clients" | "settings"

interface Quote {
  id: string
  quote_number: string
  client_id: string | null
  event_type: string
  event_date: string | null
  venue: string | null
  items: unknown[]
  subtotal: number
  discount_percent: number
  total: number
  status: string
  notes: string | null
  created_at: string
  clients?: {
    id: string
    name: string
    email: string | null
    phone: string | null
  } | null
}

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

interface Stats {
  quotesThisMonth: number
  quotesChange: string
  revenueThisMonth: number
  revenueFormatted: string
  upcomingEvents: number
  totalClients: number
}

interface RecentQuote {
  id: string
  quoteNumber: string
  client: string
  event: string
  total: number
  status: string
  date: string | null
}

const tabs = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog" as const, label: "Catalogo", icon: Package },
  { id: "quotes" as const, label: "Cotizaciones", icon: FileText },
  { id: "clients" as const, label: "Clientes", icon: Users },
  { id: "settings" as const, label: "Config", icon: Settings },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pendiente: "bg-amber-500/10 text-amber-400",
    aprobada: "bg-emerald-500/10 text-emerald-400",
    "en revision": "bg-blue-500/10 text-blue-400",
    rechazada: "bg-red-500/10 text-red-400",
    completada: "bg-emerald-500/10 text-emerald-400",
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${colors[status] || "bg-secondary text-muted-foreground"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ClientModal({
  isOpen,
  onClose,
  client,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  onSave: (data: Partial<Client>) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    notes: client?.notes || "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        notes: client.notes || "",
      })
    } else {
      setFormData({ name: "", email: "", phone: "", notes: "" })
    }
  }, [client])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-medium text-foreground">Nombre *</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-medium text-foreground">Telefono</label>
            <input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs font-medium text-foreground">Notas</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50">
              {isSaving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showClientModal, setShowClientModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentQuotes(data.recentQuotes)
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error)
    }
  }, [])

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch("/api/quotes")
      if (res.ok) {
        const data = await res.json()
        setQuotes(data.quotes)
      }
    } catch (error) {
      console.error("Error fetching quotes:", error)
    }
  }, [])

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients")
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ email: user.email || "" })
      }
      await Promise.all([fetchDashboardData(), fetchQuotes(), fetchClients()])
      setIsLoading(false)
    }
    init()
  }, [fetchDashboardData, fetchQuotes, fetchClients])

  const handleSaveClient = async (data: Partial<Client>) => {
    const method = editingClient ? "PUT" : "POST"
    const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      await fetchClients()
      await fetchDashboardData()
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("¿Estas seguro de eliminar este cliente?")) return

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
    if (res.ok) {
      await fetchClients()
      await fetchDashboardData()
    }
  }

  const handleUpdateQuoteStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      await fetchQuotes()
      await fetchDashboardData()
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

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

        <div className="border-t border-border px-3 py-4 space-y-2">
          {user && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
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
                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                      <FileText className="h-4 w-4 text-gold" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      {stats?.quotesChange || "+0%"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats?.quotesThisMonth || 0}</p>
                  <p className="text-xs text-muted-foreground">Cotizaciones este mes</p>
                </div>

                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                      <DollarSign className="h-4 w-4 text-gold" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats?.revenueFormatted || "$0"}</p>
                  <p className="text-xs text-muted-foreground">Ingresos del mes</p>
                </div>

                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                      <Calendar className="h-4 w-4 text-gold" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats?.upcomingEvents || 0}</p>
                  <p className="text-xs text-muted-foreground">Eventos proximos</p>
                </div>

                <div className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                      <Users className="h-4 w-4 text-gold" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalClients || 0}</p>
                  <p className="text-xs text-muted-foreground">Clientes activos</p>
                </div>
              </div>

              {/* Recent quotes table */}
              <div className="rounded-2xl border border-border bg-card/50">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Cotizaciones Recientes
                  </h3>
                  <button
                    onClick={() => setActiveTab("quotes")}
                    className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-all hover:bg-gold/20"
                  >
                    Ver todas
                    <ChevronRight className="h-3 w-3" />
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
                      </tr>
                    </thead>
                    <tbody>
                      {recentQuotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                            No hay cotizaciones recientes
                          </td>
                        </tr>
                      ) : (
                        recentQuotes.map((quote) => (
                          <tr
                            key={quote.id}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-5 py-3 text-xs font-medium text-gold">
                              {quote.quoteNumber}
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
                              {quote.date || "-"}
                            </td>
                          </tr>
                        ))
                      )}
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
                <button className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90">
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
                  El catalogo esta conectado a la base de datos. Los productos
                  se muestran automaticamente en el cotizador y la pagina publica.
                </p>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold/80"
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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Cotizaciones
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Gestiona todas las cotizaciones de tus clientes
                  </p>
                </div>
                <Link href="/cotizador" className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90">
                  <Plus className="h-4 w-4" />
                  Nueva Cotizacion
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Evento</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                            No hay cotizaciones
                          </td>
                        </tr>
                      ) : (
                        quotes.map((quote) => (
                          <tr
                            key={quote.id}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-5 py-3 text-xs font-medium text-gold">
                              {quote.quote_number}
                            </td>
                            <td className="px-5 py-3 text-sm text-foreground">
                              {quote.clients?.name || "Sin cliente"}
                            </td>
                            <td className="px-5 py-3 text-sm text-muted-foreground">
                              {quote.event_type}
                            </td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {quote.event_date || "-"}
                            </td>
                            <td className="px-5 py-3 text-sm font-medium text-foreground">
                              ${Number(quote.total).toLocaleString()} MXN
                            </td>
                            <td className="px-5 py-3">
                              <select
                                value={quote.status}
                                onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value)}
                                className="rounded-md border border-border bg-transparent px-2 py-1 text-xs text-foreground"
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="en revision">En revision</option>
                                <option value="aprobada">Aprobada</option>
                                <option value="rechazada">Rechazada</option>
                                <option value="completada">Completada</option>
                              </select>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Clients management */}
          {activeTab === "clients" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
                  <p className="text-sm text-muted-foreground">
                    Directorio y gestion de clientes
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingClient(null)
                    setShowClientModal(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Cliente
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Nombre</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Telefono</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                            No hay clientes registrados
                          </td>
                        </tr>
                      ) : (
                        clients.map((client) => (
                          <tr
                            key={client.id}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-5 py-3 text-sm font-medium text-foreground">
                              {client.name}
                            </td>
                            <td className="px-5 py-3 text-sm text-muted-foreground">
                              {client.email || "-"}
                            </td>
                            <td className="px-5 py-3 text-sm text-muted-foreground">
                              {client.phone || "-"}
                            </td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {new Date(client.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingClient(client)
                                    setShowClientModal(true)
                                  }}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold transition-colors hover:text-gold/80"
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

      {/* Client Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false)
          setEditingClient(null)
        }}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  )
}
