"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { 
  X, Send, Loader2, Mic, MicOff, 
  Volume2, VolumeX, Zap, DollarSign, Star,
  Music, Flame, Camera, ChevronRight, Globe, Navigation
} from "lucide-react"
import { useApp } from "@/components/providers"

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

type Personality = "barrio" | "fresa" | "professional"
type Language = "es" | "en" | "fr"

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

// Natural conversation responses with personality modes
const naturalResponses = {
  es: {
    barrio: {
      greetings: [
        "Que onda carnal! Como te puedo ayudar?",
        "Que pedo! Listo para armar tu fiestota?",
        "Hey que tranza! Bienvenido a Eventos 360, que se te ofrece compa?",
      ],
      thinking: ["Dejame checo...", "Un ratito, ya lo busco...", "Va que va, ahorita te digo..."],
      confirm: ["Sale!", "Va!", "Orale pues!", "Chido!"],
    },
    fresa: {
      greetings: [
        "Ay hola! Que gusto que nos visites, como te puedo ayudar?",
        "Hola bonita/o! Lista para planear tu evento increible?",
        "Holi! Bienvenido a Eventos 360, cuentame que necesitas!",
      ],
      thinking: ["Dejame ver...", "Un momento por favor...", "Ya te busco..."],
      confirm: ["Perfecto!", "Increible!", "Me encanta!", "Genial!"],
    },
    professional: {
      greetings: [
        "Buen dia, soy Luna, su asesora de eventos. En que puedo ayudarle?",
        "Bienvenido a Eventos 360. Es un placer atenderle.",
        "Hola, estoy para ayudarle a planificar su evento ideal.",
      ],
      thinking: ["Permitame un momento...", "Verificando la informacion...", "En seguida le informo..."],
      confirm: ["Perfecto.", "Excelente eleccion.", "Muy bien.", "Entendido."],
    },
  },
  en: {
    barrio: {
      greetings: ["Hey what's up! How can I help you?", "Yo! Ready to plan an epic party?", "Hey there! Welcome, what do you need?"],
      thinking: ["Let me check...", "One sec...", "Gotcha, looking it up..."],
      confirm: ["Cool!", "Awesome!", "Nice!", "Got it!"],
    },
    fresa: {
      greetings: ["Oh hi! So happy you're here, how can I help?", "Hello gorgeous! Ready for an amazing event?", "Hiii! Welcome to Eventos 360!"],
      thinking: ["Let me see...", "Just a moment...", "Looking that up for you..."],
      confirm: ["Perfect!", "Amazing!", "Love it!", "Great!"],
    },
    professional: {
      greetings: ["Good day, I'm Luna, your event advisor. How may I assist you?", "Welcome to Eventos 360. It's my pleasure to help.", "Hello, I'm here to help plan your ideal event."],
      thinking: ["One moment please...", "Checking that for you...", "I'll have that information shortly..."],
      confirm: ["Perfect.", "Excellent choice.", "Very well.", "Understood."],
    },
  },
  fr: {
    barrio: {
      greetings: ["Salut! Comment je peux t'aider?", "Hey! Pret pour une fete de ouf?", "Coucou! Bienvenue chez Eventos 360!"],
      thinking: ["Laisse-moi voir...", "Un instant...", "Je cherche..."],
      confirm: ["Cool!", "Super!", "Genial!", "OK!"],
    },
    fresa: {
      greetings: ["Oh bonjour! Ravie de te voir, comment puis-je t'aider?", "Coucou! Prete pour un evenement incroyable?", "Salut! Bienvenue!"],
      thinking: ["Un moment s'il te plait...", "Je regarde...", "Je cherche ca pour toi..."],
      confirm: ["Parfait!", "Magnifique!", "J'adore!", "Genial!"],
    },
    professional: {
      greetings: ["Bonjour, je suis Luna, votre conseillere evenementielle. Comment puis-je vous aider?", "Bienvenue chez Eventos 360. C'est un plaisir de vous servir.", "Bonjour, je suis la pour vous aider a planifier votre evenement."],
      thinking: ["Un moment s'il vous plait...", "Je verifie...", "Je vous informe tout de suite..."],
      confirm: ["Parfait.", "Excellent choix.", "Tres bien.", "Compris."],
    },
  },
}

// Language selection prompt
const languagePrompts = {
  es: "En que idioma prefieres que te atienda?",
  en: "What language would you prefer?",
  fr: "Dans quelle langue preferez-vous?",
}

// Format message with rich elements
function RichMessage({ text, locale }: { text: string; locale: Language }) {
  const hasPrice = /\$[\d,]+|MXN|pesos/i.test(text)
  const hasList = text.includes("•") || text.includes("-") || /^\d+\./.test(text)
  const hasPackage = /paquete|package|forfait|magic|party|luxury|fancy/i.test(text)
  
  const paragraphs = text.split(/\n\n+/)
  
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => {
        const lines = p.split(/\n/)
        const isList = lines.length > 1 && lines.every(l => /^[\•\-\d\.]/.test(l.trim()))
        
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                  <span>{line.replace(/^[\•\-\d\.]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          )
        }
        
        if (hasPrice && /\$[\d,]+/.test(p)) {
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2">
              <DollarSign className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">{p}</span>
            </div>
          )
        }
        
        return <p key={i} className="text-sm leading-relaxed">{p}</p>
      })}
      
      {hasPackage && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
            <Zap className="h-3 w-3" />
            {locale === "es" ? "Ver detalles" : locale === "fr" ? "Voir details" : "View details"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <Star className="h-3 w-3" />
            {locale === "es" ? "Comparar" : locale === "fr" ? "Comparer" : "Compare"}
          </span>
        </div>
      )}
    </div>
  )
}

interface AiAssistantProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AiAssistant({ isOpen: controlledOpen, onOpenChange }: AiAssistantProps) {
  const { t, locale, setLocale } = useApp()
  const [internalOpen, setInternalOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [personality, setPersonality] = useState<Personality>("professional")
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const currentLang = locale as Language

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognitionClass) return
      recognitionRef.current = new SpeechRecognitionClass()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = locale === "es" ? "es-MX" : locale === "fr" ? "fr-FR" : "en-US"
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        if (transcript.trim()) {
          sendMessage({ text: transcript })
          setInput("")
        }
      }
      
      recognitionRef.current.onend = () => setIsListening(false)
      recognitionRef.current.onerror = () => setIsListening(false)
    }
  }, [locale, sendMessage])

  const speakMessage = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale === "es" ? "es-MX" : locale === "fr" ? "fr-FR" : "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [locale, voiceEnabled])

  useEffect(() => {
    if (messages.length > 0 && voiceEnabled) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === "assistant") {
        const text = getMessageText(lastMsg)
        if (text) speakMessage(text)
      }
    }
  }, [messages, voiceEnabled, speakMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.lang = locale === "es" ? "es-MX" : locale === "fr" ? "fr-FR" : "en-US"
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
    setShowLanguageSelector(false)
  }

  const selectLanguage = (lang: Language) => {
    setLocale(lang)
    setShowLanguageSelector(false)
    const responses = naturalResponses[lang][personality]
    const greeting = responses.greetings[Math.floor(Math.random() * responses.greetings.length)]
    speakMessage(greeting)
  }

  const navigateTo = (path: string) => {
    window.location.href = path
    setIsOpen(false)
  }

  const quickSuggestions = locale === "es" 
    ? [
        { icon: Music, label: "Paquetes DJ", query: "Cuales son los paquetes de DJ?" },
        { icon: Flame, label: "Efectos", query: "Que efectos especiales tienen?" },
        { icon: Camera, label: "Cabina 360", query: "Como funciona la cabina 360?" },
        { icon: DollarSign, label: "Cotizar", query: "Quiero cotizar mi evento" },
      ]
    : locale === "fr"
    ? [
        { icon: Music, label: "Forfaits DJ", query: "Quels sont les forfaits DJ?" },
        { icon: Flame, label: "Effets", query: "Quels effets speciaux avez-vous?" },
        { icon: Camera, label: "Cabine 360", query: "Comment fonctionne la cabine 360?" },
        { icon: DollarSign, label: "Devis", query: "Je veux un devis" },
      ]
    : [
        { icon: Music, label: "DJ Packages", query: "What DJ packages do you have?" },
        { icon: Flame, label: "Effects", query: "What special effects are available?" },
        { icon: Camera, label: "360 Booth", query: "How does the 360 booth work?" },
        { icon: DollarSign, label: "Quote", query: "I want to get a quote" },
      ]

  const navigationItems = [
    { label: locale === "es" ? "Ver Catalogo" : locale === "fr" ? "Voir Catalogue" : "View Catalog", path: "/catalogo" },
    { label: locale === "es" ? "Servicios" : locale === "fr" ? "Services" : "Services", path: "/#servicios" },
    { label: locale === "es" ? "Galeria" : locale === "fr" ? "Galerie" : "Gallery", path: "/#galeria" },
    { label: locale === "es" ? "Contacto" : locale === "fr" ? "Contact" : "Contact", path: "/#contacto" },
  ]

  return (
    <>
      {/* Floating trigger button with Luna orb */}
      <div
        className={cn(
          "fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full border-2 border-gold/30 bg-card/90 pl-2 pr-5 py-2 backdrop-blur-md transition-all hover:border-gold hover:shadow-[0_0_30px_hsl(32,100%,52%,0.3)] cursor-pointer",
          isOpen && "hidden"
        )}
        onClick={() => setIsOpen(true)}
      >
        <LunaOrbButton onClick={() => setIsOpen(true)} size="md" isSpeaking={isSpeaking} />
        <div className="text-left">
          <span className="block text-sm font-medium text-foreground">Luna</span>
          <span className="block text-xs text-muted-foreground">
            {locale === "es" ? "Hablame!" : locale === "fr" ? "Parle-moi!" : "Talk to me!"}
          </span>
        </div>
        <Mic className="h-4 w-4 text-gold" />
      </div>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-500 ease-out",
          "bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto",
          "md:w-[440px]",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-[min(620px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border-2 border-gold/20 bg-card/95 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <LunaOrbButton onClick={() => {}} size="md" isSpeaking={isSpeaking} isActive={isListening} />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Luna</h3>
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? "Tu asesora de eventos" : locale === "fr" ? "Votre conseillere" : "Your event advisor"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setShowLanguageSelector(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-all hover:bg-secondary hover:text-gold"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
              </button>
              {/* Voice toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking()
                  setVoiceEnabled(!voiceEnabled)
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  voiceEnabled 
                    ? "bg-gold/10 text-gold" 
                    : "bg-secondary text-muted-foreground"
                )}
                aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Language selector on first open */}
            {showLanguageSelector && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <LunaOrbButton onClick={() => {}} size="lg" isSpeaking={isSpeaking} className="mb-6" />
                
                <h4 className="mb-4 text-base font-semibold text-foreground">
                  {languagePrompts[currentLang]}
                </h4>
                
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={() => selectLanguage("es")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all",
                      locale === "es" 
                        ? "border-gold bg-gold/10 text-gold" 
                        : "border-border bg-card/50 text-foreground hover:border-gold/40"
                    )}
                  >
                    <span className="text-2xl">🇲🇽</span>
                    <span className="text-sm font-medium">Espanol</span>
                  </button>
                  <button
                    onClick={() => selectLanguage("en")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all",
                      locale === "en" 
                        ? "border-gold bg-gold/10 text-gold" 
                        : "border-border bg-card/50 text-foreground hover:border-gold/40"
                    )}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-sm font-medium">English</span>
                  </button>
                  <button
                    onClick={() => selectLanguage("fr")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all",
                      locale === "fr" 
                        ? "border-gold bg-gold/10 text-gold" 
                        : "border-border bg-card/50 text-foreground hover:border-gold/40"
                    )}
                  >
                    <span className="text-2xl">🇫🇷</span>
                    <span className="text-sm font-medium">Francais</span>
                  </button>
                </div>

                {/* Personality selector (Spanish only) */}
                {locale === "es" && (
                  <div className="w-full">
                    <p className="text-xs text-muted-foreground mb-2">Estilo de conversacion:</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setPersonality("barrio")}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                          personality === "barrio" ? "bg-gold text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                      >
                        Casual
                      </button>
                      <button
                        onClick={() => setPersonality("fresa")}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                          personality === "fresa" ? "bg-gold text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                      >
                        Amigable
                      </button>
                      <button
                        onClick={() => setPersonality("professional")}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                          personality === "professional" ? "bg-gold text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                      >
                        Profesional
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty state with voice-first prompt */}
            {!showLanguageSelector && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <button
                  onClick={toggleListening}
                  className={cn(
                    "mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all",
                    isListening
                      ? "bg-gradient-to-br from-neon-orange to-gold shadow-[0_0_40px_hsl(32,100%,52%,0.5)] scale-110"
                      : "bg-gold/10 hover:bg-gold/20 hover:scale-105"
                  )}
                >
                  {isListening ? (
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-white animate-pulse"
                          style={{ 
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Mic className="h-8 w-8 text-gold" />
                  )}
                </button>
                
                <h4 className="mb-2 text-base font-semibold text-foreground">
                  {t.ai.welcome}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[300px] mb-6">
                  {t.ai.welcomeDesc}
                </p>
                
                {/* Quick suggestions */}
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  {quickSuggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => { sendMessage({ text: s.query }); setShowLanguageSelector(false); }}
                      className="flex items-center gap-2 rounded-xl border-2 border-border bg-card/50 px-3 py-2.5 text-left transition-all hover:border-gold/40 hover:bg-card"
                    >
                      <s.icon className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Navigation shortcuts */}
                <div className="w-full border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1 justify-center">
                    <Navigation className="h-3 w-3" />
                    {locale === "es" ? "Navegacion rapida" : locale === "fr" ? "Navigation rapide" : "Quick navigation"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {navigationItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigateTo(item.path)}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:bg-gold/10 hover:text-gold transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = getMessageText(message)
              if (!text) return null
              const isUser = message.role === "user"
              return (
                <div
                  key={message.id}
                  className={cn(
                    "mb-4 flex",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-2xl px-4 py-3",
                      isUser
                        ? "bg-gradient-to-r from-neon-orange to-gold text-white rounded-br-md"
                        : "border-2 border-border bg-card/80 text-foreground rounded-bl-md"
                    )}
                  >
                    {isUser ? (
                      <p className="text-sm leading-relaxed">{text}</p>
                    ) : (
                      <RichMessage text={text} locale={currentLang} />
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border-2 border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-gold" />
                  <span>{t.ai.thinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input with voice button */}
          <div className="border-t border-border px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all",
                  isListening
                    ? "bg-gradient-to-r from-neon-orange to-gold text-white shadow-[0_0_20px_hsl(32,100%,52%,0.4)]"
                    : "border-2 border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-gold"
                )}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.ai.placeholder}
                disabled={isLoading}
                className="flex-1 rounded-xl border-2 border-border bg-card/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-neon-orange to-gold text-white transition-all hover:shadow-[0_0_20px_hsl(32,100%,52%,0.4)] disabled:opacity-50"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
