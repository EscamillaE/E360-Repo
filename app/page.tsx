"use client";

import FloatingLines from "@/components/floating-lines";
import HeroSection from "@/components/hero-section";
import { HeroHeader } from "@/components/hero-header";
import { ServicesSection } from "@/components/sections/services-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FooterSection } from "@/components/sections/footer-section";
import { useState } from "react";

export default function Home() {
  const [colorPreset, setColorPreset] = useState<string[]>(["#A07C2A", "#C4922A", "#D4A843", "#E8C060"]);

  return (
    <div className="relative min-h-dvh w-full bg-background">
      {/* Animated floating lines -- hero background only */}
      <div className="absolute inset-x-0 top-0 z-0 h-[100vh] pointer-events-none">
        <FloatingLines
          linesGradient={colorPreset}
          enabledWaves={["bottom", "middle", "top"]}
          lineCount={[4, 5, 3]}
          lineDistance={[8, 5, 10]}
          animationSpeed={0.6}
          interactive={true}
          bendRadius={5.0}
          bendStrength={-0.5}
          mouseDamping={0.05}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="screen"
        />
      </div>

      {/* Header navigation */}
      <HeroHeader onColorPresetChange={setColorPreset} />

      {/* Hero section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Subtle divider gradient from hero bg to section bg */}
      <div className="relative z-10 h-24 bg-gradient-to-b from-transparent to-background" />

      {/* Content sections */}
      <div className="relative z-10 bg-background">
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ContactSection />
        <FooterSection />
      </div>
    </div>
  );
}
