import Image from "next/image"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Eventos 360"
            width={80}
            height={80}
            className="mb-6"
          />
          <h3 className="mb-3 text-xl font-bold text-foreground">
            EVENTOS <span className="text-gold">360</span>
          </h3>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Produccion integral de eventos. DJ, audio, iluminacion, efectos
            especiales, shows y todo lo que necesitas para crear experiencias
            inolvidables en Mexico.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Inicio
            </a>
            <a
              href="#services"
              className="transition-colors hover:text-foreground"
            >
              Servicios
            </a>
            <a
              href="#gallery"
              className="transition-colors hover:text-foreground"
            >
              Galeria
            </a>
            <a
              href="https://wa.me/?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento%20con%20Eventos%20360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold transition-colors hover:text-gold-light"
            >
              WhatsApp
            </a>
          </div>

          <div className="border-t border-border pt-6 w-full">
            <p className="text-xs text-muted-foreground">
              {"Eventos 360. Todos los derechos reservados."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
