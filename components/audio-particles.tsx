"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  opacity: number
  baseOpacity: number
  rotation: number
  rotationSpeed: number
}

export function AudioParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
  const logoRef = useRef<HTMLImageElement | null>(null)
  const [isAudioActive, setIsAudioActive] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const beatRef = useRef(0)

  const PARTICLE_COUNT = 60

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseSize = 12 + Math.random() * 28
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: baseSize,
        baseSize,
        opacity: 0.15 + Math.random() * 0.35,
        baseOpacity: 0.15 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      })
    }
    particlesRef.current = particles
  }, [])

  const startAudio = useCallback(async () => {
    try {
      const audioContext = new AudioContext()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>
      setIsAudioActive(true)
    } catch {
      // Microphone not available or denied - particles still animate
      setIsAudioActive(false)
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
      analyserRef.current = null
      dataArrayRef.current = null
      setIsAudioActive(false)
      setAudioLevel(0)
    }
  }, [])

  const getAudioLevel = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return 0
    const arr = dataArrayRef.current
    analyserRef.current.getByteFrequencyData(arr as unknown as Uint8Array<ArrayBuffer>)
    const data = arr

    // Focus on bass and mid frequencies for beat detection
    let bassSum = 0
    let midSum = 0
    const bassEnd = Math.floor(data.length * 0.15)
    const midEnd = Math.floor(data.length * 0.5)

    for (let i = 0; i < bassEnd; i++) bassSum += data[i]
    for (let i = bassEnd; i < midEnd; i++) midSum += data[i]

    const bassAvg = bassSum / bassEnd / 255
    const midAvg = midSum / (midEnd - bassEnd) / 255

    return Math.min(1, bassAvg * 1.5 + midAvg * 0.5)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.src = "/images/logo.png"
    logo.onload = () => {
      logoRef.current = logo
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)

      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const level = getAudioLevel()
      beatRef.current = level
      setAudioLevel(level)

      const particles = particlesRef.current
      const logoImg = logoRef.current

      for (const p of particles) {
        // Audio reactivity
        const audioBoost = 1 + level * 2.5
        const sizeBoost = p.baseSize * audioBoost
        p.size += (sizeBoost - p.size) * 0.15
        p.opacity = p.baseOpacity + level * 0.4

        // Movement with audio influence
        const speedBoost = 1 + level * 3
        p.x += p.vx * speedBoost
        p.y += p.vy * speedBoost
        p.rotation += p.rotationSpeed * (1 + level * 5)

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          p.vx += (dx / dist) * force * 0.3
          p.vy += (dy / dist) * force * 0.3
        }

        // Dampen velocity
        p.vx *= 0.98
        p.vy *= 0.98

        // Wrap around edges
        if (p.x < -50) p.x = w + 50
        if (p.x > w + 50) p.x = -50
        if (p.y < -50) p.y = h + 50
        if (p.y > h + 50) p.y = -50

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity

        if (logoImg) {
          const s = p.size
          ctx.drawImage(logoImg, -s / 2, -s / 2, s, s)
        } else {
          // Fallback golden circle
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(38, 92%, 50%, ${p.opacity})`
          ctx.fill()
        }

        ctx.restore()
      }

      // Draw connections between nearby particles with gold lines
      ctx.globalAlpha = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 120 + level * 80

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08 * (1 + level * 2)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(38, 92%, 50%, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles, getAudioLevel])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Audio toggle button */}
      <button
        onClick={isAudioActive ? stopAudio : startAudio}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-gold/30 bg-card/80 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:border-gold/60 hover:bg-card"
        aria-label={isAudioActive ? "Disable audio reactive mode" : "Enable audio reactive mode"}
      >
        {/* Audio bars visualization */}
        <div className="flex items-end gap-0.5 h-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 rounded-full transition-all duration-100"
              style={{
                height: isAudioActive
                  ? `${Math.max(4, audioLevel * 16 * (0.5 + Math.random() * 0.5))}px`
                  : "4px",
                backgroundColor: isAudioActive
                  ? `hsl(38, 92%, ${50 + audioLevel * 20}%)`
                  : "hsl(var(--muted-foreground))",
              }}
            />
          ))}
        </div>
        <span className="text-foreground">
          {isAudioActive ? "Audio ON" : "Audio OFF"}
        </span>
      </button>
    </>
  )
}
