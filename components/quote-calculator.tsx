"use client"

import { useState } from "react"
import { Calculator, Plus, Minus, Send } from "lucide-react"

interface QuoteItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
}

const quotableServices = [
  { id: "cabina-blanca", name: "Cabina Blanca (5 hrs)", price: 4830, unit: "paquete" },
  { id: "magic", name: "Magic (5 hrs)", price: 6820, unit: "paquete" },
  { id: "magic-pixeles", name: "Magic Pixeles (5 hrs)", price: 6820, unit: "paquete" },
  { id: "party-sin", name: "Party sin pantallas (5 hrs)", price: 8140, unit: "paquete" },
  { id: "party-con", name: "Party con pantallas 55\" (5 hrs)", price: 11000, unit: "paquete" },
  { id: "black", name: "Black (5 hrs)", price: 9900, unit: "paquete" },
  { id: "luxury-petite", name: "Luxury Petite (6 hrs)", price: 17600, unit: "paquete" },
  { id: "fancy", name: "Fancy (6 hrs)", price: 17600, unit: "paquete" },
  { id: "luxury", name: "Luxury (6 hrs)", price: 30800, unit: "paquete" },
  { id: "gold-bar", name: "Gold Bar (6 hrs)", price: 36300, unit: "paquete" },
  { id: "sweet-dream", name: "Sweet Dream (7 hrs)", price: 46200, unit: "paquete" },
  { id: "luxury-gold-pp", name: "Luxury Gold (por persona)", price: 1650, unit: "persona" },
  { id: "cabina-360", name: "Cabina 360", price: 6000, unit: "evento" },
  { id: "cabina-180", name: "Cabina 180", price: 5000, unit: "evento" },
  { id: "espejo", name: "Espejo Magico", price: 4500, unit: "evento" },
  { id: "fuego", name: "Maquina de Fuego (30 disparos)", price: 990, unit: "hora" },
  { id: "chispero", name: "Chispero", price: 385, unit: "detonacion" },
  { id: "co2", name: "Maquina CO2 (papel plata)", price: 2200, unit: "hora" },
  { id: "mariposa", name: "Papel Mariposa", price: 660, unit: "extra" },
  { id: "color", name: "Papel de Color", price: 770, unit: "extra" },
  { id: "humo", name: "Maquina de Humo", price: 825, unit: "evento" },
  { id: "laser", name: "Aro Laser", price: 3300, unit: "evento" },
  { id: "robot", name: "Robot LED", price: 2145, unit: "show" },
  { id: "drones", name: "Show de Drones (min. 20)", price: 6000, unit: "figura" },
  { id: "pista-px-4x4", name: "Pista Pixeles 4x4", price: 5500, unit: "evento" },
  { id: "pista-px-6x5", name: "Pista Pixeles 6x5", price: 12100, unit: "evento" },
  { id: "pista-bl-4x4", name: "Pista Blanca 4x4", price: 3960, unit: "evento" },
  { id: "pista-bl-6x5", name: "Pista Blanca 6x5", price: 8800, unit: "evento" },
  { id: "tiffany", name: "Silla Tiffany", price: 38.5, unit: "unidad" },
  { id: "chanel", name: "Silla Chanel", price: 44, unit: "unidad" },
  { id: "crossback", name: "Silla Crossback", price: 82.5, unit: "unidad" },
  { id: "thonik", name: "Silla Thonik", price: 132, unit: "unidad" },
  { id: "sewing", name: "Silla Sewing", price: 154, unit: "unidad" },
  { id: "planta-60", name: "Planta 60 KVA (8 hrs)", price: 10450, unit: "evento" },
  { id: "planta-40", name: "Planta 40 KVA (8 hrs)", price: 7700, unit: "evento" },
  { id: "planta-3000", name: "Planta 3000W (8 hrs)", price: 2750, unit: "evento" },
  { id: "coffee", name: "Coffee Break", price: 90, unit: "persona" },
  { id: "snacks", name: "Snacks", price: 70, unit: "persona" },
  { id: "barra", name: "Barra de Bebidas", price: 3500, unit: "evento" },
  { id: "foto-video", name: "Fotografia & Video", price: 4500, unit: "evento" },
]

export function QuoteCalculator() {
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([])
  const [eventType, setEventType] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const addItem = (service: (typeof quotableServices)[0]) => {
    const existing = selectedItems.find((item) => item.id === service.id)
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: service.id, name: service.name, price: service.price, quantity: 1, unit: service.unit },
      ])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredServices = searchTerm.trim()
    ? quotableServices.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quotableServices

  const whatsappMessage = `Hola, me interesa cotizar un evento:\n\nTipo: ${eventType || "No especificado"}\nFecha: ${eventDate || "Por definir"}\n\nServicios seleccionados:\n${selectedItems.map((item) => `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toLocaleString()} MXN)`).join("\n")}\n\nTotal estimado: $${total.toLocaleString()} MXN`

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Service selector */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Calculator className="h-4 w-4 text-gold" />
              Selecciona servicios
            </h3>

            {/* Event info */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Tipo de evento
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                >
                  <option value="">Selecciona</option>
                  <option value="Boda">Boda</option>
                  <option value="XV Anos">XV Anos</option>
                  <option value="Evento Social">Evento Social</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Graduacion">Graduacion</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
            />

            {/* Services list */}
            <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
              {filteredServices.map((service) => {
                const selected = selectedItems.find((i) => i.id === service.id)
                return (
                  <button
                    key={service.id}
                    onClick={() => addItem(service)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      selected
                        ? "border border-gold/30 bg-gold/10 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span className="flex-1 truncate">{service.name}</span>
                    <span className="ml-2 shrink-0 text-xs font-medium text-gold">
                      ${service.price.toLocaleString()} /{service.unit}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quote summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-gold/20 bg-card/50 p-5 backdrop-blur-sm">
            <h3 className="mb-4 text-base font-semibold text-foreground">
              Tu Cotizacion
            </h3>

            {selectedItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Selecciona servicios para comenzar
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${(item.price * item.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-foreground hover:bg-secondary/80"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-foreground hover:bg-secondary/80"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total estimado:
                </span>
                <span className="text-xl font-bold text-gold">
                  ${total.toLocaleString()} MXN
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                selectedItems.length > 0
                  ? "bg-gold text-primary-foreground hover:bg-gold-light"
                  : "cursor-not-allowed bg-secondary text-muted-foreground"
              }`}
              onClick={(e) => {
                if (selectedItems.length === 0) e.preventDefault()
              }}
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
