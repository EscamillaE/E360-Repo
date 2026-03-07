"use client"

import { useState } from "react"
import { Search, Plus, User, Phone, Mail, Building2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface Contact {
  id: string
  name: string
  type: "cliente" | "prospecto"
  phone?: string
  email?: string
  company?: string
  eventCount: number
}

const DEMO_CONTACTS: Contact[] = [
  { id: "c1", name: "Garcia & Lopez", type: "cliente", phone: "+52 442 123 4567", email: "contacto@garcialopez.com", company: "Garcia & Lopez Eventos", eventCount: 3 },
  { id: "c2", name: "Grupo SMA", type: "prospecto", phone: "+52 442 987 6543", email: "eventos@gruposma.mx", company: "Grupo SMA", eventCount: 0 },
  { id: "c3", name: "Familia Ramirez", type: "cliente", phone: "+52 442 555 1234", email: "ramirez.fam@gmail.com", eventCount: 2 },
  { id: "c4", name: "TechMX Corporativo", type: "prospecto", phone: "+52 55 4321 8765", email: "eventos@techmx.com", company: "TechMX", eventCount: 0 },
  { id: "c5", name: "Ana Martinez", type: "cliente", phone: "+52 442 111 2222", email: "ana.martinez@email.com", eventCount: 1 },
]

const TYPE_STYLES = {
  cliente: "bg-success/15 text-success border-success/30",
  prospecto: "bg-gold/15 text-gold border-gold/30",
}

export function ContactsView() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "cliente" | "prospecto">("all")

  const filteredContacts = DEMO_CONTACTS.filter((c) => {
    const matchSearch = !search || `${c.name} ${c.email || ""} ${c.phone || ""} ${c.company || ""}`.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "all" || c.type === filterType
    return matchSearch && matchType
  })

  const clientCount = DEMO_CONTACTS.filter((c) => c.type === "cliente").length
  const prospectCount = DEMO_CONTACTS.filter((c) => c.type === "prospecto").length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black tracking-tight text-foreground text-balance">Contactos</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Gestiona tus clientes y prospectos.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-bold hover:bg-gold/20 transition-all">
          <Plus className="w-4 h-4" />
          Nuevo contacto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilterType("all")}
          className={cn(
            "rounded-xl border p-4 text-center transition-all hover-lift",
            filterType === "all"
              ? "border-gold/50 bg-gold/10"
              : "border-border bg-card hover:bg-accent/50"
          )}
        >
          <div className="text-2xl font-black text-foreground">{DEMO_CONTACTS.length}</div>
          <div className="text-xs font-semibold text-muted-foreground">Total</div>
        </button>
        <button
          onClick={() => setFilterType("cliente")}
          className={cn(
            "rounded-xl border p-4 text-center transition-all hover-lift",
            filterType === "cliente"
              ? "border-success/50 bg-success/10"
              : "border-border bg-card hover:bg-accent/50"
          )}
        >
          <div className="text-2xl font-black text-success">{clientCount}</div>
          <div className="text-xs font-semibold text-muted-foreground">Clientes</div>
        </button>
        <button
          onClick={() => setFilterType("prospecto")}
          className={cn(
            "rounded-xl border p-4 text-center transition-all hover-lift",
            filterType === "prospecto"
              ? "border-gold/50 bg-gold/10"
              : "border-border bg-card hover:bg-accent/50"
          )}
        >
          <div className="text-2xl font-black text-gold">{prospectCount}</div>
          <div className="text-xs font-semibold text-muted-foreground">Prospectos</div>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o telefono..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Contact list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No se encontraron contactos.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-foreground shrink-0">
                  <User className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-bold text-foreground truncate">{contact.name}</span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", TYPE_STYLES[contact.type])}>
                      {contact.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    {contact.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        {contact.company}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {contact.eventCount > 0 && (
                    <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      {contact.eventCount} evento{contact.eventCount > 1 ? "s" : ""}
                    </span>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
