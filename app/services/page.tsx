"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { SERVICE_DATA, type ServiceType } from "@/components/service-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { E360Logo } from "@/components/e360-logo";
import FloatingLines from "@/components/floating-lines";
import { useI18n } from "@/lib/i18n";

const serviceTranslationKeys: Record<ServiceType, { label: string; desc: string }> = {
  lighting: { label: "service.lighting", desc: "service.lighting.desc" },
  audio: { label: "service.audio", desc: "service.audio.desc" },
  structures: { label: "service.structures", desc: "service.structures.desc" },
  atmosphere: { label: "service.atmosphere", desc: "service.atmosphere.desc" },
  experiences: { label: "service.experiences", desc: "service.experiences.desc" },
  decor: { label: "service.decor", desc: "service.decor.desc" },
  logistics: { label: "service.logistics", desc: "service.logistics.desc" },
}

const serviceDetails: Record<ServiceType, { features: string[] }> = {
  lighting: { features: ["Architectural uplighting", "Moving head spotlights", "LED pixel mapping", "Cinematic scene design"] },
  audio: { features: ["Line array systems", "DJ & live mixing", "Wireless microphones", "Acoustic engineering"] },
  structures: { features: ["Custom stage builds", "Tent & marquee setups", "Rigging & trussing", "Platform systems"] },
  atmosphere: { features: ["Low fog machines", "Haze & cryo effects", "Confetti & streamer cannons", "Pyrotechnic coordination"] },
  experiences: { features: ["360 photo booths", "LED video walls", "Interactive installations", "AR/VR activations"] },
  decor: { features: ["Floral arrangements", "Fabric draping", "Scenic backdrops", "Table & centerpiece design"] },
  logistics: { features: ["Transport coordination", "Generator & power supply", "On-site crew management", "Load-in / load-out scheduling"] },
};

const services = Object.entries(SERVICE_DATA) as [ServiceType, (typeof SERVICE_DATA)[ServiceType]][];

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-dvh w-full bg-background">
      <div className="absolute inset-0 z-0 opacity-40">
        <FloatingLines
          linesGradient={["#A07C2A", "#C4922A", "#D4A843", "#E8C060"]}
          enabledWaves={["bottom", "middle"]}
          lineCount={[3, 4]}
          lineDistance={[8, 5]}
          animationSpeed={0.5}
          interactive={true}
          bendRadius={5.0}
          bendStrength={-0.3}
          mouseDamping={0.05}
          parallax={true}
          parallaxStrength={0.1}
          mixBlendMode="screen"
        />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
          </Link>
          <E360Logo />
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            <span
              style={{
                background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("services.page.title" as never)}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {t("services.page.desc" as never)}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([key, data]) => {
            const Icon = data.icon;
            const details = serviceDetails[key];
            const keys = serviceTranslationKeys[key];
            return (
              <div
                key={key}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-[var(--gold)]/40 hover:bg-card/80"
              >
                <div
                  className="absolute top-0 left-0 h-0.5 w-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, var(--gold-muted), var(--gold), var(--gold-neon))" }}
                />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15">
                    <Icon size={22} className="text-muted-foreground transition-colors group-hover:text-[var(--gold)]" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">{t(keys.label as never)}</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t(keys.desc as never)}</p>
                <ul className="space-y-2">
                  {details.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full pl-5 pr-3 text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors"
          >
            <Link href="/configure">
              <span>{t("services.page.cta" as never)}</span>
              <ChevronRight className="ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-full px-5 text-base text-foreground bg-card/40 hover:bg-card/70 border border-border/50"
          >
            <Link href="/">
              <span>{t("services.page.back" as never)}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
