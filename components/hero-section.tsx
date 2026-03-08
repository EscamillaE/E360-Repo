"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useApp } from "@/components/providers"
import { ParticlesBackground } from "@/components/particles-background"

// Balloon component that responds to microphone input
function MicrophoneBalloons({ micActive }: { micActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const balloonsRef = useRef<Array<{
    x: number
    y: number
    size: number
    baseSize: number
    color: string
    vx: number
    vy: number
    inflation: number
  }>>([])
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  // Initialize balloons
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const colors = [
      "hsla(32, 100%, 52%, 0.6)",   // Gold
      "hsla(25, 100%, 55%, 0.6)",   // Neon orange
      "hsla(42, 100%, 58%, 0.5)",   // Neon yellow
      "hsla(38, 100%, 50%, 0.5)",   // Gold light
    ]
    
    // Create balloon shapes (like logo balloons)
    balloonsRef.current = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseSize: 30 + Math.random() * 40,
      size: 30 + Math.random() * 40,
      color: colors[i % colors.length],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.3,
      inflation: 0,
    }))
  }, [])

  // Setup microphone
  useEffect(() => {
    if (!micActive) return
    
    const setupMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
        analyserRef.current.fftSize = 256
        const bufferLength = analyserRef.current.frequencyBinCount
        dataArrayRef.current = new Uint8Array(bufferLength)
      } catch (err) {
        console.error("Microphone access denied:", err)
      }
    }
    
    setupMic()
    
    return () => {
      audioContextRef.current?.close()
    }
  }, [micActive])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      // Get audio level
      let audioLevel = 0
      if (analyserRef.current && dataArrayRef.current && micActive) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)
        audioLevel = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length / 255
      }
      
      balloonsRef.current.forEach((balloon) => {
        // Inflate based on audio
        const targetInflation = micActive ? audioLevel * 30 : 0
        balloon.inflation += (targetInflation - balloon.inflation) * 0.1
        balloon.size = balloon.baseSize + balloon.inflation
        
        // Move
        balloon.x += balloon.vx
        balloon.y += balloon.vy
        
        // Bounce off edges
        if (balloon.x < 0 || balloon.x > canvas.offsetWidth) balloon.vx *= -1
        if (balloon.y < 0 || balloon.y > canvas.offsetHeight) balloon.vy *= -1
        
        // Keep in bounds
        balloon.x = Math.max(0, Math.min(canvas.offsetWidth, balloon.x))
        balloon.y = Math.max(0, Math.min(canvas.offsetHeight, balloon.y))
        
        // Draw balloon
        ctx.beginPath()
        ctx.ellipse(balloon.x, balloon.y, balloon.size * 0.8, balloon.size, 0, 0, Math.PI * 2)
        ctx.fillStyle = balloon.color
        ctx.fill()
        
        // Draw string
        ctx.beginPath()
        ctx.moveTo(balloon.x, balloon.y + balloon.size)
        ctx.quadraticCurveTo(
          balloon.x + 10,
          balloon.y + balloon.size + 20,
          balloon.x,
          balloon.y + balloon.size + 40
        )
        ctx.strokeStyle = balloon.color
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Add highlight
        ctx.beginPath()
        ctx.ellipse(balloon.x - balloon.size * 0.3, balloon.y - balloon.size * 0.3, balloon.size * 0.2, balloon.size * 0.15, -0.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [micActive])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}

export function HeroSection() {
  const { t } = useApp()
  const [isVisible, setIsVisible] = useState(false)
  const [micActive, setMicActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      id="inicio"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Gradient Background - Neon Orange to Gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/5 via-background to-gold/5 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-orange/10 via-transparent to-transparent z-0" />
      
      {/* Particles */}
      <ParticlesBackground />
      
      {/* Microphone-responsive Balloons */}
      <MicrophoneBalloons micActive={micActive} />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Tagline */}
        <p
          className={`gradient-neon-text mb-6 text-[11px] font-medium uppercase tracking-[0.35em] transition-all delay-300 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.tagline}
        </p>

        {/* Heading */}
        <h1
          className={`mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground transition-all delay-500 duration-700 md:text-6xl lg:text-7xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-balance">
            {t.hero.heading1}
            <br />
            <span className="gradient-neon-text">{t.hero.heading2}</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`mb-10 max-w-lg text-base leading-relaxed text-muted-foreground transition-all delay-700 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:gap-4 transition-all delay-[900ms] duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/catalogo"
            className="btn-neon inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_hsl(32,100%,52%,0.3)] hover:shadow-[0_0_40px_hsl(32,100%,52%,0.5)] transition-shadow"
          >
            {t.hero.cta1}
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full border-2 border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-gold hover:shadow-[0_0_25px_hsl(32,100%,52%,0.2)]"
          >
            {t.hero.cta2}
          </Link>
        </div>

        {/* Mic activation hint */}
        <button
          onClick={() => setMicActive(!micActive)}
          className={`mt-6 text-xs text-muted-foreground hover:text-gold transition-colors ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {micActive ? "🎤 Balloons listening..." : "Click to activate balloon mic"}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
