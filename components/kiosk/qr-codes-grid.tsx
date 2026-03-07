"use client"

import { useEffect, useRef, useState } from "react"
import { Facebook, Instagram, MessageCircle, Globe, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRItem {
  id: string
  label: string
  labelEn: string
  url: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const QR_ITEMS: QRItem[] = [
  {
    id: "facebook",
    label: "Facebook",
    labelEn: "Facebook",
    url: "https://facebook.com/eventos360mx",
    icon: Facebook,
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/10",
  },
  {
    id: "instagram",
    label: "Instagram",
    labelEn: "Instagram",
    url: "https://instagram.com/eventos360mx",
    icon: Instagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    labelEn: "WhatsApp",
    url: "https://wa.me/524421234567?text=Hola,%20los%20vi%20en%20la%20expo%20y%20me%20interesa%20cotizar%20un%20evento",
    icon: MessageCircle,
    color: "text-[#25D366]",
    bgColor: "bg-[#25D366]/10",
  },
  {
    id: "website",
    label: "Sitio Web",
    labelEn: "Website",
    url: "https://eventos360.com",
    icon: Globe,
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    id: "catalog",
    label: "Catálogo",
    labelEn: "Catalog",
    url: "https://eventos360.com/catalogo",
    icon: BookOpen,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
]

interface QRCodeCardProps {
  item: QRItem
  language: "es" | "en"
}

function QRCodeCard({ item, language }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const Icon = item.icon

  useEffect(() => {
    const loadQR = async () => {
      if (!canvasRef.current) return
      
      try {
        const QRCode = (await import("qrcode")).default
        await QRCode.toCanvas(canvasRef.current, item.url, {
          width: 140,
          margin: 2,
          color: {
            dark: "#FFFFFF",
            light: "#00000000",
          },
          errorCorrectionLevel: "M",
        })
        setIsLoaded(true)
      } catch (error) {
        console.error("QR Code generation failed:", error)
      }
    }
    
    loadQR()
  }, [item.url])

  return (
    <div className="group flex flex-col items-center rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card/80">
      {/* Icon and label */}
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", item.bgColor)}>
        <Icon className={cn("h-5 w-5", item.color)} />
      </div>
      
      <h4 className="mb-2 text-sm font-semibold text-foreground">
        {language === "es" ? item.label : item.labelEn}
      </h4>

      {/* QR Code */}
      <div className="rounded-xl bg-card p-2">
        <canvas 
          ref={canvasRef} 
          className={cn("block transition-opacity", isLoaded ? "opacity-100" : "opacity-0")}
          width={140}
          height={140}
        />
        {!isLoaded && (
          <div className="flex h-[140px] w-[140px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        )}
      </div>

      {/* Scan prompt */}
      <p className="mt-2 text-[10px] text-muted-foreground">
        {language === "es" ? "Escanea para abrir" : "Scan to open"}
      </p>
    </div>
  )
}

interface QRCodesGridProps {
  language?: "es" | "en"
  className?: string
}

export function QRCodesGrid({ language = "es", className }: QRCodesGridProps) {
  return (
    <div className={cn("", className)}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {language === "es" ? "Conéctate con nosotros" : "Connect with us"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {language === "es" 
            ? "Escanea los códigos QR con tu teléfono" 
            : "Scan QR codes with your phone"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
        {QR_ITEMS.map((item) => (
          <QRCodeCard key={item.id} item={item} language={language} />
        ))}
      </div>
    </div>
  )
}
