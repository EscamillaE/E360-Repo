"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sparkles,
  LogOut,
  Loader2,
  Trash2,
} from "lucide-react"
import { useApp } from "@/components/providers"
import type { UserProfile, ClientQuote, ClientEvent, ClientFavorite } from "@/lib/actions/client"
import { signOut, removeFavorite, updateUserProfile } from "@/lib/actions/client"

type ClientTab = "overview" | "quotes" | "events" | "favorites" | "chat"

interface ClientPortalProps {
  user: { id: string; email: string }
  profile: UserProfile | null
  quotes: ClientQuote[]
  events: ClientEvent[]
  favorites: ClientFavorite[]
}

export function ClientPortal({ user, profile, quotes, events, favorites }: ClientPortalProps) {
  const { locale: language } = useApp()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ClientTab>("overview")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [savingProfile, setSavingProfile] = useState(false)
  const [clientFavorites, setClientFavorites] = useState(favorites)

  const tabs = [
    { id: "overview" as const, label: language === 'es' ? "Mi Perfil" : "My Profile", icon: User },
    { id: "quotes" as const, label: language === 'es' ? "Cotizaciones" : "Quotes", icon: FileText },
    { id: "events" as const, label: language === 'es' ? "Eventos" : "Events", icon: Calendar },
    { id: "favorites" as const, label: language === 'es' ? "Favoritos" : "Favorites", icon: Heart },
    { id: "chat" as const, label: language === 'es' ? "Asesor AI" : "AI Advisor", icon: MessageSquare },
  ]

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    await updateUserProfile({ full_name: fullName, phone })
    setSavingProfile(false)
    setEditingProfile(false)
    router.refresh()
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    setClientFavorites(prev => prev.filter(f => f.id !== favoriteId))
    await removeFavorite(favoriteId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'confirmado':
        return 'bg-emerald-500/10 text-emerald-400'
      case 'pending':
      case 'upcoming':
        return 'bg-amber-500/10 text-amber-400'
      case 'draft':
        return 'bg-blue-500/10 text-blue-400'
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-secondary text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { es: string; en: string }> = {
      draft: { es: 'Borrador', en: 'Draft' },
      pending: { es: 'Pendiente', en: 'Pending' },
      approved: { es: 'Aprobada', en: 'Approved' },
      rejected: { es: 'Rechazada', en: 'Rejected' },
      upcoming: { es: 'Proximo', en: 'Upcoming' },
      in_progress: { es: 'En curso', en: 'In Progress' },
      completed: { es: 'Completado', en: 'Completed' },
      cancelled: { es: 'Cancelado', en: 'Cancelled' },
    }
    return labels[status]?.[language] || status
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const t = {
    es: {
      portal: "Portal del Cliente",
      quickActions: "Acciones rapidas",
      newQuote: "Nueva Cotizacion",
      buildEvent: "Arma tu evento paso a paso",
      viewCatalog: "Ver Catalogo",
      exploreProducts: "Explora productos y servicios",
      myQuotes: "Mis Cotizaciones",
      myEvents: "Mis Eventos",
      noQuotes: "No tienes cotizaciones aun",
      noEvents: "No tienes eventos programados",
      noFavorites: "No tienes favoritos aun",
      saveFavorites: "Guarda tus productos favoritos desde el catalogo",
      exploreCatalog: "Explorar catalogo",
      aiAdvisor: "Asesor AI de Eventos 360",
      aiDesc: "Nuestro asistente inteligente esta disponible en la pagina principal",
      goToAssistant: "Ir al asistente AI",
      logout: "Cerrar Sesion",
      editProfile: "Editar Perfil",
      saveProfile: "Guardar",
      cancel: "Cancelar",
      name: "Nombre",
      phone: "Telefono",
      email: "Correo",
      memberSince: "Miembro desde",
    },
    en: {
      portal: "Client Portal",
      quickActions: "Quick Actions",
      newQuote: "New Quote",
      buildEvent: "Build your event step by step",
      viewCatalog: "View Catalog",
      exploreProducts: "Explore products and services",
      myQuotes: "My Quotes",
      myEvents: "My Events",
      noQuotes: "You don't have any quotes yet",
      noEvents: "You don't have any scheduled events",
      noFavorites: "You don't have any favorites yet",
      saveFavorites: "Save your favorite products from the catalog",
      exploreCatalog: "Explore catalog",
      aiAdvisor: "Eventos 360 AI Advisor",
      aiDesc: "Our intelligent assistant is available on the main page",
      goToAssistant: "Go to AI assistant",
      logout: "Sign Out",
      editProfile: "Edit Profile",
      saveProfile: "Save",
      cancel: "Cancel",
      name: "Name",
      phone: "Phone",
      email: "Email",
      memberSince: "Member since",
    }
  }[language]

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <h1 className="text-lg font-bold text-foreground">
                {t.portal}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              {initials}
            </div>
            <span className="text-sm text-foreground hidden sm:inline">
              {profile?.full_name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Tabs */}
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card/30 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile card */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 lg:col-span-1">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
                  {initials}
                </div>
              </div>
              
              {editingProfile ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">{t.name}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t.phone}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t.saveProfile}
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="mb-1 text-lg font-semibold text-foreground text-center">
                    {profile?.full_name || user.email}
                  </h3>
                  <p className="mb-2 text-xs text-muted-foreground text-center">
                    {user.email}
                  </p>
                  {profile?.phone && (
                    <p className="mb-2 text-xs text-muted-foreground text-center">
                      {profile.phone}
                    </p>
                  )}
                  <p className="mb-4 text-xs text-muted-foreground text-center">
                    {t.memberSince} {formatDate(profile?.created_at || new Date().toISOString())}
                  </p>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary/80"
                  >
                    {t.editProfile}
                  </button>
                </>
              )}
            </div>

            {/* Quick actions */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-foreground">
                {t.quickActions}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/cotizador"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-gold/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <FileText className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {t.newQuote}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.buildEvent}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/catalogo"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-gold/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <Heart className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {t.viewCatalog}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.exploreProducts}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Recent Quote Preview */}
              {quotes.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                    {language === 'es' ? 'Ultima cotizacion' : 'Latest quote'}
                  </h4>
                  <div className="rounded-2xl border border-border bg-card/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{quotes[0].event_name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(quotes[0].created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gold">${quotes[0].total.toLocaleString()} MXN</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(quotes[0].status)}`}>
                          {getStatusLabel(quotes[0].status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUOTES */}
        {activeTab === "quotes" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {t.myQuotes}
              </h3>
              <Link
                href="/cotizador"
                className="flex items-center gap-1.5 rounded-full bg-gold/10 px-4 py-2 text-xs font-medium text-gold transition-all hover:bg-gold/20"
              >
                {t.newQuote}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {quotes.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{t.noQuotes}</p>
                <Link href="/cotizador" className="mt-3 inline-block text-sm text-gold hover:text-gold-light">
                  {t.newQuote}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-gold/20"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {quote.event_name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {quote.event_date ? formatDate(quote.event_date) : formatDate(quote.created_at)}
                        </div>
                        {quote.event_type && (
                          <p className="mt-1 text-xs text-muted-foreground">{quote.event_type}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gold">
                          ${quote.total.toLocaleString()} MXN
                        </p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusLabel(quote.status)}
                        </span>
                      </div>
                    </div>
                    {quote.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {quote.items.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground"
                          >
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                        {quote.items.length > 3 && (
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground">
                            +{quote.items.length - 3} {language === 'es' ? 'mas' : 'more'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {t.myEvents}
            </h3>
            
            {events.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{t.noEvents}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-gold/20 bg-card/50 p-5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {event.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.event_date)}
                          {event.event_time && ` - ${event.event_time}`}
                        </div>
                        {event.venue && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {event.venue}
                          </p>
                        )}
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs ${getStatusColor(event.status)} px-2 py-1 rounded-full`}>
                        {event.status === 'upcoming' && <Clock className="h-3 w-3" />}
                        {event.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {getStatusLabel(event.status)}
                      </div>
                    </div>
                    {event.notes && (
                      <p className="text-xs text-muted-foreground">{event.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES */}
        {activeTab === "favorites" && (
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {language === 'es' ? 'Mis Favoritos' : 'My Favorites'}
            </h3>

            {clientFavorites.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <Heart className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h4 className="mb-2 text-base font-semibold text-foreground">
                  {t.noFavorites}
                </h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t.saveFavorites}
                </p>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light"
                >
                  {t.exploreCatalog}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clientFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="rounded-2xl border border-border bg-card/50 p-4 transition-all hover:border-gold/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {language === 'es' ? fav.catalog_item.name_es : fav.catalog_item.name_en}
                        </p>
                        <p className="text-xs text-gold mt-1">
                          ${fav.catalog_item.price.toLocaleString()} MXN
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      href={`/cotizador?item=${fav.catalog_item.id}`}
                      className="mt-3 inline-block text-xs text-gold hover:text-gold-light"
                    >
                      {language === 'es' ? 'Agregar a cotizacion' : 'Add to quote'}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
            </div>
            <h3 className="mb-2 text-base font-semibold text-foreground">
              {t.aiAdvisor}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t.aiDesc}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light"
            >
              {t.goToAssistant}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
