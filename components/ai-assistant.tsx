"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { 
  MessageSquare, X, Send, Loader2, Sparkles, Mic, MicOff, 
  Volume2, VolumeX, Table, List, Zap, DollarSign, Star,
  Music, Flame, Camera, ChevronRight
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

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

// Natural conversation responses in Mexican Spanish and American English
const naturalResponses = {
  es: {
    greetings: [
      "Hola! Que onda, como te puedo ayudar hoy?",
      "Que tal! Listo para armar tu evento de diez?",
      "Hey! Bienvenido a Eventos 360, que se te ofrece?",
    ],
    thinking: [
      "Dejame checarlo...",
      "Un momento, ya lo busco...",
      "Va que va, dejame ver...",
    ],
    packages: [
      "Tenemos varios paquetes bien chidos! Desde el basico Magic hasta el Sweet Dream que es lo maximo.",
      "Mira, nuestros paquetes van desde $4,830 hasta eventos de lujo completos. Cual te late mas?",
    ],
    effects: [
      "Los efectos especiales estan increibles - fuego, CO2, chisperos, laser... todo para que tu fiesta explote!",
      "Tenemos de todo: maquinas de fuego, canones de CO2 con confeti, chisperos frios, humo y laser. Que te gustaria incluir?",
    ],
    promo: [
      "Oye, ahorita tenemos promociones bien buenas! Preguntame cual te conviene.",
      "Hay descuentos chidos si armas paquete completo. Te platico?",
    ],
  },
  en: {
    greetings: [
      "Hey there! How can I help you plan your event today?",
      "What's up! Ready to create an amazing party?",
      "Hi! Welcome to Eventos 360, what can I do for you?",
    ],
    thinking: [
      "Let me check that out...",
      "One sec, looking it up...",
      "Sure thing, let me see...",
    ],
    packages: [
      "We've got awesome packages! From the basic Magic all the way up to the Sweet Dream premium experience.",
      "Our packages range from $4,830 to full luxury events. What sounds good to you?",
    ],
    effects: [
      "Special effects are fire - literally! We've got flames, CO2, cold sparklers, laser... everything to make your party pop!",
      "We have it all: fire machines, CO2 cannons with confetti, cold sparklers, smoke and laser. What would you like?",
    ],
    promo: [
      "Hey, we've got some great deals going on right now! Want me to tell you about them?",
      "There are sweet discounts if you bundle services. Want the details?",
    ],
  },
}

// Format message with rich elements
function RichMessage({ text, locale }: { text: string; locale: "es" | "en" }) {
  // Detect if message contains price/package info
  const hasPrice = /\$[\d,]+|MXN|pesos/i.test(text)
  const hasList = text.includes("•") || text.includes("-") || text.includes("1.")
  const hasPackage = /paquete|package|magic|party|luxury|fancy/i.test(text)
  
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/)
  
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => {
        // Check if paragraph is a list
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
        
        // Check for price highlights
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
      
      {/* Quick action chips if package mentioned */}
      {hasPackage && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
            <Zap className="h-3 w-3" />
            {locale === "es" ? "Ver detalles" : "View details"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <Star className="h-3 w-3" />
            {locale === "es" ? "Comparar" : "Compare"}
          </span>
        </div>
      )}
    </div>
  )
}

export function AiAssistant() {
  const { t, locale } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = locale === "es" ? "es-MX" : "en-US"
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        // Auto-send voice input
        if (transcript.trim()) {
          sendMessage({ text: transcript })
          setInput("")
        }
      }
      
      recognitionRef.current.onend = () => setIsListening(false)
      recognitionRef.current.onerror = () => setIsListening(false)
    }
  }, [locale, sendMessage])

  // Speak the last assistant message
  const speakMessage = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale === "es" ? "es-MX" : "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [locale, voiceEnabled])

  // Auto-speak new messages
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
      recognitionRef.current.lang = locale === "es" ? "es-MX" : "en-US"
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
  }

  const quickSuggestions = locale === "es" 
    ? [
        { icon: Music, label: "Paquetes DJ", query: "Cuales son los paquetes de DJ?" },
        { icon: Flame, label: "Efectos", query: "Que efectos especiales tienen?" },
        { icon: Camera, label: "Cabina 360", query: "Como funciona la cabina 360?" },
        { icon: DollarSign, label: "Cotizar", query: "Quiero cotizar mi evento" },
      ]
    : [
        { icon: Music, label: "DJ Packages", query: "What DJ packages do you have?" },
        { icon: Flame, label: "Effects", query: "What special effects are available?" },
        { icon: Camera, label: "360 Booth", query: "How does the 360 booth work?" },
        { icon: DollarSign, label: "Quote", query: "I want to get a quote" },
      ]

  return (
    <>
      {/* Floating trigger button - Voice first design */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full border-2 border-gold/30 bg-card/90 px-5 py-3 text-sm font-medium backdrop-blur-md transition-all hover:border-gold hover:shadow-[0_0_30px_hsl(32,100%,52%,0.3)]",
          isOpen && "hidden"
        )}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
          <Sparkles className="relative h-5 w-5 text-gold" />
        </div>
        <span className="text-foreground">{locale === "es" ? "Habla con Luna" : "Talk to Luna"}</span>
        <Mic className="h-4 w-4 text-muted-foreground" />
      </button>

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
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-orange to-gold">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                {isSpeaking && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Luna</h3>
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? "Tu asesora de eventos" : "Your event advisor"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {/* Voice-first prompt */}
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
                  {locale === "es" ? "Hola! Soy Luna" : "Hey! I'm Luna"}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[300px] mb-6">
                  {locale === "es" 
                    ? "Preguntame lo que quieras sobre eventos, paquetes, precios o efectos especiales. Puedes hablarme o escribir!"
                    : "Ask me anything about events, packages, prices, or special effects. You can talk to me or type!"}
                </p>
                
                {/* Quick suggestions as cards */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  {quickSuggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage({ text: s.query })}
                      className="flex items-center gap-2 rounded-xl border-2 border-border bg-card/50 px-3 py-2.5 text-left transition-all hover:border-gold/40 hover:bg-card"
                    >
                      <s.icon className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground">{s.label}</span>
                    </button>
                  ))}
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
                      <RichMessage text={text} locale={locale} />
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border-2 border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-gold" />
                  <span>{locale === "es" ? "Dejame ver..." : "Let me check..."}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input with voice button */}
          <div className="border-t border-border px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              {/* Voice input button */}
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
                placeholder={locale === "es" ? "Escribe o habla..." : "Type or speak..."}
                disabled={isLoading}
                className="flex-1 rounded-xl border-2 border-border bg-card/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-neon-orange to-gold text-white transition-all hover:shadow-[0_0_20px_hsl(32,100%,52%,0.4)] disabled:opacity-40"
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
