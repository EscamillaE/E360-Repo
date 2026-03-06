import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppProvider } from "@/components/providers"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Eventos 360 | Produccion Integral de Eventos",
    template: "%s | Eventos 360",
  },
  description:
    "Cabina 360, audio profesional, iluminacion, efectos especiales y todo para crear eventos inolvidables en Queretaro.",
  keywords: [
    "eventos",
    "produccion de eventos",
    "cabina 360",
    "bodas",
    "XV anos",
    "fiestas",
    "Queretaro",
    "audio profesional",
    "iluminacion",
    "DJ",
  ],
  authors: [{ name: "Eventos 360" }],
  creator: "Eventos 360",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Eventos 360",
    title: "Eventos 360 | Produccion Integral de Eventos",
    description:
      "Cabina 360, audio profesional, iluminacion, efectos especiales y todo para crear eventos inolvidables en Queretaro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventos 360 | Produccion Integral de Eventos",
    description:
      "Cabina 360, audio profesional, iluminacion, efectos especiales y todo para crear eventos inolvidables en Queretaro.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
