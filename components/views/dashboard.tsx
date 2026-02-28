"use client"

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileQuestion,
  Users,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminTab } from "@/components/admin-shell"

interface DashboardProps {
  onNavigate: (tab: AdminTab) => void
}

const KPI_DATA = [
  { label: "Confirmados", value: 3, icon: CheckCircle2, color: "text-success" },
  { label: "Pendientes", value: 2, icon: Clock, color: "text-warning" },
  { label: "En cotizacion", value: 4, icon: FileQuestion, color: "text-gold" },
  { label: "Prospectos", value: 5, icon: TrendingUp, color: "text-muted-foreground" },
  { label: "Clientes", value: 8, icon: Users, color: "text-foreground" },
]

const QUICK_ACTIONS = [
  { label: "Nueva cotizacion", icon: FileQuestion, tab: "cotizaciones" as AdminTab, primary: true },
  { label: "Ver calendario", icon: CalendarDays, tab: "calendario" as AdminTab, primary: false },
  { label: "Abrir catalogo", icon: ShoppingBag, tab: "catalogo" as AdminTab, primary: false },
  { label: "Contactos", icon: Users, tab: "contactos" as AdminTab, primary: false },
]

const UPCOMING_EVENTS = [
  { title: "Boda Premium", client: "Garcia & Lopez", date: "Mar 15", status: "Confirmado", statusClass: "bg-success/15 text-success" },
  { title: "Posada Empresa", client: "Grupo SMA", date: "Mar 20", status: "Pendiente", statusClass: "bg-warning/15 text-warning" },
  { title: "Cumpleanos 360", client: "Cliente Particular", date: "Mar 25", status: "Cotizacion", statusClass: "bg-gold/15 text-gold" },
]

export function DashboardView({ onNavigate }: DashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-foreground text-balance">Dashboard</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Resumen rapido de tu operacion. Toca un KPI para ver mas detalle.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-gold text-gold-foreground">
            Hoy
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-bold border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
            Esta semana
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="relative rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-all cursor-pointer group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("w-4 h-4", kpi.color)} />
                  <span className="text-xs font-semibold text-muted-foreground">{kpi.label}</span>
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-bold text-foreground">Accesos rapidos</h3>
            <span className="text-xs font-bold text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
              3 eventos
            </span>
          </div>

          <div className="grid gap-2.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.tab)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all",
                    action.primary
                      ? "bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20"
                      : "border border-border text-foreground/80 hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-bold text-foreground">Proximos eventos</h3>
            <button
              onClick={() => onNavigate("calendario")}
              className="text-xs font-bold text-gold hover:underline"
            >
              Ver todos
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {UPCOMING_EVENTS.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-border hover:bg-accent/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold font-sans text-xs font-black shrink-0">
                    {event.date.split(" ")[1]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans text-sm font-bold text-foreground truncate">{event.title}</div>
                    <div className="font-sans text-xs text-muted-foreground">{event.client}</div>
                  </div>
                </div>
                <span className={cn("shrink-0 text-xs font-bold px-2.5 py-1 rounded-full", event.statusClass)}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
