"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { SERVICE_DATA, type ServiceType } from "@/components/service-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { E360Logo } from "@/components/e360-logo";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type LocationType = "indoor" | "outdoor" | "hybrid";

type ServiceConfig = {
  enabled: boolean;
  tier: string;
};

type EventConfig = {
  eventName: string;
  eventDate: string;
  locationType: LocationType;
  estimatedGuests: number;
  services: Record<ServiceType, ServiceConfig>;
};

const defaultServices: Record<ServiceType, ServiceConfig> = {
  lighting: { enabled: false, tier: "Basic" },
  audio: { enabled: false, tier: "Basic" },
  structures: { enabled: false, tier: "Basic" },
  atmosphere: { enabled: false, tier: "Basic" },
  experiences: { enabled: false, tier: "Basic" },
  decor: { enabled: false, tier: "Basic" },
  logistics: { enabled: false, tier: "Basic" },
};

const serviceTranslationKeys: Record<ServiceType, { label: string; desc: string }> = {
  lighting: { label: "service.lighting", desc: "service.lighting.desc" },
  audio: { label: "service.audio", desc: "service.audio.desc" },
  structures: { label: "service.structures", desc: "service.structures.desc" },
  atmosphere: { label: "service.atmosphere", desc: "service.atmosphere.desc" },
  experiences: { label: "service.experiences", desc: "service.experiences.desc" },
  decor: { label: "service.decor", desc: "service.decor.desc" },
  logistics: { label: "service.logistics", desc: "service.logistics.desc" },
};

export default function ConfigurePage() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [config, setConfig] = useState<EventConfig>({
    eventName: "",
    eventDate: "",
    locationType: "indoor",
    estimatedGuests: 100,
    services: { ...defaultServices },
  });

  const steps = [
    { id: 0, label: t("config.step.details" as never) },
    { id: 1, label: t("config.step.services" as never) },
    { id: 2, label: t("config.step.configure" as never) },
    { id: 3, label: t("config.step.review" as never) },
  ];

  const tiers = [
    { key: "Basic", label: t("config.tier.basic" as never) },
    { key: "Premium", label: t("config.tier.premium" as never) },
    { key: "Cinematic", label: t("config.tier.cinematic" as never) },
  ];

  const locationOptions: { key: LocationType; label: string }[] = [
    { key: "indoor", label: t("config.indoor" as never) },
    { key: "outdoor", label: t("config.outdoor" as never) },
    { key: "hybrid", label: t("config.hybrid" as never) },
  ];

  const enabledServices = Object.entries(config.services).filter(
    ([, v]) => v.enabled
  ) as [ServiceType, ServiceConfig][];

  const canProceed = () => {
    if (step === 0) return config.eventName.trim() !== "" && config.eventDate !== "";
    if (step === 1) return enabledServices.length > 0;
    return true;
  };

  const toggleService = (key: ServiceType) => {
    setConfig((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], enabled: !prev.services[key].enabled },
      },
    }));
  };

  const setTier = (key: ServiceType, tier: string) => {
    setConfig((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], tier },
      },
    }));
  };

  const showOutdoorSuggestion =
    (config.locationType === "outdoor" || config.locationType === "hybrid") &&
    !config.services.logistics.enabled;

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))" }}
          >
            <Check size={32} className="text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            {t("config.submitted.title" as never)}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground leading-relaxed">
            {t("config.submitted.desc" as never)}
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild variant="ghost" className="rounded-full border border-border/50">
              <Link href="/">{t("config.submitted.back" as never)}</Link>
            </Button>
            <Button
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setConfig({ eventName: "", eventDate: "", locationType: "indoor", estimatedGuests: 100, services: { ...defaultServices } });
              }}
              className="rounded-full text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))" }}
            >
              {t("config.submitted.another" as never)}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      {/* Step Indicator */}
      <div className="mx-auto w-full max-w-3xl px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                i <= step ? "text-foreground cursor-pointer" : "text-muted-foreground/50 cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                  i < step ? "text-primary-foreground" : i === step ? "border-2 text-foreground" : "border border-border text-muted-foreground/50"
                )}
                style={
                  i < step
                    ? { background: "linear-gradient(135deg, var(--gold-deep), var(--gold))" }
                    : i === step ? { borderColor: "var(--gold)" } : undefined
                }
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">{t("config.details.title" as never)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("config.details.desc" as never)}</p>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="event-name" className="mb-1.5 block text-sm font-medium text-foreground">{t("config.details.name" as never)}</label>
                <input
                  id="event-name"
                  type="text"
                  placeholder={t("config.details.name.placeholder" as never)}
                  value={config.eventName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, eventName: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-input bg-card px-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-2 focus:outline-ring"
                />
              </div>
              <div>
                <label htmlFor="event-date" className="mb-1.5 block text-sm font-medium text-foreground">{t("config.details.date" as never)}</label>
                <input
                  id="event-date"
                  type="date"
                  value={config.eventDate}
                  onChange={(e) => setConfig((prev) => ({ ...prev, eventDate: e.target.value }))}
                  className="h-11 w-full rounded-lg border border-input bg-card px-4 text-foreground focus:outline-2 focus:outline-ring"
                />
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-foreground">{t("config.details.location" as never)}</legend>
                <div className="flex flex-wrap gap-2">
                  {locationOptions.map((loc) => (
                    <button
                      key={loc.key}
                      onClick={() => setConfig((prev) => ({ ...prev, locationType: loc.key }))}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        config.locationType === loc.key
                          ? "border-[var(--gold)] text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                      style={config.locationType === loc.key ? { background: "color-mix(in srgb, var(--gold) 15%, transparent)" } : undefined}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="guests-range" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("config.details.guests" as never)}:{" "}
                  <span style={{ color: "var(--gold)" }}>{config.estimatedGuests}</span>
                </label>
                <input
                  id="guests-range"
                  type="range"
                  min={20}
                  max={2000}
                  step={10}
                  value={config.estimatedGuests}
                  onChange={(e) => setConfig((prev) => ({ ...prev, estimatedGuests: Number(e.target.value) }))}
                  className="w-full accent-[var(--gold)]"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>20</span>
                  <span>2,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">{t("config.services.title" as never)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("config.services.desc" as never)}</p>
            </div>

            {showOutdoorSuggestion && (
              <div className="flex items-start gap-3 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-4">
                <AlertTriangle size={18} style={{ color: "var(--gold)" }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("config.services.outdoor" as never)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("config.services.outdoor.desc" as never)}</p>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.entries(SERVICE_DATA) as [ServiceType, (typeof SERVICE_DATA)[ServiceType]][]).map(([key, data]) => {
                const Icon = data.icon;
                const isEnabled = config.services[key].enabled;
                const keys = serviceTranslationKeys[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleService(key)}
                    className={cn(
                      "relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      isEnabled
                        ? "border-[var(--gold)]/50 bg-[var(--gold)]/8"
                        : "border-border/50 bg-card/50 hover:border-border hover:bg-card/80"
                    )}
                  >
                    <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors", isEnabled ? "bg-[var(--gold)]/20" : "bg-accent/15")}>
                      <Icon size={20} className={cn("transition-colors", isEnabled ? "text-[var(--gold)]" : "text-muted-foreground")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={cn("block text-sm font-semibold", isEnabled ? "text-foreground" : "text-foreground/80")}>{t(keys.label as never)}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground leading-relaxed">{t(keys.desc as never)}</span>
                    </div>
                    {isEnabled && (
                      <div
                        className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full text-primary-foreground"
                        style={{ background: "linear-gradient(135deg, var(--gold-deep), var(--gold))" }}
                      >
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">{t("config.configure.title" as never)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("config.configure.desc" as never)}</p>
            </div>
            <div className="space-y-4">
              {enabledServices.map(([key, svc]) => {
                const data = SERVICE_DATA[key];
                const Icon = data.icon;
                const keys = serviceTranslationKeys[key];
                return (
                  <div key={key} className="rounded-xl border border-border/50 bg-card/60 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
                        <Icon size={18} style={{ color: "var(--gold)" }} />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">{t(keys.label as never)}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tiers.map((tier) => (
                        <button
                          key={tier.key}
                          onClick={() => setTier(key, tier.key)}
                          className={cn(
                            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                            svc.tier === tier.key
                              ? "border-[var(--gold)] text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                          style={svc.tier === tier.key ? { background: "color-mix(in srgb, var(--gold) 15%, transparent)" } : undefined}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">{t("config.review.title" as never)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("config.review.desc" as never)}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-card/60 p-5">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("config.review.info" as never)}</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("config.review.name" as never)}</dt><dd className="font-medium text-foreground">{config.eventName}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("config.review.date" as never)}</dt><dd className="font-medium text-foreground">{config.eventDate}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("config.review.location" as never)}</dt><dd className="font-medium text-foreground capitalize">{config.locationType}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("config.review.guests" as never)}</dt><dd className="font-medium text-foreground">{config.estimatedGuests}</dd></div>
                </dl>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/60 p-5">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("config.review.services" as never)} ({enabledServices.length})</h3>
                <div className="space-y-2">
                  {enabledServices.map(([key, svc]) => {
                    const data = SERVICE_DATA[key];
                    const Icon = data.icon;
                    const keys = serviceTranslationKeys[key];
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon size={16} style={{ color: "var(--gold)" }} />
                          <span className="text-foreground">{t(keys.label as never)}</span>
                        </div>
                        <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{svc.tier}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 border-t border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : undefined)}
            disabled={step === 0}
            className="gap-1 rounded-full"
          >
            <ArrowLeft size={16} />
            {t("config.btn.back" as never)}
          </Button>

          <span className="text-xs text-muted-foreground">
            {enabledServices.length > 0
              ? `${enabledServices.length} ${t("config.selected" as never)}`
              : t("config.noservices" as never)}
          </span>

          {step < 3 ? (
            <Button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className="gap-1 rounded-full text-primary-foreground"
              style={{
                background: canProceed()
                  ? "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))"
                  : undefined,
              }}
            >
              {t("config.btn.next" as never)}
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={() => setSubmitted(true)}
              className="gap-1 rounded-full text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--gold-deep), var(--gold), var(--gold-neon))" }}
            >
              {t("config.btn.submit" as never)}
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={t("config.submitted.back" as never)}
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
  );
}
