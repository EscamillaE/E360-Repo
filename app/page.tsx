"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { VideoShowcase } from "@/components/video-showcase"
import { PortalCards } from "@/components/portal-cards"
import { QuotePreview } from "@/components/quote-preview"
import { Footer } from "@/components/footer"
import { AiAssistant } from "@/components/ai-assistant"

export default function HomePage() {
  const [isLunaOpen, setIsLunaOpen] = useState(false)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Navigation with Luna orb */}
      <Navbar onLunaClick={() => setIsLunaOpen(true)} />

      {/* Hero with particles */}
      <HeroSection />

      {/* Services */}
      <div id="servicios">
        <ServicesSection />
      </div>

      {/* Portal Cards */}
      <PortalCards />

      {/* Video Gallery */}
      <div id="galeria">
        <VideoShowcase />
      </div>

      {/* Quote Preview */}
      <QuotePreview />

      {/* Footer with Contact */}
      <div id="contacto">
        <Footer />
      </div>

      {/* AI Assistant - Luna */}
      <AiAssistant isOpen={isLunaOpen} onOpenChange={setIsLunaOpen} />
    </main>
  )
}
