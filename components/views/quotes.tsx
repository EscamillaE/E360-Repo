"use client"

import { useState } from "react"
import { Plus, Send, Trash2, FileText, Minus } from "lucide-react"
import { cn, currencyMXN } from "@/lib/utils"

interface LineItem {
  sku: string
  name: string
  qty: number
  unitPrice: number
}

const DEMO_LINE_ITEMS: LineItem[] = [
  { sku: "PKG-LUX-009", name: "Luxury", qty: 1, unitPrice: 30800 },
  { sku: "FX-FIRE-001", name: "Maquina de fuego", qty: 2, unitPrice: 990 },
  { sku: "CH-CRS-004", name: "Crossback", qty: 120, unitPrice: 82.5 },
  { sku: "FL-PIX-011", name: "Pista Pixeles 5x5", qty: 1, unitPrice: 9350 },
]

const DEMO_CONTACTS = [
  { id: "c1", name: "Garcia & Lopez", type: "cliente" },
  { id: "c2", name: "Grupo SMA", type: "prospecto" },
  { id: "c3", name: "Familia Ramirez", type: "cliente" },
]

export function QuotesView() {
  const [lineItems, setLineItems] = useState<LineItem[]>(DEMO_LINE_ITEMS)
  const [clientId, setClientId] = useState("c1")
  const [eventDate, setEventDate] = useState("2026-03-15")
  const [location, setLocation] = useState("Hacienda Los Olivos, Queretaro")
  const [notes, setNotes] = useState("")

  const subtotal = lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva
  const deposit = total * 0.5
  const balance = total - deposit

  function updateQty(sku: string, delta: number) {
    setLineItems((prev) =>
      prev.map((li) =>
        li.sku === sku ? { ...li, qty: Math.max(0, li.qty + delta) } : li
      ).filter((li) => li.qty > 0)
    )
  }

  function removeItem(sku: string) {
    setLineItems((prev) => prev.filter((li) => li.sku !== sku))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-foreground text-balance">Cotizaciones</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">Arma tu cotizacion y envia por WhatsApp.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-bold hover:bg-gold/20 transition-all">
          <Plus className="w-4 h-4" />
          Nueva cotizacion
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Quote details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-sans text-sm font-bold text-foreground mb-4">Detalles del evento</h3>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Cliente</span>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  <option value="">-- Seleccionar --</option>
                  {DEMO_CONTACTS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Fecha</span>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Lugar</span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Venue o direccion"
                    className="px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Notas</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Notas adicionales..."
                  className="px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </label>
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-sans text-sm font-bold text-foreground mb-3">Resumen</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Subtotal", value: subtotal },
                { label: "IVA (16%)", value: iva },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-bold text-foreground">{currencyMXN(row.value)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-black text-lg text-foreground">{currencyMXN(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Anticipo (50%)</span>
                <span className="font-bold text-gold">{currencyMXN(deposit)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo</span>
                <span className="font-bold text-foreground">{currencyMXN(balance)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-gold-foreground text-sm font-bold hover:opacity-90 transition-all">
                <Send className="w-4 h-4" />
                WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-bold hover:bg-accent hover:text-foreground transition-all">
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right: Line items */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-bold text-foreground">Items ({lineItems.length})</h3>
            <span className="text-xs font-bold text-muted-foreground">
              {lineItems.reduce((s, li) => s + li.qty, 0)} unidades
            </span>
          </div>

          {lineItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
              Sin items. Ve a Catalogo y agrega productos.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {lineItems.map((li) => (
                <div
                  key={li.sku}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-sm font-bold text-foreground truncate">{li.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{li.sku} &middot; {currencyMXN(li.unitPrice)} c/u</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQty(li.sku, -1)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-border text-foreground hover:bg-accent transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-sans text-sm font-bold min-w-[28px] text-center text-foreground">{li.qty}</span>
                    <button
                      onClick={() => updateQty(li.sku, 1)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="font-sans text-sm font-black text-foreground min-w-[80px] text-right shrink-0">
                    {currencyMXN(li.qty * li.unitPrice)}
                  </div>

                  <button
                    onClick={() => removeItem(li.sku)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
