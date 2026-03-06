"use client"

import { motion } from "motion/react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } }

export function ContactSection() {
  const { t } = useI18n()

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Left: Info */}
          <div className="flex-1">
            <motion.p {...fadeUp} transition={{ duration: 0.5 }} className="text-xs font-semibold tracking-[0.25em] text-[var(--gold)] uppercase">
              {t("contact.label")}
            </motion.p>
            <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.05 }} className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {t("contact.title")}
            </motion.h2>
            <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mt-5 max-w-lg text-muted-foreground leading-relaxed text-lg">
              {t("contact.description")}
            </motion.p>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-12 space-y-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{t("contact.or")}</p>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: "info@eventos360.mx", href: "mailto:info@eventos360.mx" },
                  { icon: Phone, text: "+52 (123) 456-7890", href: "tel:+521234567890" },
                  { icon: MapPin, text: "Mexico City, MX", href: undefined },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  >
                    {item.href ? (
                      <a href={item.href} className="group flex items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/8 transition-colors group-hover:bg-[var(--gold)]/15">
                          <item.icon size={18} className="text-[var(--gold)]" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/8">
                          <item.icon size={18} className="text-[var(--gold)]" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="flex-1">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5 rounded-2xl border border-border/30 bg-card/50 p-6 shadow-xl shadow-background/50 backdrop-blur-sm lg:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-2 block text-sm font-medium text-foreground">{t("contact.name")}</label>
                  <input
                    id="c-name"
                    type="text"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-2 block text-sm font-medium text-foreground">{t("contact.email")}</label>
                  <input
                    id="c-email"
                    type="email"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]/50 transition-all"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-phone" className="mb-2 block text-sm font-medium text-foreground">{t("contact.phone")}</label>
                  <input
                    id="c-phone"
                    type="tel"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="c-date" className="mb-2 block text-sm font-medium text-foreground">{t("contact.date")}</label>
                  <input
                    id="c-date"
                    type="date"
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className="mb-2 block text-sm font-medium text-foreground">{t("contact.message")}</label>
                <textarea
                  id="c-message"
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]/50 transition-all resize-none"
                  placeholder={t("contact.message")}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-13 rounded-xl text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-lg shadow-[var(--gold)]/15"
              >
                <Send size={16} className="mr-2" />
                {t("contact.submit")}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
