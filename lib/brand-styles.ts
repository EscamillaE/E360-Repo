/**
 * EVENTOS 360 - Official Brand Style Guide
 * =========================================
 * 
 * This file defines the official branding standards for the entire website.
 * All components should reference these styles for consistency.
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================
export const colors = {
  // Primary Accent - Neon Orange-Yellow (Vibrant, Modern)
  primary: {
    gold: "hsl(32, 100%, 52%)",
    goldLight: "hsl(38, 100%, 58%)",
    goldDark: "hsl(26, 100%, 46%)",
    neonOrange: "hsl(25, 100%, 55%)",
    neonYellow: "hsl(42, 100%, 58%)",
  },
  // Backgrounds (Dark Mode Default)
  dark: {
    background: "hsl(0, 0%, 4%)",
    card: "hsl(0, 0%, 8%)",
    cardTransparent: "hsl(0, 0%, 8%, 0.5)",
    border: "hsl(0, 0%, 18%)",
    muted: "hsl(0, 0%, 16%)",
  },
  // Light mode
  light: {
    background: "hsl(0, 0%, 100%)",
    card: "hsl(0, 0%, 98%)",
    cardTransparent: "hsl(0, 0%, 98%, 0.5)",
    border: "hsl(40, 10%, 88%)",
    muted: "hsl(40, 10%, 92%)",
  },
  // Text
  text: {
    foreground: "hsl(0, 0%, 98%)",
    muted: "hsl(0, 0%, 65%)",
    gold: "hsl(32, 100%, 52%)",
  },
}

// =============================================================================
// TYPOGRAPHY
// =============================================================================
export const typography = {
  // Font Families
  fontFamily: {
    sans: "Geist, system-ui, -apple-system, sans-serif",
    mono: "Geist Mono, monospace",
  },
  // Font Sizes (in rem)
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem",// 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem",    // 48px
  },
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  // Line Heights
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.6,
  },
}

// =============================================================================
// SPACING
// =============================================================================
export const spacing = {
  // Base spacing unit: 4px
  "0": "0",
  "1": "0.25rem",  // 4px
  "2": "0.5rem",   // 8px
  "3": "0.75rem",  // 12px
  "4": "1rem",     // 16px
  "5": "1.25rem",  // 20px
  "6": "1.5rem",   // 24px
  "8": "2rem",     // 32px
  "10": "2.5rem",  // 40px
  "12": "3rem",    // 48px
  "16": "4rem",    // 64px
}

// =============================================================================
// COMPONENT STYLES
// =============================================================================

// Premium Card - Semi-transparent with neon outline on hover/active
export const cardStyles = {
  base: `
    bg-card/50
    backdrop-blur-sm
    border-2 border-border
    rounded-2xl
    transition-all duration-300 ease-out
  `,
  hover: `
    hover:border-gold
    hover:shadow-[0_0_25px_hsl(32,100%,52%,0.25),0_10px_40px_hsl(0,0%,0%,0.4)]
  `,
  active: `
    border-gold
    shadow-[0_0_30px_hsl(32,100%,52%,0.35),0_0_60px_hsl(25,100%,55%,0.15)]
  `,
}

// Tab/Button Styles
export const tabStyles = {
  inactive: `
    bg-card/50
    backdrop-blur-sm
    border-2 border-border
    text-foreground
    hover:border-gold/50
    hover:text-gold
    transition-all duration-300
  `,
  active: `
    bg-gradient-to-r from-neon-orange via-gold to-neon-yellow
    border-2 border-gold
    text-background
    font-semibold
    shadow-[0_4px_25px_hsl(32,100%,52%,0.5)]
  `,
}

// Button Styles
export const buttonStyles = {
  primary: `
    bg-gradient-to-r from-neon-orange to-gold
    text-background
    font-semibold
    rounded-full
    transition-all duration-300
    hover:shadow-[0_8px_30px_hsl(32,100%,52%,0.5),0_0_60px_hsl(25,100%,55%,0.25)]
    hover:translate-y-[-2px]
    active:scale-95
  `,
  secondary: `
    bg-card/50
    backdrop-blur-sm
    border-2 border-border
    text-foreground
    rounded-full
    transition-all duration-300
    hover:border-gold
    hover:text-gold
    active:scale-95
  `,
}

// =============================================================================
// VOICE/TONE GUIDE
// =============================================================================
export const voiceTone = {
  // Mexican Spanish - Natural, friendly, informal but professional
  es: {
    greeting: [
      "Que onda! Soy Luna, bienvenido a Eventos 360.",
      "Hola! Que gusto verte por aqui. Soy Luna, tu asistente.",
      "Hey, que tal! Soy Luna de Eventos 360. Como te ayudo?",
    ],
    farewell: [
      "Sale, nos vemos! Cualquier cosa, aqui andamos.",
      "Va que va! Suerte con tu evento, quedara increible.",
      "Listo! Si necesitas algo mas, solo toca el orbe dorado.",
    ],
    enthusiasm: [
      "Esta padrisimo!",
      "Te va a encantar!",
      "Queda increible en los eventos!",
      "Es de lo mas solicitado!",
    ],
    helpPrompts: [
      "En que te echo la mano?",
      "Que necesitas saber?",
      "Como te ayudo?",
      "Que onda, en que te apoyo?",
    ],
  },
  // American English - Casual, upbeat, approachable
  en: {
    greeting: [
      "Hey there! I'm Luna, welcome to Eventos 360!",
      "Hi! Great to see you here. I'm Luna, your assistant.",
      "What's up! I'm Luna from Eventos 360. How can I help?",
    ],
    farewell: [
      "Awesome, see you around! We're here if you need us.",
      "You got it! Your event's gonna be amazing!",
      "All set! If you need anything else, just tap the golden orb.",
    ],
    enthusiasm: [
      "It's super cool!",
      "You're gonna love it!",
      "It looks amazing at events!",
      "It's one of our most popular options!",
    ],
    helpPrompts: [
      "What can I help you with?",
      "What would you like to know?",
      "How can I help?",
      "What's on your mind?",
    ],
  },
}

// =============================================================================
// ANIMATION TIMINGS
// =============================================================================
export const animations = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    verySlow: "800ms",
  },
  easing: {
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    linear: "linear",
  },
}

// =============================================================================
// SOCIAL LINKS
// =============================================================================
export const socialLinks = {
  facebook: {
    url: "https://facebook.com/eventos360mx",
    handle: "@eventos360mx",
    color: "#1877F2",
  },
  instagram: {
    url: "https://instagram.com/eventos360mx",
    handle: "@eventos360mx",
    color: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
  },
  whatsapp: {
    number: "+5214427953753",
    displayNumber: "442-795-3753",
    url: "https://wa.me/5214427953753?text=Hola%2C%20me%20interesa%20cotizar%20un%20evento",
    color: "#25D366",
  },
  email: {
    address: "proyectos360.qro@gmail.com",
    url: "mailto:proyectos360.qro@gmail.com",
  },
  website: {
    url: "https://eventos360.com",
    display: "eventos360.com",
  },
}

// =============================================================================
// SLIDESHOW SETTINGS (for kiosk mode)
// =============================================================================
export const slideshowSettings = {
  idleTimeout: 60000,         // 60 seconds before slideshow starts
  slideInterval: 8000,        // 8 seconds per slide
  transitionDuration: 800,    // Slide transition time
  slides: [
    {
      id: "social",
      title: { es: "Siguenos en redes", en: "Follow us on social media" },
      subtitle: { es: "Escanea el codigo QR", en: "Scan the QR code" },
      type: "qr",
      qrTargets: ["facebook", "instagram"],
    },
    {
      id: "whatsapp",
      title: { es: "Contactanos directo", en: "Contact us directly" },
      subtitle: { es: "Escribe por WhatsApp", en: "Message us on WhatsApp" },
      type: "qr",
      qrTargets: ["whatsapp"],
    },
    {
      id: "catalog",
      title: { es: "Explora nuestros servicios", en: "Explore our services" },
      subtitle: { es: "DJ, Efectos, Pisos LED y mas", en: "DJ, Effects, LED Floors and more" },
      type: "catalog",
    },
    {
      id: "promo",
      title: { es: "Ofertas especiales", en: "Special offers" },
      subtitle: { es: "Pregunta por nuestros paquetes", en: "Ask about our packages" },
      type: "promo",
    },
  ],
}
