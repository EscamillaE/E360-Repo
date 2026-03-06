"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "en" | "es"

const translations = {
  en: {
    // Nav
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.packages": "Packages",
    "nav.configure": "Get a Quote",
    "nav.staff": "Staff Portal",

    // Hero
    "hero.badge": "Premium Event Production",
    "hero.title1": "Your Vision,",
    "hero.title2": "Our Craft",
    "hero.subtitle": "Production \u00B7 Lighting \u00B7 Audio \u00B7 Atmosphere Design",
    "hero.description": "We engineer unforgettable experiences. From intimate celebrations to grand-scale productions, every detail is designed with precision and passion.",
    "hero.cta.primary": "Get a Quote",
    "hero.cta.secondary": "Explore Services",
    "hero.stat.events": "Events",
    "hero.stat.clients": "Clients",
    "hero.stat.rating": "Rating",

    // About
    "about.label": "Our Story",
    "about.title": "Built on Passion, Driven by Precision",
    "about.p1": "Eventos 360 was born from a simple belief: every event deserves to be extraordinary. What started as a one-person operation with a pair of speakers and a lighting rig has grown into a full-service production company trusted by hundreds of clients across Mexico.",
    "about.p2": "We don't just set up equipment -- we craft atmospheres. Every event is a composition of light, sound, and emotion, carefully engineered to leave lasting impressions. Our team brings years of hands-on experience, cutting-edge technology, and genuine care to every project.",
    "about.p3": "Whether it's a wedding, a corporate conference, or a celebration of a lifetime, we treat your event like it's our own.",
    "about.value1.title": "Relentless Quality",
    "about.value1.desc": "Professional-grade equipment and meticulous execution on every single event.",
    "about.value2.title": "Full-Service Approach",
    "about.value2.desc": "From concept to cleanup, we handle every detail so you can focus on the moment.",
    "about.value3.title": "Transparent Pricing",
    "about.value3.desc": "No hidden fees. We build your quote based on exactly what your event needs.",

    // Services
    "services.label": "What We Do",
    "services.title": "Seven Modules, One Seamless Experience",
    "services.description": "Each service is a specialized production module. Combine them to build the perfect event.",
    "services.cta": "Configure Your Event",

    // Portfolio
    "portfolio.label": "Our Work",
    "portfolio.title": "Events That Speak for Themselves",
    "portfolio.description": "A selection of events we've had the privilege to produce.",
    "portfolio.wedding.title": "Luxury Wedding Reception",
    "portfolio.wedding.desc": "Crystal chandeliers, warm uplighting, and an atmosphere of pure elegance for 350 guests.",
    "portfolio.corporate.title": "Corporate Conference",
    "portfolio.corporate.desc": "Full AV production with LED walls, stage design, and broadcast-quality sound.",
    "portfolio.party.title": "Private Celebration",
    "portfolio.party.desc": "High-energy DJ production with LED panels, fog effects, and concert-grade audio.",
    "portfolio.quince.title": "Quincea\u00F1era Celebration",
    "portfolio.quince.desc": "A magical night with custom lighting, LED dance floor, and unforgettable moments.",

    // Contact
    "contact.label": "Get In Touch",
    "contact.title": "Ready to Create Something Extraordinary?",
    "contact.description": "Tell us about your event and we'll prepare a custom proposal within 24 hours.",
    "contact.name": "Your Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.date": "Event Date",
    "contact.message": "Tell us about your event...",
    "contact.submit": "Send Message",
    "contact.or": "Or reach us directly",

    // Footer
    "footer.tagline": "Premium event production. Every detail, every time.",
    "footer.rights": "All rights reserved.",

    // Services detail labels
    "service.lighting": "Lighting",
    "service.audio": "Audio",
    "service.structures": "Structures",
    "service.atmosphere": "Atmosphere",
    "service.experiences": "Experiences",
    "service.decor": "Decor",
    "service.logistics": "Logistics",
    "service.lighting.desc": "Architectural, scenic, and cinematic lighting design",
    "service.audio.desc": "Sound systems, live mixing, and acoustic engineering",
    "service.structures.desc": "Stages, tents, platforms, and custom builds",
    "service.atmosphere.desc": "Fog, haze, pyrotechnics, and special effects",
    "service.experiences.desc": "Photo booths, LED walls, and interactive stations",
    "service.decor.desc": "Floral design, fabric draping, and scenic elements",
    "service.logistics.desc": "Transport, power supply, crew, and coordination",

    // Configure page
    "config.step.details": "Event Details",
    "config.step.services": "Select Services",
    "config.step.configure": "Configure",
    "config.step.review": "Review",
    "config.details.title": "Event Details",
    "config.details.desc": "Tell us about your event to get started.",
    "config.details.name": "Event Name",
    "config.details.name.placeholder": "e.g. Summer Gala 2026",
    "config.details.date": "Event Date",
    "config.details.location": "Location Type",
    "config.details.guests": "Estimated Guests",
    "config.services.title": "Select Services",
    "config.services.desc": "Choose the production modules for your event.",
    "config.services.outdoor": "Outdoor Event Detected",
    "config.services.outdoor.desc": "We recommend adding Logistics for power backup and weather contingency.",
    "config.configure.title": "Configure Services",
    "config.configure.desc": "Select a production tier for each service.",
    "config.review.title": "Review Configuration",
    "config.review.desc": "Confirm your event details and submit for a quote.",
    "config.review.info": "Event Info",
    "config.review.name": "Name",
    "config.review.date": "Date",
    "config.review.location": "Location",
    "config.review.guests": "Guests",
    "config.review.services": "Services",
    "config.submitted.title": "Quote Requested",
    "config.submitted.desc": "Your event configuration has been submitted. Our team will prepare a detailed proposal.",
    "config.submitted.back": "Back to Home",
    "config.submitted.another": "Configure Another",
    "config.btn.back": "Back",
    "config.btn.next": "Next",
    "config.btn.submit": "Request Quote",
    "config.selected": "selected",
    "config.noservices": "No services selected",
    "config.indoor": "Indoor",
    "config.outdoor": "Outdoor",
    "config.hybrid": "Hybrid",
    "config.tier.basic": "Basic",
    "config.tier.premium": "Premium",
    "config.tier.cinematic": "Cinematic",

    // Services detail page
    "services.page.title": "Our Services",
    "services.page.desc": "Seven specialized production modules that combine to create unforgettable events.",
    "services.page.cta": "Start Configuring",
    "services.page.back": "Back to Home",

    // Ops
    "ops.center": "Operations Center",
  },
  es: {
    // Nav
    "nav.services": "Servicios",
    "nav.portfolio": "Portafolio",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.packages": "Paquetes",
    "nav.configure": "Cotizar",
    "nav.staff": "Portal Staff",

    // Hero
    "hero.badge": "Producci\u00F3n Premium de Eventos",
    "hero.title1": "Tu Visi\u00F3n,",
    "hero.title2": "Nuestro Arte",
    "hero.subtitle": "Producci\u00F3n \u00B7 Iluminaci\u00F3n \u00B7 Audio \u00B7 Ambientaci\u00F3n",
    "hero.description": "Dise\u00F1amos experiencias inolvidables. Desde celebraciones \u00EDntimas hasta producciones a gran escala, cada detalle es creado con precisi\u00F3n y pasi\u00F3n.",
    "hero.cta.primary": "Cotiza tu Evento",
    "hero.cta.secondary": "Ver Servicios",
    "hero.stat.events": "Eventos",
    "hero.stat.clients": "Clientes",
    "hero.stat.rating": "Calificaci\u00F3n",

    // About
    "about.label": "Nuestra Historia",
    "about.title": "Construido con Pasi\u00F3n, Impulsado por Precisi\u00F3n",
    "about.p1": "Eventos 360 naci\u00F3 de una creencia simple: cada evento merece ser extraordinario. Lo que comenz\u00F3 como una operaci\u00F3n de una sola persona con un par de bocinas y luces ha crecido hasta convertirse en una empresa de producci\u00F3n integral, confiada por cientos de clientes en todo M\u00E9xico.",
    "about.p2": "No solo instalamos equipo -- creamos atm\u00F3sferas. Cada evento es una composici\u00F3n de luz, sonido y emoci\u00F3n, cuidadosamente dise\u00F1ada para dejar impresiones duraderas. Nuestro equipo aporta a\u00F1os de experiencia pr\u00E1ctica, tecnolog\u00EDa de vanguardia y un cuidado genuino a cada proyecto.",
    "about.p3": "Ya sea una boda, una conferencia corporativa o la celebraci\u00F3n de tu vida, tratamos tu evento como si fuera el nuestro.",
    "about.value1.title": "Calidad Implacable",
    "about.value1.desc": "Equipo de grado profesional y ejecuci\u00F3n meticulosa en cada evento.",
    "about.value2.title": "Servicio Integral",
    "about.value2.desc": "Del concepto a la limpieza, manejamos cada detalle para que t\u00FA disfrutes el momento.",
    "about.value3.title": "Precios Transparentes",
    "about.value3.desc": "Sin cargos ocultos. Construimos tu cotizaci\u00F3n basada en lo que tu evento necesita.",

    // Services
    "services.label": "Lo Que Hacemos",
    "services.title": "Siete M\u00F3dulos, Una Experiencia Perfecta",
    "services.description": "Cada servicio es un m\u00F3dulo de producci\u00F3n especializado. Comb\u00EDnalos para construir el evento perfecto.",
    "services.cta": "Configura Tu Evento",

    // Portfolio
    "portfolio.label": "Nuestro Trabajo",
    "portfolio.title": "Eventos Que Hablan Por S\u00ED Mismos",
    "portfolio.description": "Una selecci\u00F3n de eventos que hemos tenido el privilegio de producir.",
    "portfolio.wedding.title": "Recepci\u00F3n de Boda de Lujo",
    "portfolio.wedding.desc": "Candelabros de cristal, iluminaci\u00F3n c\u00E1lida y una atm\u00F3sfera de pura elegancia para 350 invitados.",
    "portfolio.corporate.title": "Conferencia Corporativa",
    "portfolio.corporate.desc": "Producci\u00F3n AV completa con pantallas LED, dise\u00F1o de escenario y sonido de calidad broadcast.",
    "portfolio.party.title": "Celebraci\u00F3n Privada",
    "portfolio.party.desc": "Producci\u00F3n DJ de alta energ\u00EDa con paneles LED, efectos de humo y audio de concierto.",
    "portfolio.quince.title": "Fiesta de Quincea\u00F1era",
    "portfolio.quince.desc": "Una noche m\u00E1gica con iluminaci\u00F3n personalizada, pista LED y momentos inolvidables.",

    // Contact
    "contact.label": "Cont\u00E1ctanos",
    "contact.title": "\u00BFListo Para Crear Algo Extraordinario?",
    "contact.description": "Cu\u00E9ntanos sobre tu evento y prepararemos una propuesta personalizada en 24 horas.",
    "contact.name": "Tu Nombre",
    "contact.email": "Correo Electr\u00F3nico",
    "contact.phone": "Tel\u00E9fono",
    "contact.date": "Fecha del Evento",
    "contact.message": "Cu\u00E9ntanos sobre tu evento...",
    "contact.submit": "Enviar Mensaje",
    "contact.or": "O cont\u00E1ctanos directamente",

    // Footer
    "footer.tagline": "Producci\u00F3n premium de eventos. Cada detalle, cada vez.",
    "footer.rights": "Todos los derechos reservados.",

    // Services detail labels
    "service.lighting": "Iluminaci\u00F3n",
    "service.audio": "Audio",
    "service.structures": "Estructuras",
    "service.atmosphere": "Ambientaci\u00F3n",
    "service.experiences": "Experiencias",
    "service.decor": "Decoraci\u00F3n",
    "service.logistics": "Log\u00EDstica",
    "service.lighting.desc": "Dise\u00F1o de iluminaci\u00F3n arquitect\u00F3nica, esc\u00E9nica y cinem\u00E1tica",
    "service.audio.desc": "Sistemas de sonido, mezcla en vivo e ingenier\u00EDa ac\u00FAstica",
    "service.structures.desc": "Escenarios, carpas, plataformas y construcciones personalizadas",
    "service.atmosphere.desc": "Humo, neblina, pirotecnia y efectos especiales",
    "service.experiences.desc": "Cabinas de fotos, pantallas LED e instalaciones interactivas",
    "service.decor.desc": "Dise\u00F1o floral, telas decorativas y elementos esc\u00E9nicos",
    "service.logistics.desc": "Transporte, energ\u00EDa, equipo y coordinaci\u00F3n",

    // Configure page
    "config.step.details": "Detalles",
    "config.step.services": "Servicios",
    "config.step.configure": "Configurar",
    "config.step.review": "Revisar",
    "config.details.title": "Detalles del Evento",
    "config.details.desc": "Cu\u00E9ntanos sobre tu evento para comenzar.",
    "config.details.name": "Nombre del Evento",
    "config.details.name.placeholder": "ej. Gala de Verano 2026",
    "config.details.date": "Fecha del Evento",
    "config.details.location": "Tipo de Ubicaci\u00F3n",
    "config.details.guests": "Invitados Estimados",
    "config.services.title": "Seleccionar Servicios",
    "config.services.desc": "Elige los m\u00F3dulos de producci\u00F3n para tu evento.",
    "config.services.outdoor": "Evento al Aire Libre Detectado",
    "config.services.outdoor.desc": "Recomendamos agregar Log\u00EDstica para respaldo de energ\u00EDa y contingencia clim\u00E1tica.",
    "config.configure.title": "Configurar Servicios",
    "config.configure.desc": "Selecciona un nivel de producci\u00F3n para cada servicio.",
    "config.review.title": "Revisar Configuraci\u00F3n",
    "config.review.desc": "Confirma los detalles de tu evento y env\u00EDa para cotizaci\u00F3n.",
    "config.review.info": "Info del Evento",
    "config.review.name": "Nombre",
    "config.review.date": "Fecha",
    "config.review.location": "Ubicaci\u00F3n",
    "config.review.guests": "Invitados",
    "config.review.services": "Servicios",
    "config.submitted.title": "Cotizaci\u00F3n Solicitada",
    "config.submitted.desc": "Tu configuraci\u00F3n de evento ha sido enviada. Nuestro equipo preparar\u00E1 una propuesta detallada.",
    "config.submitted.back": "Volver al Inicio",
    "config.submitted.another": "Configurar Otro",
    "config.btn.back": "Atr\u00E1s",
    "config.btn.next": "Siguiente",
    "config.btn.submit": "Solicitar Cotizaci\u00F3n",
    "config.selected": "seleccionados",
    "config.noservices": "Ning\u00FAn servicio seleccionado",
    "config.indoor": "Interior",
    "config.outdoor": "Exterior",
    "config.hybrid": "H\u00EDbrido",
    "config.tier.basic": "B\u00E1sico",
    "config.tier.premium": "Premium",
    "config.tier.cinematic": "Cinem\u00E1tico",

    // Services detail page
    "services.page.title": "Nuestros Servicios",
    "services.page.desc": "Siete m\u00F3dulos especializados que se combinan para crear eventos inolvidables.",
    "services.page.cta": "Comenzar a Configurar",
    "services.page.back": "Volver al Inicio",

    // Ops
    "ops.center": "Centro de Operaciones",
  },
} as const

type TranslationKey = keyof typeof translations.en

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[locale][key] ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
