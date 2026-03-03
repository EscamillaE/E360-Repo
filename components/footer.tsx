import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Contact CTA */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Contacto
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Listo para llevar tu evento al siguiente nivel?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
            Cuentanos la fecha y el tipo de evento, y nosotros nos encargamos
            del resto. Cotizacion rapida por WhatsApp.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
            >
              Enviar WhatsApp
            </a>
            <a
              href="mailto:contacto@eventos360.com"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card"
            >
              contacto@eventos360.com
            </a>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={64}
            height={64}
            className="mb-4"
          />
          <h3 className="mb-2 text-lg font-bold text-foreground">
            EVENTOS <span className="text-gold">360</span>
          </h3>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Produccion integral de eventos en Queretaro. DJ, audio,
            iluminacion, efectos especiales, cabinas fotograficas, shows y todo
            lo que necesitas para crear experiencias inolvidables.
          </p>

          <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/catalogo"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Catalogo
            </Link>
            <Link
              href="/cotizador"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Cotizador
            </Link>
            <Link
              href="/cliente"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Portal Cliente
            </Link>
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            <Link
              href="/kiosk"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Modo Kiosk
            </Link>
          </div>

          <div className="w-full border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              {"2026 EVENTOS 360 Queretaro. Todos los derechos reservados."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
