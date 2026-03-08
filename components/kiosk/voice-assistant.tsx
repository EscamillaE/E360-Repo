"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TalkingOrb } from "./talking-orb"
import { Mic, MicOff, Volume2, VolumeX, Globe } from "lucide-react"

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
  onstart: (() => void) | null
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

type Language = "es" | "en"
type AssistantState = "idle" | "listening" | "thinking" | "speaking"

interface VoiceAssistantProps {
  onNavigate?: (view: string, category?: string) => void
}

// Natural Mexican Spanish and American English responses
const responses: Record<Language, Record<string, string[]>> = {
  es: {
    greeting: [
      "Que onda! Soy Luna, tu asistente de Eventos 360. En que te echo la mano?",
      "Hola! Que gusto verte por aqui. Soy Luna, preguntame lo que quieras sobre nuestros servicios.",
      "Hey, que tal! Soy Luna de Eventos 360. Como te ayudo el dia de hoy?",
      "Bienvenido! Soy Luna, tu asistente virtual. Estoy aqui pa' lo que necesites.",
    ],
    dj: [
      "Oye, nuestros paquetes de DJ estan bien chidos! Tenemos desde el Magic que sale en $6,500 con bocinas y luces LED, hasta el Sweet Dream que es la onda completa con pantalla LED, pista personalizada y show de robot. Te va a encantar!",
      "Simon, los paquetes de DJ son lo maximo! El mas popular es el Party que incluye 4 luces moviles, subwoofers y esta increible para fiestas. Quieres que te cuente mas?",
      "Tenemos paquetes de DJ para todos los gustos y presupuestos. Desde el basico Magic hasta el Gold Bar que incluye hasta barra de cocteleria. Esta padrisimo!",
    ],
    effects: [
      "Los efectos especiales son lo mejor! Tenemos maquinas de fuego, chisperos de pirotecnia fria que quedan increibles para la entrada de los novios, canones de CO2 con confeti, y hasta show de laser. Todo queda super espectacular!",
      "Uy, los efectos son lo maximo para darle ese wow a tu evento! Los chisperos son lo mas solicitado, empiezan desde $385 cada uno. Y el show de fuegos artificiales esta impresionante!",
      "Te van a encantar los efectos! El CO2 con confeti esta bien padre para los momentos especiales, y la maquina de humo le da esa atmosfera de antro bien chida.",
    ],
    floors: [
      "Los pisos de baile estan increibles! El LED pixelado es el favorito, cambia de colores y patrones. Tambien tenemos pisos blancos super elegantes para bodas, y negros que quedan bien modernos. Todos son de 5 por 5 metros.",
      "Oye, los pisos LED son espectaculares! Imaginate bailar sobre luces de colores que van al ritmo de la musica. El blanco esta perfecto si quieres algo mas elegante.",
      "Tenemos pisos para todos los estilos! El pixel LED desde $8,800, el blanco desde $4,400, y puedes personalizarlo con tu diseno. Queda genial!",
    ],
    contact: [
      "Claro! Nos puedes escribir por WhatsApp al 442-795-3753 o mandarnos un correo a proyectos360.qro@gmail.com. Tambien puedes escanear el QR y te manda directo a nuestro WhatsApp. Facil!",
      "Para contactarnos solo escanea el codigo QR de WhatsApp y nos escribes directo. O si prefieres, marcanos al 442-795-3753. Estamos pa' servirte!",
      "Escaneando el QR te conectas directo con nosotros. Tambien estamos en Face e Insta como @eventos360mx. Siguenos!",
    ],
    quote: [
      "Para una cotizacion personalizada lo mejor es escribirnos por WhatsApp. Platicamos sobre tu evento y te armamos un paquete a tu medida. Sin compromiso!",
      "Orale! Te recomiendo que nos escribas por WhatsApp, nos cuentas de tu evento y te hacemos una cotizacion personalizada. Quieres que te muestre el QR?",
      "Cada evento es diferente, por eso hacemos cotizaciones personalizadas. Mandanos un mensajito y te armamos algo chido para tu fiesta!",
    ],
    social: [
      "Siguenos en Face e Insta como @eventos360mx! Ahi subimos videos de los eventos, detras de camaras y las ultimas novedades. Esta bien padre!",
      "Estamos en todas las redes! Facebook, Instagram, TikTok... busca @eventos360mx y dale follow. Veras lo increible que quedan los eventos!",
      "En redes sociales compartimos todo lo que hacemos. Escanea el QR de Instagram o Facebook y siguenos pa' que veas nuestro trabajo!",
    ],
    fallback: [
      "Ups, no cache bien lo que dijiste. Puedo ayudarte con info sobre paquetes de DJ, efectos especiales, pisos de baile o como contactarnos. Que te gustaria saber?",
      "Perdon, no te entendi bien. Preguntame sobre nuestros servicios, precios o como contactarnos y con gusto te ayudo!",
      "Hmm, no escuche bien. Intenta de nuevo o toca uno de los botones de abajo para preguntarme algo especifico.",
    ],
    goodbye: [
      "Sale, nos vemos! Si necesitas algo mas, aqui ando. Que te vaya chido!",
      "Va que va! Suerte con tu evento, va a quedar increible. Cualquier cosa, solo toca el orbe dorado!",
      "Listo! Fue un gusto ayudarte. Esperamos verte pronto en Eventos 360!",
    ],
    promo: [
      "Oye, aprovecha que estamos en la expo! Tenemos promociones especiales solo por estos dias. Pregunta a nuestros asesores!",
      "Tip: si contratas hoy, hay descuentos exclusivos de la expo. No dejes pasar la oportunidad!",
    ],
  },
  en: {
    greeting: [
      "Hey there! I'm Luna, your assistant from Eventos 360. What can I help you with?",
      "Hi! Great to see you here. I'm Luna, ask me anything about our services!",
      "What's up! I'm Luna from Eventos 360. How can I help you today?",
      "Welcome! I'm Luna, your virtual assistant. I'm here for whatever you need!",
    ],
    dj: [
      "Our DJ packages are awesome! We have everything from the Magic package at $6,500 pesos with speakers and LED lights, to the Sweet Dream which is the complete deal with LED screen, custom dance floor, and robot show. You're gonna love it!",
      "Yeah, the DJ packages are the best! The most popular is the Party package that includes 4 moving lights, subwoofers, and it's perfect for parties. Want me to tell you more?",
      "We've got DJ packages for every taste and budget. From the basic Magic to the Gold Bar that even includes a cocktail bar. It's super cool!",
    ],
    effects: [
      "Special effects are the best! We have fire machines, cold pyrotechnic sparklers that look amazing for wedding entrances, CO2 cannons with confetti, and even laser shows. Everything looks spectacular!",
      "Oh man, the effects are amazing to give that wow factor to your event! Sparklers are the most requested, starting at $385 each. And the fireworks show is impressive!",
      "You're gonna love the effects! The CO2 with confetti is super cool for special moments, and the smoke machine gives that awesome club atmosphere.",
    ],
    floors: [
      "The dance floors are incredible! The LED pixel one is the favorite, it changes colors and patterns. We also have super elegant white floors for weddings, and black ones that look really modern. All are 5 by 5 meters.",
      "Hey, the LED floors are spectacular! Imagine dancing on colored lights that sync with the music. The white one is perfect if you want something more elegant.",
      "We have floors for every style! The LED pixel from $8,800, white from $4,400, and you can customize it with your design. It looks great!",
    ],
    contact: [
      "Sure! You can message us on WhatsApp at 442-795-3753 or email us at proyectos360.qro@gmail.com. You can also scan the QR and it'll send you directly to our WhatsApp. Easy!",
      "To contact us just scan the WhatsApp QR code and message us directly. Or if you prefer, call us at 442-795-3753. We're here to help!",
      "Scanning the QR connects you directly with us. We're also on Facebook and Instagram as @eventos360mx. Follow us!",
    ],
    quote: [
      "For a personalized quote the best thing is to message us on WhatsApp. We'll talk about your event and put together a custom package. No commitment!",
      "Alright! I recommend messaging us on WhatsApp, tell us about your event and we'll make you a personalized quote. Want me to show you the QR?",
      "Every event is different, that's why we make personalized quotes. Send us a message and we'll put together something awesome for your party!",
    ],
    social: [
      "Follow us on Facebook and Instagram as @eventos360mx! We post event videos, behind the scenes, and the latest news. It's really cool!",
      "We're on all social media! Facebook, Instagram, TikTok... search for @eventos360mx and follow us. You'll see how amazing the events turn out!",
      "On social media we share everything we do. Scan the Instagram or Facebook QR and follow us to see our work!",
    ],
    fallback: [
      "Oops, I didn't quite catch that. I can help you with info about DJ packages, special effects, dance floors, or how to contact us. What would you like to know?",
      "Sorry, I didn't understand that. Ask me about our services, prices, or how to contact us and I'll be happy to help!",
      "Hmm, I didn't hear that well. Try again or tap one of the buttons below to ask me something specific.",
    ],
    goodbye: [
      "Alright, see you! If you need anything else, I'm here. Take care!",
      "You got it! Good luck with your event, it's gonna be amazing. If you need anything, just tap the golden orb!",
      "All done! It was great helping you. Hope to see you soon at Eventos 360!",
    ],
    promo: [
      "Hey, take advantage that we're at the expo! We have special promotions just for these days. Ask our advisors!",
      "Tip: if you book today, there are exclusive expo discounts. Don't miss the opportunity!",
    ],
  },
}

const keywords: Record<string, string[]> = {
  dj: ["dj", "musica", "music", "audio", "sonido", "sound", "bocina", "speaker", "paquete", "package", "magic", "party", "luxury", "black", "fancy", "fiesta"],
  effects: ["efecto", "effect", "fuego", "fire", "chispero", "sparkler", "co2", "humo", "smoke", "laser", "confeti", "confetti", "pirotecnia", "pyro", "llamas", "flames"],
  floors: ["piso", "floor", "baile", "dance", "led", "pixel", "blanco", "white", "negro", "black", "pista"],
  contact: ["contacto", "contact", "whatsapp", "telefono", "phone", "email", "correo", "llamar", "call", "mensaje", "message", "comunicar"],
  quote: ["cotiza", "quote", "precio", "price", "costo", "cost", "cuanto", "how much", "presupuesto", "budget", "cobran", "charge"],
  social: ["facebook", "instagram", "redes", "social", "seguir", "follow", "face", "insta", "tiktok"],
  greeting: ["hola", "hello", "hi", "buenos", "good", "saludos", "greetings", "que tal", "como estas", "hey", "que onda", "que pedo", "que paso"],
  goodbye: ["adios", "bye", "gracias", "thanks", "hasta", "chao", "nos vemos", "see you", "thank you", "vale", "ok bye"],
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
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

  const idlePrompts = {
    es: [
      "Toca el orbe dorado para hablar conmigo!",
      "Preguntame lo que quieras sobre nuestros servicios!",
      "Quieres saber de paquetes de DJ? Tocame!",
      "Los efectos especiales estan increibles, preguntame!",
    ],
    en: [
      "Tap the golden orb to talk to me!",
      "Ask me anything about our services!",
      "Want to know about DJ packages? Tap me!",
      "The special effects are amazing, ask me!",
    ],
  }

  const speak = useCallback((text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "es" ? "es-MX" : "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.05
    
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
        const responseArray = responses[language][key]
        if (responseArray && responseArray.length > 0) {
          return getRandomResponse(responseArray)
        }
      }
    }
    
    return getRandomResponse(responses[language].fallback)
  }, [language])

  const processInput = useCallback((input: string) => {
    setState("thinking")
    setTranscript(input)
    
    setTimeout(() => {
      const responseText = findResponse(input)
      setResponse(responseText)
      speak(responseText)
    }, 600)
  }, [findResponse, speak])

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
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
      }
    }, 30000)
  }, [state, isMuted, language])

  useEffect(() => {
    // Auto-greet on mount
    const timer = setTimeout(() => {
      const greetingText = getRandomResponse(responses[language].greeting)
      setResponse(greetingText)
      if (!isMuted) {
        speak(greetingText)
      }
    }, 1500)

    return () => {
      clearTimeout(timer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  const quickActions = [
    { label: language === "es" ? "Paquetes DJ" : "DJ Packages", query: "paquetes de dj" },
    { label: language === "es" ? "Efectos" : "Effects", query: "efectos especiales" },
    { label: language === "es" ? "Pisos LED" : "LED Floors", query: "pisos de baile" },
    { label: language === "es" ? "Cotizar" : "Get Quote", query: "quiero cotizar" },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Orb */}
      <TalkingOrb 
        state={state} 
        size={260} 
        onClick={handleOrbClick}
      />

      {/* Assistant name */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-1">
          <span className="gradient-neon-text">Luna</span>
        </h2>
        <p className="text-base text-muted-foreground">
          {language === "es" ? "Tu asistente virtual" : "Your virtual assistant"}
        </p>
      </div>

      {/* Response bubble */}
      {response && (
        <div className="max-w-md rounded-2xl border-2 border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-gold/30">
          <p className="text-base leading-relaxed text-foreground">{response}</p>
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
      <div className="flex flex-wrap justify-center gap-2">
        {quickActions.map((action) => (
          <button
            key={action.query}
            onClick={() => processInput(action.query)}
            className="rounded-full border-2 border-border bg-card/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10 active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="flex items-center gap-2 rounded-full border-2 border-border bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-gold active:scale-95"
        >
          <Globe className="h-4 w-4" />
          {language === "es" ? "Espanol" : "English"}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
            isMuted 
              ? "border-destructive/50 bg-destructive/10 text-destructive" 
              : "border-border bg-card/50 text-foreground hover:border-gold"
          }`}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {isMuted ? (language === "es" ? "Silenciado" : "Muted") : (language === "es" ? "Con sonido" : "Sound on")}
        </button>
      </div>
    </div>
  )
}
