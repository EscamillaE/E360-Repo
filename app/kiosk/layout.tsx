import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Eventos 360 - Kiosk | Expo Queretaro 2026",
  description:
    "Modo kiosk para la expo en el Centro de Negocios de Queretaro. Explora nuestros servicios de produccion de eventos.",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
