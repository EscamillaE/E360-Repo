import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { VideoShowcase } from "@/components/video-showcase"
import { PortalCards } from "@/components/portal-cards"
import { QuotePreview } from "@/components/quote-preview"
import { Footer } from "@/components/footer"
import { AudioParticles } from "@/components/audio-particles"
import { AiAssistant } from "@/components/ai-assistant"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Animated particles background */}
      <AudioParticles />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Services */}
      <ServicesSection />

      {/* Portal Cards */}
      <PortalCards />

      {/* Video Gallery */}
      <div id="galeria">
        <VideoShowcase />
      </div>

      {/* Quote Preview */}
      <QuotePreview />

      {/* Footer with Contact */}
      <Footer />

      {/* AI Assistant */}
      <AiAssistant />
    </main>
  )
}
