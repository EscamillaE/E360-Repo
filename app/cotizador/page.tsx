import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { QuoteCalculator } from "@/components/quote-calculator"

export default function CotizadorPage() {
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
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={32}
              height={32}
              className="rounded-full"
            />
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

        <QuoteCalculator />
      </div>
    </div>
  )
}
