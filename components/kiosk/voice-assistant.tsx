"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { TalkingOrb } from "./talking-orb"
import { Mic, MicOff, Volume2, VolumeX, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

type Language = "es-MX" | "en-US"

interface VoiceAssistantProps {
  onNavigate?: (destination: string) => void
  className?: string
}

// Voice profile for Luna - bilingual assistant
const VOICE_PROFILES = {
  "es-MX": {
    name: "Luna",
    greeting: "¡Hola! Soy Luna, tu asistente virtual de Eventos 360. ¿En qué puedo ayudarte hoy?",
    prompts: {
      products: "Con mucho gusto te cuento sobre nuestros productos. Tenemos paquetes de DJ desde 4,830 pesos, cabinas 360, efectos especiales, shows de robot LED y mucho más. ¿Qué tipo de evento estás planeando?",
      services: "Ofrecemos servicios completos para tu evento: audio profesional, iluminación, efectos especiales, pistas de baile LED, cabinas fotográficas y catering. ¿Te gustaría saber más sobre alguno?",
      navigation: "Puedes explorar nuestro catálogo tocando la pantalla, o preguntarme directamente sobre precios, paquetes o disponibilidad. También puedes escanear los códigos QR para seguirnos en redes sociales.",
      social: "Síguenos en Facebook e Instagram para ver nuestros eventos más recientes. También puedes contactarnos por WhatsApp para una cotización personalizada. Los códigos QR están aquí a tu derecha.",
      quote: "Para una cotización, necesito saber: ¿Qué tipo de evento es? ¿Para cuántas personas? ¿Y cuál es la fecha aproximada? Con eso te puedo dar un estimado.",
      default: "Puedo ayudarte con información sobre productos, servicios, precios y cotizaciones. ¿Qué te gustaría saber?",
    },
  },
  "en-US": {
    name: "Luna",
    greeting: "Hi! I'm Luna, your virtual assistant from Eventos 360. How can I help you today?",
    prompts: {
      products: "I'd be happy to tell you about our products. We have DJ packages starting at 4,830 pesos, 360 booths, special effects, LED robot shows, and much more. What type of event are you planning?",
      services: "We offer complete services for your event: professional audio, lighting, special effects, LED dance floors, photo booths, and catering. Would you like to know more about any of these?",
      navigation: "You can explore our catalog by touching the screen, or ask me directly about prices, packages, or availability. You can also scan the QR codes to follow us on social media.",
      social: "Follow us on Facebook and Instagram to see our most recent events. You can also contact us on WhatsApp for a personalized quote. The QR codes are here on your right.",
      quote: "For a quote, I need to know: What type of event is it? How many people? And what's the approximate date? With that, I can give you an estimate.",
      default: "I can help you with information about products, services, prices, and quotes. What would you like to know?",
    },
  },
}

// Keywords to detect intent
const INTENT_KEYWORDS = {
  products: ["producto", "productos", "paquete", "paquetes", "dj", "cabina", "360", "robot", "led", "product", "package", "booth"],
  services: ["servicio", "servicios", "ofrecen", "tienen", "service", "services", "offer", "what do you"],
  navigation: ["donde", "como", "navegar", "encontrar", "where", "how", "find", "navigate"],
  social: ["facebook", "instagram", "whatsapp", "redes", "social", "seguir", "follow"],
  quote: ["cotizacion", "cotizar", "precio", "costo", "cuanto", "quote", "price", "cost", "how much"],
}

export function VoiceAssistant({ onNavigate, className }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [language, setLanguage] = useState<Language>("es-MX")
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [hasGreeted, setHasGreeted] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const profile = VOICE_PROFILES[language]

  // Detect intent from transcript
  const detectIntent = useCallback((text: string): keyof typeof INTENT_KEYWORDS | "default" => {
    const lowerText = text.toLowerCase()
    
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent as keyof typeof INTENT_KEYWORDS
      }
    }
    
    return "default"
  }, [])

  // Speak text using Web Speech API
  const speak = useCallback((text: string) => {
    if (isMuted || !window.speechSynthesis) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 0.95
    utterance.pitch = 1.1
    utterance.volume = 1

    // Try to find a natural voice for the language
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      v => v.lang.startsWith(language.split("-")[0]) && (v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Neural"))
    ) || voices.find(v => v.lang.startsWith(language.split("-")[0]))
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      // Auto-listen after speaking
      setTimeout(() => {
        if (!isMuted) startListening()
      }, 500)
    }
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [language, isMuted])

  // Handle voice input processing
  const processVoiceInput = useCallback((text: string) => {
    setIsThinking(true)
    setTranscript(text)

    // Simulate brief processing time
    setTimeout(() => {
      const intent = detectIntent(text)
      const responseText = profile.prompts[intent]
      
      setResponse(responseText)
      setIsThinking(false)
      speak(responseText)
    }, 500)
  }, [detectIntent, profile.prompts, speak])

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setIsListening(false)
      processVoiceInput(text)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [language, processVoiceInput])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      startListening()
    }
  }, [isListening, isSpeaking, startListening, stopListening])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!isMuted) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setIsMuted(!isMuted)
  }, [isMuted])

  // Toggle language
  const toggleLanguage = useCallback(() => {
    const newLang = language === "es-MX" ? "en-US" : "es-MX"
    setLanguage(newLang)
    const newProfile = VOICE_PROFILES[newLang]
    setResponse("")
    setTranscript("")
    
    // Greet in new language
    setTimeout(() => {
      speak(newProfile.greeting)
    }, 300)
  }, [language, speak])

  // Initial greeting on mount
  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    // Greeting after a short delay
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        speak(profile.greeting)
        setHasGreeted(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [hasGreeted, profile.greeting, speak])

  // Idle prompt every 30 seconds
  useEffect(() => {
    const startIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      
      idleTimeoutRef.current = setTimeout(() => {
        if (!isListening && !isSpeaking && !isThinking) {
          const idlePrompts = language === "es-MX" 
            ? ["¿Necesitas ayuda con algo?", "Estoy aquí si tienes alguna pregunta.", "¿Te gustaría conocer nuestros paquetes?"]
            : ["Need help with anything?", "I'm here if you have any questions.", "Would you like to know about our packages?"]
          
          const randomPrompt = idlePrompts[Math.floor(Math.random() * idlePrompts.length)]
          speak(randomPrompt)
        }
      }, 45000)
    }

    startIdleTimer()

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    }
  }, [isListening, isSpeaking, isThinking, language, speak])

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* The Orb */}
      <TalkingOrb
        isListening={isListening}
        isSpeaking={isSpeaking}
        isThinking={isThinking}
        size="lg"
        onClick={toggleListening}
      />

      {/* Assistant name and status */}
      <div className="mt-4 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          {profile.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "es-MX" ? "Asistente Virtual" : "Virtual Assistant"}
        </p>
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="mt-4 max-w-sm rounded-xl bg-secondary/50 px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "es-MX" ? "Escuché:" : "I heard:"}
          </p>
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}

      {/* Response display */}
      {response && !isSpeaking && (
        <div className="mt-3 max-w-sm rounded-xl bg-gold/10 border border-gold/20 px-4 py-3 text-center">
          <p className="text-sm text-foreground leading-relaxed">{response}</p>
        </div>
      )}

      {/* Control buttons */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={toggleMute}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border transition-all",
            isMuted 
              ? "border-destructive/30 bg-destructive/10 text-destructive" 
              : "border-gold/30 bg-card text-gold hover:bg-gold/10"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleListening}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all",
            isListening
              ? "border-green-500 bg-green-500/20 text-green-400 animate-pulse"
              : "border-gold bg-gold/10 text-gold hover:bg-gold/20"
          )}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        <button
          onClick={toggleLanguage}
          className="flex h-12 items-center gap-2 rounded-full border border-gold/30 bg-card px-4 text-sm font-medium text-foreground transition-all hover:bg-gold/10"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 text-gold" />
          {language === "es-MX" ? "ES" : "EN"}
        </button>
      </div>

      {/* Quick action hints */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {(language === "es-MX" 
          ? ["Productos", "Cotización", "Redes sociales"]
          : ["Products", "Quote", "Social media"]
        ).map((hint) => (
          <button
            key={hint}
            onClick={() => processVoiceInput(hint)}
            className="rounded-full border border-gold/20 bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-gold/40 hover:text-foreground"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  )
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
