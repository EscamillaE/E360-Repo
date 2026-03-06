"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  FileText,
  Calendar,
  MessageSquare,
  Heart,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Loader2,
  LogOut,
  LogIn,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type ClientTab = "overview" | "quotes" | "events" | "favorites" | "chat"

interface Quote {
  id: string
  quote_number: string
  event_type: string
  event_date: string | null
  venue: string | null
  items: unknown[]
  total: number
  status: string
  created_at: string
}

interface Event {
  id: string
  name: string
  event_date: string
  venue: string | null
  status: string
}

interface Profile {
  id: string
  email: string
  name: string
  role: string
}

const tabs = [
  { id: "overview" as const, label: "Mi Perfil", icon: User },
  { id: "quotes" as const, label: "Mis Cotizaciones", icon: FileText },
  { id: "events" as const, label: "Mis Eventos", icon: Calendar },
  { id: "favorites" as const, label: "Favoritos", icon: Heart },
  { id: "chat" as const, label: "Asesor AI", icon: MessageSquare },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pendiente: "bg-amber-500/10 text-amber-400",
    aprobada: "bg-emerald-500/10 text-emerald-400",
    "en revision": "bg-blue-500/10 text-blue-400",
    rechazada: "bg-red-500/10 text-red-400",
    completada: "bg-emerald-500/10 text-emerald-400",
    confirmado: "bg-emerald-500/10 text-emerald-400",
    "en progreso": "bg-blue-500/10 text-blue-400",
    cancelado: "bg-red-500/10 text-red-400",
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${colors[status] || "bg-secondary text-muted-foreground"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onSuccess()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/cliente`,
            data: {
              full_name: name,
            },
          },
        })
        if (error) throw error
        setSuccess("Revisa tu correo para confirmar tu cuenta")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticacion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {!isLogin && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-medium text-foreground">Nombre</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required={!isLogin}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-foreground">Contrasena</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : isLogin ? (
            "Iniciar Sesion"
          ) : (
            "Crear Cuenta"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
              setSuccess(null)
            }}
            className="text-gold hover:underline"
          >
            {isLogin ? "Registrate" : "Inicia sesion"}
          </button>
        </p>
      </form>
    </div>
  )
}

export default function ClientePage() {
  const [activeTab, setActiveTab] = useState<ClientTab>("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [events, setEvents] = useState<Event[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/cliente")
      if (res.ok) {
        const data = await res.json()
        setIsAuthenticated(data.isAuthenticated)
        setProfile(data.profile)
        setQuotes(data.quotes || [])
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Error fetching client data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setProfile(null)
    setQuotes([])
    setEvents([])
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

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
              <Image
                src="/images/logo.png"
                alt="Eventos 360"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h1 className="text-lg font-bold text-foreground">
                Portal del Cliente
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && profile ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-foreground">{profile.name}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Invitado</span>
            )}
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
            <div className="rounded-2xl border border-border bg-card/50 p-6 text-center lg:col-span-1">
              {isAuthenticated && profile ? (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {profile.name}
                  </h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {profile.email}
                  </p>
                  <div className="flex justify-center gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">{quotes.length}</p>
                      <p className="text-xs text-muted-foreground">Cotizaciones</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{events.length}</p>
                      <p className="text-xs text-muted-foreground">Eventos</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
                      <LogIn className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    Bienvenido
                  </h3>
                  <p className="mb-6 text-xs text-muted-foreground">
                    Inicia sesion para guardar tus cotizaciones y dar seguimiento a
                    tus eventos.
                  </p>
                  <LoginForm onSuccess={fetchData} />
                </>
              )}
            </div>

            {/* Quick actions */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-foreground">
                Acciones rapidas
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
                      Nueva Cotizacion
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Arma tu evento paso a paso
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
                      Ver Catalogo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Explora productos y servicios
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Recent activity */}
              {isAuthenticated && quotes.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-medium text-foreground">Actividad reciente</h4>
                  <div className="space-y-2">
                    {quotes.slice(0, 3).map((quote) => (
                      <div
                        key={quote.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{quote.event_type}</p>
                          <p className="text-xs text-muted-foreground">{quote.quote_number}</p>
                        </div>
                        <StatusBadge status={quote.status} />
                      </div>
                    ))}
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
                Mis Cotizaciones
              </h3>
              <Link
                href="/cotizador"
                className="flex items-center gap-1.5 rounded-full bg-gold/10 px-4 py-2 text-xs font-medium text-gold transition-all hover:bg-gold/20"
              >
                Nueva cotizacion
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {quotes.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <FileText className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Sin cotizaciones
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {isAuthenticated
                    ? "Aun no tienes cotizaciones. Crea tu primera cotizacion para empezar a planear tu evento."
                    : "Inicia sesion para ver tus cotizaciones guardadas."}
                </p>
                <Link
                  href="/cotizador"
                  className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold/80"
                >
                  Crear cotizacion
                  <ChevronRight className="h-3.5 w-3.5" />
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
                          {quote.event_type}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {quote.quote_number}
                        </p>
                        {quote.event_date && (
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(quote.event_date).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        )}
                        {quote.venue && (
                          <p className="mt-1 text-xs text-muted-foreground">{quote.venue}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gold">
                          ${Number(quote.total).toLocaleString()} MXN
                        </p>
                        <div className="mt-1">
                          <StatusBadge status={quote.status} />
                        </div>
                      </div>
                    </div>
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
              Mis Eventos
            </h3>
            {events.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <Calendar className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Sin eventos programados
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated
                    ? "Los eventos confirmados de tus cotizaciones aprobadas apareceran aqui."
                    : "Inicia sesion para ver tus eventos."}
                </p>
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
                          {new Date(event.event_date).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        {event.venue && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {event.venue}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(event.event_date) > new Date() ? "Proximo" : "Pasado"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES */}
        {activeTab === "favorites" && (
          <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Heart className="h-6 w-6 text-gold" />
              </div>
            </div>
            <h3 className="mb-2 text-base font-semibold text-foreground">
              Tus Favoritos
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Guarda tus productos y paquetes favoritos desde el catalogo para
              acceder facilmente al armar tu cotizacion.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold/80"
            >
              Explorar catalogo
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
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
              Asesor AI de Eventos 360
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Nuestro asistente inteligente esta disponible en la pagina
              principal. Preguntale sobre paquetes, precios, disponibilidad y
              armado de cotizaciones.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold/80"
            >
              Ir al asistente AI
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
