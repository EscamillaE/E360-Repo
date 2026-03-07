"use client"

import { QrCode, Facebook, Instagram, MessageCircle, Globe, ShoppingBag } from "lucide-react"
import { useEffect, useRef } from "react"

interface QRCodeItemProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  url: string
  color: string
}

function QRCodeItem({ title, subtitle, icon, url, color }: QRCodeItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Generate a simple QR-like pattern (for display purposes)
    const size = 120
    const moduleSize = 4
    const modules = Math.floor(size / moduleSize)
    
    canvas.width = size
    canvas.height = size

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate deterministic pattern based on URL
    const seed = url.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    
    ctx.fillStyle = "#000000"
    
    // Position detection patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer black square
      ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
      // Inner white square
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
      // Inner black square
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(size - 7 * moduleSize, 0)
    drawFinderPattern(0, size - 7 * moduleSize)

    // Random data modules
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Skip finder pattern areas
        if ((i < 8 && j < 8) || (i < 8 && j > modules - 9) || (i > modules - 9 && j < 8)) {
          continue
        }
        
        const hash = (seed * (i + 1) * (j + 1)) % 100
        if (hash < 45) {
          ctx.fillStyle = "#000000"
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [url])

  return (
    <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-card/80">
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      
      <canvas
        ref={canvasRef}
        className="rounded-lg border-2 border-white shadow-lg"
        style={{ width: 120, height: 120 }}
      />
      
      <div className="text-center">
        <h4 className="text-lg font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

interface QRCodesGridProps {
  layout?: "grid" | "row" | "column"
}

export function QRCodesGrid({ layout = "grid" }: QRCodesGridProps) {
  const qrCodes: QRCodeItemProps[] = [
    {
      title: "Facebook",
      subtitle: "@eventos360mx",
      icon: <Facebook className="h-7 w-7 text-white" />,
      url: "https://facebook.com/eventos360mx",
      color: "bg-[#1877F2]",
    },
    {
      title: "Instagram",
      subtitle: "@eventos360mx",
      icon: <Instagram className="h-7 w-7 text-white" />,
      url: "https://instagram.com/eventos360mx",
      color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    },
    {
      title: "WhatsApp",
      subtitle: "442-795-3753",
      icon: <MessageCircle className="h-7 w-7 text-white" />,
      url: "https://wa.me/5214427953753?text=Hola%2C%20los%20vi%20en%20la%20expo",
      color: "bg-[#25D366]",
    },
    {
      title: "Sitio Web",
      subtitle: "eventos360.com",
      icon: <Globe className="h-7 w-7 text-white" />,
      url: "https://eventos360.com",
      color: "bg-gold",
    },
    {
      title: "Catalogo",
      subtitle: "Ver productos",
      icon: <ShoppingBag className="h-7 w-7 text-white" />,
      url: "https://eventos360.com/catalogo",
      color: "bg-neon-orange",
    },
  ]

  const layoutClasses = {
    grid: "grid grid-cols-2 lg:grid-cols-3 gap-4",
    row: "flex flex-wrap justify-center gap-4",
    column: "flex flex-col gap-4",
  }

  return (
    <div className={layoutClasses[layout]}>
      {qrCodes.map((qr) => (
        <QRCodeItem key={qr.title} {...qr} />
      ))}
    </div>
  )
}

export function QRCodesSidebar() {
  return (
    <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-xl">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-1">Conecta con nosotros</h3>
        <p className="text-sm text-muted-foreground">Escanea para seguirnos</p>
      </div>
      <QRCodesGrid layout="column" />
    </div>
  )
}
