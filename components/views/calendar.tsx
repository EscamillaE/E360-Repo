"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS_ES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

interface CalEvent {
  day: number
  title: string
  status: "confirmed" | "pending" | "quoting"
  client: string
}

const DEMO_EVENTS: CalEvent[] = [
  { day: 12, title: "Boda Premium", status: "confirmed", client: "Garcia & Lopez" },
  { day: 15, title: "Posada Empresa", status: "pending", client: "Grupo SMA" },
  { day: 20, title: "Cumpleanos 360", status: "quoting", client: "Cliente Particular" },
  { day: 5, title: "XV Anos Elegante", status: "confirmed", client: "Familia Ramirez" },
  { day: 28, title: "Evento Corporativo", status: "pending", client: "TechMX" },
]

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-success/15 border-success/30 text-success",
  pending: "bg-warning/15 border-warning/30 text-warning",
  quoting: "bg-gold/15 border-gold/30 text-gold",
}

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-foreground text-balance">Calendario</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">Vista mensual de todos tus eventos.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-bold hover:bg-gold/20 transition-all">
          <Plus className="w-4 h-4" />
          Nuevo evento
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-sans text-lg font-black text-foreground">
          {MONTHS_ES[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS_ES.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {/* Empty slots */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] lg:min-h-[100px] border-b border-r border-border/50 bg-secondary/20" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const eventsForDay = DEMO_EVENTS.filter((e) => e.day === dayNum)
            const isToday = isCurrentMonth && today.getDate() === dayNum

            return (
              <div
                key={dayNum}
                className={cn(
                  "min-h-[80px] lg:min-h-[100px] p-1.5 lg:p-2 border-b border-r border-border/50 hover:bg-accent/30 transition-all cursor-pointer",
                  isToday && "bg-gold/5"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-1",
                  isToday ? "bg-gold text-gold-foreground" : "text-foreground"
                )}>
                  {dayNum}
                </div>
                {eventsForDay.map((event, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md border mb-0.5 truncate",
                      STATUS_STYLES[event.status]
                    )}
                    title={`${event.title} - ${event.client}`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success/40" />
          <span className="text-xs text-muted-foreground font-medium">Confirmado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning/40" />
          <span className="text-xs text-muted-foreground font-medium">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold/40" />
          <span className="text-xs text-muted-foreground font-medium">Cotizacion</span>
        </div>
      </div>
    </div>
  )
}
