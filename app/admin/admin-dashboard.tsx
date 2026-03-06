"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Check,
  X,
  Sparkles,
  LogOut,
  Loader2,
  Edit2,
  Trash2,
  Star,
} from "lucide-react"
import { useLanguage } from "@/components/providers"
import type { UserProfile } from "@/lib/actions/client"
import type { AdminStats, AdminQuote, AdminCatalogItem, AdminClient } from "@/lib/actions/admin"
import type { Category } from "@/lib/actions/catalog"
import { signOut } from "@/lib/actions/client"
import { updateQuoteStatus, updateCatalogItem, deleteCatalogItem } from "@/lib/actions/admin"

type AdminTab = "dashboard" | "catalog" | "quotes" | "clients" | "settings"

interface AdminDashboardProps {
  user: { id: string; email: string }
  profile: UserProfile | null
  stats: AdminStats
  quotes: AdminQuote[]
  catalog: AdminCatalogItem[]
  clients: AdminClient[]
  categories: Category[]
}

export function AdminDashboard({ user, profile, stats, quotes, catalog, clients, categories }: AdminDashboardProps) {
  const { language } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [updatingQuote, setUpdatingQuote] = useState<string | null>(null)
  const [catalogItems, setCatalogItems] = useState(catalog)
  const [deletingItem, setDeletingItem] = useState<string | null>(null)

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "catalog" as const, label: "Catalogo", icon: Package },
    { id: "quotes" as const, label: "Cotizaciones", icon: FileText },
    { id: "clients" as const, label: "Clientes", icon: Users },
    { id: "settings" as const, label: "Config", icon: Settings },
  ]

  const statCards = [
    { label: "Cotizaciones este mes", value: stats.quotesThisMonth.toString(), change: `${stats.totalQuotes} total`, icon: FileText },
    { label: "Ingresos del mes", value: `$${stats.revenueThisMonth.toLocaleString()}`, change: `$${stats.totalRevenue.toLocaleString()} total`, icon: DollarSign },
    { label: "Eventos proximos", value: stats.upcomingEvents.toString(), icon: Calendar },
    { label: "Clientes registrados", value: stats.totalClients.toString(), icon: Users },
  ]

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  const handleUpdateQuoteStatus = async (quoteId: string, status: 'approved' | 'rejected') => {
    setUpdatingQuote(quoteId)
    await updateQuoteStatus(quoteId, status)
    router.refresh()
    setUpdatingQuote(null)
  }

  const handleTogglePopular = async (itemId: string, currentValue: boolean) => {
    setCatalogItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, is_popular: !currentValue } : item
    ))
    await updateCatalogItem(itemId, { is_popular: !currentValue })
  }

  const handleToggleActive = async (itemId: string, currentValue: boolean) => {
    setCatalogItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, is_active: !currentValue } : item
    ))
    await updateCatalogItem(itemId, { is_active: !currentValue })
  }

  const handleDeleteItem = async (itemId: string) => {
    setDeletingItem(itemId)
    const result = await deleteCatalogItem(itemId)
    if (result.success) {
      setCatalogItems(prev => prev.filter(item => item.id !== itemId))
    }
    setDeletingItem(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-400'
      case 'pending': return 'bg-amber-500/10 text-amber-400'
      case 'draft': return 'bg-blue-500/10 text-blue-400'
      case 'rejected': return 'bg-red-500/10 text-red-400'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
    }
    return labels[status] || status
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
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
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{profile?.full_name || user.email}</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Cerrar Sesion
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                {statCards.map((stat) => {
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
                        {stat.change && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            {stat.change}
                          </span>
                        )}
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
                  <Link href="/cotizador" className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-all hover:bg-gold/20">
                    <Plus className="h-3 w-3" />
                    Nueva
                  </Link>
                </div>
                {quotes.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No hay cotizaciones aun
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Evento</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                          <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.slice(0, 10).map((quote) => (
                          <tr
                            key={quote.id}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-5 py-3 text-sm font-medium text-foreground">
                              {quote.event_name}
                            </td>
                            <td className="px-5 py-3 text-sm text-muted-foreground">
                              {quote.profile?.full_name || 'Sin nombre'}
                            </td>
                            <td className="px-5 py-3 text-sm text-muted-foreground">
                              {quote.event_type || '-'}
                            </td>
                            <td className="px-5 py-3 text-sm font-medium text-gold">
                              ${quote.total.toLocaleString()} MXN
                            </td>
                            <td className="px-5 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusColor(quote.status)}`}>
                                {getStatusLabel(quote.status)}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {formatDate(quote.created_at)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {quote.status === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleUpdateQuoteStatus(quote.id, 'approved')}
                                      disabled={updatingQuote === quote.id}
                                      className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-400 transition-colors hover:bg-emerald-500/10"
                                      title="Aprobar"
                                    >
                                      {updatingQuote === quote.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateQuoteStatus(quote.id, 'rejected')}
                                      disabled={updatingQuote === quote.id}
                                      className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-500/10"
                                      title="Rechazar"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                )}
                                <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title="Ver detalles">
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                    {catalogItems.length} productos en {categories.length} categorias
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Producto</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Categoria</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Precio</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground">Popular</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground">Activo</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catalogItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${!item.is_active ? 'opacity-50' : ''}`}
                        >
                          <td className="px-5 py-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{language === 'es' ? item.name_es : item.name_en}</p>
                              {item.description_es && (
                                <p className="text-xs text-muted-foreground truncate max-w-xs">{language === 'es' ? item.description_es : item.description_en}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {item.category ? (language === 'es' ? item.category.name_es : item.category.name_en) : '-'}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium text-gold">
                            ${Number(item.price).toLocaleString()} MXN
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleTogglePopular(item.id, item.is_popular)}
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                                item.is_popular ? 'text-gold bg-gold/10' : 'text-muted-foreground hover:bg-secondary'
                              }`}
                            >
                              <Star className={`h-4 w-4 ${item.is_popular ? 'fill-current' : ''}`} />
                            </button>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                                item.is_active ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground hover:bg-secondary'
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title="Editar">
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={deletingItem === item.id}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-500/10" 
                                title="Eliminar"
                              >
                                {deletingItem === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quotes management */}
          {activeTab === "quotes" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Todas las Cotizaciones
                </h2>
                <p className="text-sm text-muted-foreground">
                  {quotes.length} cotizaciones totales
                </p>
              </div>

              {quotes.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No hay cotizaciones registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-gold/20"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            {quote.event_name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cliente: {quote.profile?.full_name || 'Sin nombre'} | {quote.event_type || 'Sin tipo'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Creada: {formatDate(quote.created_at)}
                            {quote.event_date && ` | Evento: ${formatDate(quote.event_date)}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gold">${quote.total.toLocaleString()} MXN</p>
                          <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusColor(quote.status)}`}>
                            {getStatusLabel(quote.status)}
                          </span>
                        </div>
                      </div>
                      {quote.status === 'pending' && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleUpdateQuoteStatus(quote.id, 'approved')}
                            disabled={updatingQuote === quote.id}
                            className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleUpdateQuoteStatus(quote.id, 'rejected')}
                            disabled={updatingQuote === quote.id}
                            className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20"
                          >
                            <X className="h-3.5 w-3.5" />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clients management */}
          {activeTab === "clients" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
                <p className="text-sm text-muted-foreground">
                  {clients.length} clientes registrados
                </p>
              </div>

              {clients.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No hay clientes registrados</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Contacto</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cotizaciones</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Total Gastado</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Registro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr
                            key={client.id}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-5 py-3">
                              <p className="text-sm font-medium text-foreground">{client.full_name || 'Sin nombre'}</p>
                            </td>
                            <td className="px-5 py-3">
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              {client.phone && <p className="text-xs text-muted-foreground">{client.phone}</p>}
                            </td>
                            <td className="px-5 py-3 text-sm text-foreground">
                              {client.quote_count}
                            </td>
                            <td className="px-5 py-3 text-sm font-medium text-gold">
                              ${client.total_spent.toLocaleString()} MXN
                            </td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {formatDate(client.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                    Modo Kiosk
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Configuracion del modo kiosk para expos y eventos presenciales.
                  </p>
                  <Link
                    href="/kiosk"
                    className="inline-flex items-center gap-1.5 text-xs text-gold transition-colors hover:text-gold-light"
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
