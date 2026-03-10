import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Eventos 360 - Kiosk | Expo Querétaro 2026",
  description:
    "Modo kiosk interactivo con asistente de voz Luna. Explora nuestros servicios de producción de eventos en el Centro de Negocios de Querétaro.",
  keywords: ["eventos", "kiosk", "360", "queretaro", "expo", "dj", "audio", "iluminacion"],
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="kiosk-container">
      {children}
    </div>
  )
}
