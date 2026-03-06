"use client"

import { useState, useEffect } from "react"
import { Calculator, Plus, Minus, Send, Save, Loader2, CheckCircle } from "lucide-react"
import { useLanguage } from "@/components/providers"
import { createClient } from "@/lib/supabase/client"
import { createQuote } from "@/lib/actions/quotes"
import type { CatalogItem } from "@/lib/actions/catalog"
import Link from "next/link"

interface QuoteLineItem {
  id: string
  catalog_item_id: string | null
  name: string
  price: number
  quantity: number
}

interface QuoteCalculatorProps {
  initialItems?: CatalogItem[]
  preselectedItemId?: string
}

export function QuoteCalculator({ initialItems = [], preselectedItemId }: QuoteCalculatorProps) {
  const { language } = useLanguage()
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(initialItems)
  const [selectedItems, setSelectedItems] = useState<QuoteLineItem[]>([])
  const [eventName, setEventName] = useState("")
  const [eventType, setEventType] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)

  // Fetch catalog items and user
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Fetch catalog items if not provided
      if (initialItems.length === 0) {
        const { data: items } = await supabase
          .from('catalog_items')
          .select('*')
          .eq('is_active', true)
          .order('name_es', { ascending: true })
        
        if (items) {
          setCatalogItems(items)
          
          // Pre-select item if provided
          if (preselectedItemId) {
            const item = items.find(i => i.id === preselectedItemId)
            if (item) {
              addItem(item)
            }
          }
        }
      }
      
      setIsLoading(false)
    }
    
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = (item: CatalogItem) => {
    const name = language === 'es' ? item.name_es : item.name_en
    const existing = selectedItems.find((i) => i.id === item.id)
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      )
    } else {
      setSelectedItems([
        ...selectedItems,
        { 
          id: item.id, 
          catalog_item_id: item.id,
          name, 
          price: Number(item.price), 
          quantity: 1 
        },
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

  const filteredItems = searchTerm.trim()
    ? catalogItems.filter((item) => {
        const name = language === 'es' ? item.name_es : item.name_en
        const desc = language === 'es' ? item.description_es : item.description_en
        const query = searchTerm.toLowerCase()
        return name.toLowerCase().includes(query) || desc?.toLowerCase().includes(query)
      })
    : catalogItems

  const handleSaveQuote = async () => {
    if (!user) {
      setSaveError(language === 'es' ? 'Inicia sesion para guardar' : 'Login to save')
      return
    }
    
    if (selectedItems.length === 0) return
    
    setIsSaving(true)
    setSaveError(null)
    
    const result = await createQuote({
      event_name: eventName || (language === 'es' ? 'Mi Evento' : 'My Event'),
      event_date: eventDate || null,
      event_type: eventType || null,
      items: selectedItems.map(item => ({
        catalog_item_id: item.catalog_item_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }))
    })
    
    setIsSaving(false)
    
    if (result.success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      setSaveError(result.error || 'Error')
    }
  }

  const whatsappMessage = `${language === 'es' ? 'Hola, me interesa cotizar un evento' : 'Hi, I am interested in quoting an event'}:\n\n${language === 'es' ? 'Nombre' : 'Name'}: ${eventName || (language === 'es' ? 'No especificado' : 'Not specified')}\n${language === 'es' ? 'Tipo' : 'Type'}: ${eventType || (language === 'es' ? 'No especificado' : 'Not specified')}\n${language === 'es' ? 'Fecha' : 'Date'}: ${eventDate || (language === 'es' ? 'Por definir' : 'TBD')}\n\n${language === 'es' ? 'Servicios seleccionados' : 'Selected services'}:\n${selectedItems.map((item) => `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toLocaleString()} MXN)`).join("\n")}\n\nTotal: $${total.toLocaleString()} MXN`

  const t = {
    es: {
      selectServices: "Selecciona servicios",
      eventName: "Nombre del evento",
      eventNamePlaceholder: "Mi Boda, XV Anos, etc.",
      eventType: "Tipo de evento",
      selectType: "Selecciona",
      eventDate: "Fecha del evento",
      search: "Buscar servicio...",
      yourQuote: "Tu Cotizacion",
      selectToStart: "Selecciona servicios para comenzar",
      estimatedTotal: "Total estimado:",
      saveQuote: "Guardar Cotizacion",
      saved: "Guardado!",
      sendWhatsApp: "Enviar por WhatsApp",
      loginToSave: "Inicia sesion para guardar cotizaciones",
      login: "Iniciar Sesion",
      types: {
        boda: "Boda",
        xv: "XV Anos",
        social: "Evento Social",
        corp: "Corporativo",
        grad: "Graduacion",
        otro: "Otro"
      }
    },
    en: {
      selectServices: "Select services",
      eventName: "Event name",
      eventNamePlaceholder: "My Wedding, Sweet 16, etc.",
      eventType: "Event type",
      selectType: "Select",
      eventDate: "Event date",
      search: "Search service...",
      yourQuote: "Your Quote",
      selectToStart: "Select services to start",
      estimatedTotal: "Estimated total:",
      saveQuote: "Save Quote",
      saved: "Saved!",
      sendWhatsApp: "Send via WhatsApp",
      loginToSave: "Login to save quotes",
      login: "Login",
      types: {
        boda: "Wedding",
        xv: "Sweet 16",
        social: "Social Event",
        corp: "Corporate",
        grad: "Graduation",
        otro: "Other"
      }
    }
  }[language]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Service selector */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Calculator className="h-4 w-4 text-gold" />
              {t.selectServices}
            </h3>

            {/* Event info */}
            <div className="mb-4 grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t.eventName}
                </label>
                <input
                  type="text"
                  placeholder={t.eventNamePlaceholder}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t.eventType}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  >
                    <option value="">{t.selectType}</option>
                    <option value="Boda">{t.types.boda}</option>
                    <option value="XV Anos">{t.types.xv}</option>
                    <option value="Evento Social">{t.types.social}</option>
                    <option value="Corporativo">{t.types.corp}</option>
                    <option value="Graduacion">{t.types.grad}</option>
                    <option value="Otro">{t.types.otro}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t.eventDate}
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
            />

            {/* Services list */}
            <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const selected = selectedItems.find((i) => i.id === item.id)
                const name = language === 'es' ? item.name_es : item.name_en
                return (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      selected
                        ? "border border-gold/30 bg-gold/10 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span className="flex-1 truncate">{name}</span>
                    <span className="ml-2 shrink-0 text-xs font-medium text-gold">
                      ${Number(item.price).toLocaleString()} MXN
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
              {t.yourQuote}
            </h3>

            {selectedItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t.selectToStart}
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${(item.price * item.quantity).toLocaleString()} MXN
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
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
                  {t.estimatedTotal}
                </span>
                <span className="text-xl font-bold text-gold">
                  ${total.toLocaleString()} MXN
                </span>
              </div>
            </div>

            {/* Save Quote Button */}
            {user ? (
              <button
                onClick={handleSaveQuote}
                disabled={selectedItems.length === 0 || isSaving}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                  selectedItems.length > 0 && !isSaving
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "cursor-not-allowed bg-secondary/50 text-muted-foreground"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {t.saved}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t.saveQuote}
                  </>
                )}
              </button>
            ) : (
              <div className="mt-4 rounded-lg bg-secondary/30 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-2">{t.loginToSave}</p>
                <Link
                  href="/auth/login?redirectTo=/cotizador"
                  className="text-xs font-medium text-gold hover:text-gold-light"
                >
                  {t.login}
                </Link>
              </div>
            )}
            
            {saveError && (
              <p className="mt-2 text-center text-xs text-destructive">{saveError}</p>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                selectedItems.length > 0
                  ? "bg-gold text-primary-foreground hover:bg-gold-light"
                  : "cursor-not-allowed bg-secondary text-muted-foreground"
              }`}
              onClick={(e) => {
                if (selectedItems.length === 0) e.preventDefault()
              }}
            >
              <Send className="h-4 w-4" />
              {t.sendWhatsApp}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
