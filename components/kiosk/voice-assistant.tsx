"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TalkingOrb } from "./talking-orb"
import { Mic, MicOff, Volume2, VolumeX, Globe } from "lucide-react"

type Language = "es" | "en"
type AssistantState = "idle" | "listening" | "thinking" | "speaking"

interface VoiceAssistantProps {
  onNavigate?: (view: string, category?: string) => void
}

const responses: Record<Language, Record<string, string>> = {
  es: {
    greeting: "Hola! Soy Luna, tu asistente virtual de Eventos 360. Puedo ayudarte a explorar nuestros servicios de DJ, efectos especiales, pisos de baile y mucho mas. Que te gustaria saber?",
    dj: "Tenemos increibles paquetes de DJ desde $6,500 hasta $55,440 pesos. Nuestro paquete Magic incluye bocinas, iluminacion LED y un DJ profesional. El paquete Sweet Dream es nuestra opcion mas completa con pantalla LED, pista personalizada y show de robot.",
    effects: "Nuestros efectos especiales incluyen maquinas de fuego, chisperos de pirotecnia fria, canones de CO2, maquinas de humo y laser. Los precios van desde $385 por chispero hasta $6,600 por hora de drones iluminados.",
    floors: "Ofrecemos pisos de baile LED pixelados desde $8,800, pisos blancos desde $4,400, y pisos negros desde $3,300. Todos son de 5 por 5 metros y pueden personalizarse con el diseno de tu evento.",
    contact: "Puedes contactarnos por WhatsApp al 442-795-3753 o por email a proyectos360.qro@gmail.com. Escanea el codigo QR para enviarnos un mensaje directo!",
    quote: "Para una cotizacion personalizada, te recomiendo contactar a nuestro equipo. Podemos crear paquetes a la medida de tu evento. Quieres que te muestre como contactarnos?",
    social: "Nos puedes seguir en Facebook e Instagram como @eventos360mx. Ahi compartimos videos de nuestros eventos y las ultimas novedades!",
    fallback: "Disculpa, no entendi bien. Puedo ayudarte con informacion sobre paquetes de DJ, efectos especiales, pisos de baile, o como contactarnos. Que te gustaria saber?",
    goodbye: "Fue un placer ayudarte! Si tienes mas preguntas, solo toca el orbe dorado. Que tengas un excelente dia!",
  },
  en: {
    greeting: "Hello! I'm Luna, your virtual assistant from Eventos 360. I can help you explore our DJ services, special effects, dance floors, and much more. What would you like to know?",
    dj: "We have amazing DJ packages from $6,500 to $55,440 pesos. Our Magic package includes speakers, LED lighting, and a professional DJ. The Sweet Dream package is our most complete option with LED screen, custom dance floor, and robot show.",
    effects: "Our special effects include fire machines, cold pyrotechnic sparklers, CO2 cannons, smoke machines, and laser. Prices range from $385 per sparkler to $6,600 per hour for illuminated drones.",
    floors: "We offer LED pixel dance floors from $8,800, white floors from $4,400, and black floors from $3,300. All are 5 by 5 meters and can be customized with your event design.",
    contact: "You can contact us via WhatsApp at 442-795-3753 or by email at proyectos360.qro@gmail.com. Scan the QR code to send us a direct message!",
    quote: "For a personalized quote, I recommend contacting our team. We can create custom packages for your event. Would you like me to show you how to contact us?",
    social: "You can follow us on Facebook and Instagram as @eventos360mx. There we share videos of our events and the latest news!",
    fallback: "Sorry, I didn't quite understand. I can help you with information about DJ packages, special effects, dance floors, or how to contact us. What would you like to know?",
    goodbye: "It was a pleasure helping you! If you have more questions, just tap the golden orb. Have a great day!",
  },
}

const keywords: Record<string, string[]> = {
  dj: ["dj", "musica", "music", "audio", "sonido", "sound", "bocina", "speaker", "paquete", "package", "magic", "party", "luxury", "black", "fancy"],
  effects: ["efecto", "effect", "fuego", "fire", "chispero", "sparkler", "co2", "humo", "smoke", "laser", "confeti", "confetti", "pirotecnia"],
  floors: ["piso", "floor", "baile", "dance", "led", "pixel", "blanco", "white", "negro", "black"],
  contact: ["contacto", "contact", "whatsapp", "telefono", "phone", "email", "correo", "llamar", "call", "mensaje", "message"],
  quote: ["cotiza", "quote", "precio", "price", "costo", "cost", "cuanto", "how much", "presupuesto", "budget"],
  social: ["facebook", "instagram", "redes", "social", "seguir", "follow"],
  greeting: ["hola", "hello", "hi", "buenos", "good", "saludos", "greetings", "que tal", "como estas"],
  goodbye: ["adios", "bye", "gracias", "thanks", "hasta", "chao", "nos vemos", "see you"],
}

export function VoiceAssistant({ onNavigate }: VoiceAssistantProps) {
  const [state, setState] = useState<AssistantState>("idle")
  const [language, setLanguage] = useState<Language>("es")
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Idle prompts
  const idlePrompts = {
    es: [
      "Toca el orbe dorado para hablar conmigo!",
      "Puedo ayudarte a encontrar el paquete perfecto para tu evento.",
      "Preguntame sobre nuestros efectos especiales!",
      "Quieres ver nuestros pisos de baile LED?",
    ],
    en: [
      "Tap the golden orb to talk to me!",
      "I can help you find the perfect package for your event.",
      "Ask me about our special effects!",
      "Want to see our LED dance floors?",
    ],
  }

  const speak = useCallback((text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "es" ? "es-MX" : "en-US"
    utterance.rate = 0.95
    utterance.pitch = 1.1
    
    utterance.onstart = () => setState("speaking")
    utterance.onend = () => {
      setState("idle")
      startIdleTimer()
    }
    utterance.onerror = () => setState("idle")

    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isMuted, language])

  const findResponse = useCallback((input: string): string => {
    const lowerInput = input.toLowerCase()
    
    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(word => lowerInput.includes(word))) {
        return responses[language][key] || responses[language].fallback
      }
    }
    
    return responses[language].fallback
  }, [language])

  const processInput = useCallback((input: string) => {
    setState("thinking")
    setTranscript(input)
    
    setTimeout(() => {
      const responseText = findResponse(input)
      setResponse(responseText)
      speak(responseText)
    }, 500)
  }, [findResponse, speak])

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      // Fallback for browsers without speech recognition
      processInput(language === "es" ? "hola" : "hello")
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language === "es" ? "es-MX" : "en-US"

    recognition.onstart = () => {
      setState("listening")
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      processInput(transcript)
    }

    recognition.onerror = () => {
      setState("idle")
      startIdleTimer()
    }

    recognition.onend = () => {
      if (state === "listening") {
        setState("idle")
        startIdleTimer()
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [language, processInput, state])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    window.speechSynthesis?.cancel()
    setState("idle")
  }, [])

  const handleOrbClick = useCallback(() => {
    if (state === "idle") {
      startListening()
    } else if (state === "listening") {
      stopListening()
    } else if (state === "speaking") {
      stopListening()
    }
  }, [state, startListening, stopListening])

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    
    idleTimerRef.current = setTimeout(() => {
      if (state === "idle" && !isMuted) {
        const prompts = idlePrompts[language]
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
        setResponse(randomPrompt)
        speak(randomPrompt)
      }
    }, 45000)
  }, [state, isMuted, language, speak])

  useEffect(() => {
    startIdleTimer()
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  const quickActions = [
    { label: language === "es" ? "Paquetes DJ" : "DJ Packages", query: "dj" },
    { label: language === "es" ? "Efectos" : "Effects", query: "efectos especiales" },
    { label: language === "es" ? "Pisos" : "Floors", query: "pisos de baile" },
    { label: language === "es" ? "Contacto" : "Contact", query: "contacto" },
  ]

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Orb */}
      <TalkingOrb 
        state={state} 
        size={280} 
        onClick={handleOrbClick}
      />

      {/* Assistant name */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-1">
          <span className="gradient-neon-text">Luna</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          {language === "es" ? "Tu asistente virtual" : "Your virtual assistant"}
        </p>
      </div>

      {/* Response bubble */}
      {response && (
        <div className="max-w-lg rounded-2xl border border-gold/20 bg-card/80 p-6 backdrop-blur-sm">
          <p className="text-lg leading-relaxed text-foreground">{response}</p>
        </div>
      )}

      {/* Transcript */}
      {transcript && state !== "idle" && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "es" ? "Escuche:" : "I heard:"}
          </p>
          <p className="text-base font-medium text-gold">{`"${transcript}"`}</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {quickActions.map((action) => (
          <button
            key={action.query}
            onClick={() => processInput(action.query)}
            className="rounded-full border border-gold/30 bg-card/50 px-5 py-2.5 text-base font-medium text-foreground transition-all hover:border-gold hover:bg-gold/10 active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-gold/50 active:scale-95"
        >
          <Globe className="h-4 w-4" />
          {language === "es" ? "Espanol" : "English"}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
            isMuted 
              ? "border-destructive/50 bg-destructive/10 text-destructive" 
              : "border-border bg-card/50 text-foreground hover:border-gold/50"
          }`}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {isMuted ? (language === "es" ? "Silenciado" : "Muted") : (language === "es" ? "Con sonido" : "Sound on")}
        </button>
      </div>
    </div>
  )
}
