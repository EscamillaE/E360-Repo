import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { QuoteCalculator } from "@/components/quote-calculator"
import { getCatalogItems } from "@/lib/actions/catalog"

export default async function CotizadorPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>
}) {
  const params = await searchParams
  const items = await getCatalogItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Inicio</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              Cotizador de Eventos
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Calcula tu Cotizacion
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Arma tu evento perfecto
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
            Selecciona los servicios que necesitas y obtendras un estimado al
            instante. Todos los precios en pesos mexicanos (MXN).
          </p>
        </div>

        <QuoteCalculator initialItems={items} preselectedItemId={params.item} />
      </div>
    </div>
  )
}
