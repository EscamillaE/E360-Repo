'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function HeroAudioParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [isAudioActive, setIsAudioActive] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const animationIdRef = useRef<number | null>(null)
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null)

  interface Particle {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    vz: number
    size: number
    opacity: number
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = []
      const count = 100
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 100 + Math.random() * 50
        particlesRef.current.push({
          x: canvas.width / 2 / window.devicePixelRatio + Math.cos(angle) * radius,
          y: canvas.height / 2 / window.devicePixelRatio + Math.sin(angle) * radius,
          z: Math.random() * 200 - 100,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }
    initializeParticles()

    // Animation loop
    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)'
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      const centerX = canvas.width / 2 / window.devicePixelRatio
      const centerY = canvas.height / 2 / window.devicePixelRatio

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Gravity towards center
        const dx = centerX - particle.x
        const dy = centerY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0) {
          particle.vx += (dx / distance) * 0.1 * (1 + audioLevel)
          particle.vy += (dy / distance) * 0.1 * (1 + audioLevel)
        }

        // Damping
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.vz *= 0.98

        // Perspective
        const scale = 200 / (200 + particle.z)
        const x = centerX + (particle.x - centerX) * scale
        const y = centerY + (particle.y - centerY) * scale
        const size = particle.size * scale

        // Draw particle
        const hue = (Math.atan2(particle.y - centerY, particle.x - centerX) * 180) / Math.PI + 180
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${particle.opacity * (0.5 + audioLevel)})`
        ctx.beginPath()
        ctx.arc(x, y, Math.max(size, 1), 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw center orb
      const orbRadius = 30 + audioLevel * 20
      const orbGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbRadius)
      orbGradient.addColorStop(0, `hsla(38, 100%, 50%, ${0.8 + audioLevel * 0.2})`)
      orbGradient.addColorStop(1, `hsla(38, 100%, 50%, ${0.1})`)
      ctx.fillStyle = orbGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw glow ring
      ctx.strokeStyle = `hsla(38, 100%, 60%, ${0.3 + audioLevel * 0.3})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius * 0.8, 0, Math.PI * 2)
      ctx.stroke()

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [audioLevel])

  const handleAudioToggle = async () => {
    if (isAudioActive) {
      // Stop audio
      if (microphone.current?.mediaStream) {
        microphone.current.mediaStream.getTracks().forEach(track => track.stop())
      }
      setIsAudioActive(false)
      setAudioLevel(0)
    } else {
      // Start audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        const analyzer = audioContext.createAnalyser()
        analyzer.fftSize = 256
        analyzerRef.current = analyzer

        const source = audioContext.createMediaStreamSource(stream)
        microphone.current = source
        source.connect(analyzer)

        const bufferLength = analyzer.frequencyBinCount
        const dataArray = new Uint8Array(new ArrayBuffer(bufferLength))
        dataArrayRef.current = dataArray

        const updateLevel = () => {
          if (analyzerRef.current && dataArrayRef.current) {
            analyzerRef.current.getByteFrequencyData(dataArrayRef.current)
            const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length
            setAudioLevel(average / 255)
          }
          requestAnimationFrame(updateLevel)
        }
        updateLevel()

        setIsAudioActive(true)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 gradient-neon-text">
          EVENTOS 360
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Producción de eventos integral con tecnología de punta
        </p>
      </div>

      {/* Audio toggle button */}
      <button
        onClick={handleAudioToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-gold/30 bg-card/90 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:border-gold/60 hover:bg-card/95"
        aria-label={isAudioActive ? 'Disable audio reactive mode' : 'Enable audio reactive mode'}
      >
        {isAudioActive ? (
          <>
            <Volume2 className="h-4 w-4 text-gold animate-pulse" />
            <span className="text-foreground">Audio Activo</span>
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Habilitar Audio</span>
          </>
        )}
      </button>
    </div>
  )
}
