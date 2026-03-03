"use client"

import { useState } from "react"
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
} from "lucide-react"

type ClientTab = "overview" | "quotes" | "events" | "favorites" | "chat"

const tabs = [
  { id: "overview" as const, label: "Mi Perfil", icon: User },
  { id: "quotes" as const, label: "Mis Cotizaciones", icon: FileText },
  { id: "events" as const, label: "Mis Eventos", icon: Calendar },
  { id: "favorites" as const, label: "Favoritos", icon: Heart },
  { id: "chat" as const, label: "Asesor AI", icon: MessageSquare },
]

const sampleQuotes = [
  {
    id: "Q-001",
    event: "Boda - Salon Jardin",
    date: "15 de Marzo, 2026",
    status: "aprobada",
    total: "$46,200 MXN",
    items: ["Sweet Dream (7 hrs)", "Robot LED", "Show de Drones"],
  },
  {
    id: "Q-002",
    event: "Fiesta de Cumpleanos",
    date: "22 de Abril, 2026",
    status: "pendiente",
    total: "$17,600 MXN",
    items: ["Luxury Petite (6 hrs)", "Pista Pixeles 4x4"],
  },
]

const sampleEvents = [
  {
    id: "E-001",
    name: "Boda Lopez-Garcia",
    date: "15 de Marzo, 2026",
    venue: "Salon Jardin Real, Queretaro",
    status: "confirmado",
    package: "Sweet Dream",
  },
]

export default function ClientePage() {
  const [activeTab, setActiveTab] = useState<ClientTab>("overview")

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              C
            </div>
            <span className="text-sm text-foreground">Cliente</span>
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
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
                  C
                </div>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">
                Cliente Invitado
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Inicia sesion para guardar tus cotizaciones y dar seguimiento a
                tus eventos.
              </p>
              <button className="w-full rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light">
                Crear Cuenta
              </button>
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

            <div className="space-y-3">
              {sampleQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-gold/20"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {quote.event}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {quote.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gold">
                        {quote.total}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          quote.status === "aprobada"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quote.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Mis Eventos
            </h3>
            <div className="space-y-3">
              {sampleEvents.map((event) => (
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
                        {event.date}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {event.venue}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirmado
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold">
                      Paquete {event.package}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Proximo
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light"
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
              className="inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light"
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
