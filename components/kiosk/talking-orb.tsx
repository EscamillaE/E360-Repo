"use client"

import { useEffect, useRef, useState } from "react"

type OrbState = "idle" | "listening" | "speaking" | "thinking"

interface TalkingOrbProps {
  state?: OrbState
  size?: number
  onClick?: () => void
}

export function TalkingOrb({ state = "idle", size = 260, onClick }: TalkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isHovered, setIsHovered] = useState(false)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * size,
          y: Math.random() * size,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    let time = 0
    const centerX = size / 2
    const centerY = size / 2
    const baseRadius = size * 0.3

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, size, size)

      // Background particles (always visible, more active when speaking)
      const particleSpeed = state === "speaking" ? 2.5 : state === "listening" ? 1.5 : 0.8
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx * particleSpeed
        p.y += p.vy * particleSpeed

        // Bounce off edges
        if (p.x < 0 || p.x > size) p.vx *= -1
        if (p.y < 0 || p.y > size) p.vy *= -1

        // Attract to center when idle
        if (state === "idle") {
          const dx = centerX - p.x
          const dy = centerY - p.y
          p.vx += dx * 0.0003
          p.vy += dy * 0.0003
        }

        const dist = Math.hypot(p.x - centerX, p.y - centerY)
        const alpha = p.alpha * Math.max(0, 1 - dist / (size * 0.6))
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(32, 100%, 55%, ${alpha})`
        ctx.fill()
      })

      // Multiple glow layers with pulsing
      const pulseIntensity = state === "speaking" ? 0.3 : state === "listening" ? 0.2 : 0.1
      const glowPulse = 1 + Math.sin(time * 3) * pulseIntensity
      
      for (let i = 6; i >= 0; i--) {
        const glowRadius = (baseRadius + i * 20) * glowPulse
        const alpha = 0.06 - i * 0.008
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowRadius
        )
        
        if (state === "listening") {
          gradient.addColorStop(0, `hsla(142, 70%, 50%, ${alpha * 1.5})`)
          gradient.addColorStop(0.5, `hsla(120, 60%, 45%, ${alpha})`)
          gradient.addColorStop(1, "transparent")
        } else if (state === "thinking") {
          gradient.addColorStop(0, `hsla(220, 90%, 60%, ${alpha * 1.5})`)
          gradient.addColorStop(0.5, `hsla(260, 80%, 55%, ${alpha})`)
          gradient.addColorStop(1, "transparent")
        } else {
          gradient.addColorStop(0, `hsla(38, 100%, 58%, ${alpha * 1.2})`)
          gradient.addColorStop(0.5, `hsla(25, 100%, 50%, ${alpha})`)
          gradient.addColorStop(1, "transparent")
        }
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // State-specific animations
      if (state === "listening") {
        // Pulsing concentric rings
        for (let i = 0; i < 4; i++) {
          const ringTime = (time * 2.5 + i * 0.7) % 3
          const ringRadius = baseRadius + ringTime * 40
          const ringAlpha = Math.max(0, 0.5 - ringTime * 0.17)
          
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(142, 70%, 50%, ${ringAlpha})`
          ctx.lineWidth = 3 - ringTime * 0.5
          ctx.stroke()
        }
      } else if (state === "speaking") {
        // Audio wave bars emanating from center
        const waveCount = 16
        for (let i = 0; i < waveCount; i++) {
          const angle = (i / waveCount) * Math.PI * 2 + time * 0.5
          const waveIntensity = Math.sin(time * 12 + i * 1.2) * 0.5 + 0.5
          const waveLength = 20 + waveIntensity * 35
          
          const x1 = centerX + Math.cos(angle) * (baseRadius - 5)
          const y1 = centerY + Math.sin(angle) * (baseRadius - 5)
          const x2 = centerX + Math.cos(angle) * (baseRadius + waveLength)
          const y2 = centerY + Math.sin(angle) * (baseRadius + waveLength)
          
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, `hsla(38, 100%, 60%, 0.9)`)
          gradient.addColorStop(0.5, `hsla(32, 100%, 55%, 0.6)`)
          gradient.addColorStop(1, `hsla(25, 100%, 50%, 0)`)
          
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 4 + waveIntensity * 2
          ctx.lineCap = "round"
          ctx.stroke()
        }
      } else if (state === "thinking") {
        // Rotating dots with trail
        const dotCount = 10
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + time * 4
          const orbitRadius = baseRadius + 25
          const x = centerX + Math.cos(angle) * orbitRadius
          const y = centerY + Math.sin(angle) * orbitRadius
          const trailAlpha = (dotCount - i) / dotCount * 0.7
          
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(260, 80%, 60%, ${trailAlpha})`
          ctx.fill()
        }
      }

      // Main orb
      const pulseScale = 1 + Math.sin(time * 2.5) * 0.04
      const hoverScale = isHovered ? 1.08 : 1
      const orbRadius = baseRadius * pulseScale * hoverScale

      // Orb gradient based on state
      const orbGradient = ctx.createRadialGradient(
        centerX - orbRadius * 0.25, centerY - orbRadius * 0.25, 0,
        centerX, centerY, orbRadius
      )
      
      if (state === "listening") {
        orbGradient.addColorStop(0, "hsla(160, 70%, 70%, 1)")
        orbGradient.addColorStop(0.4, "hsla(142, 70%, 55%, 1)")
        orbGradient.addColorStop(0.8, "hsla(120, 60%, 40%, 1)")
        orbGradient.addColorStop(1, "hsla(100, 50%, 30%, 1)")
      } else if (state === "thinking") {
        orbGradient.addColorStop(0, "hsla(280, 80%, 75%, 1)")
        orbGradient.addColorStop(0.4, "hsla(260, 80%, 60%, 1)")
        orbGradient.addColorStop(0.8, "hsla(240, 70%, 50%, 1)")
        orbGradient.addColorStop(1, "hsla(220, 60%, 40%, 1)")
      } else {
        orbGradient.addColorStop(0, "hsla(48, 100%, 75%, 1)")
        orbGradient.addColorStop(0.3, "hsla(38, 100%, 60%, 1)")
        orbGradient.addColorStop(0.7, "hsla(28, 100%, 52%, 1)")
        orbGradient.addColorStop(1, "hsla(18, 100%, 42%, 1)")
      }

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = orbGradient
      ctx.fill()

      // Highlight/shine effect
      const highlightGradient = ctx.createRadialGradient(
        centerX - orbRadius * 0.4, centerY - orbRadius * 0.4, 0,
        centerX - orbRadius * 0.4, centerY - orbRadius * 0.4, orbRadius * 0.6
      )
      highlightGradient.addColorStop(0, "hsla(0, 0%, 100%, 0.7)")
      highlightGradient.addColorStop(0.5, "hsla(0, 0%, 100%, 0.2)")
      highlightGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = highlightGradient
      ctx.fill()

      // Outer ring
      const ringGlow = 0.4 + Math.sin(time * 3) * 0.2
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius + 3, 0, Math.PI * 2)
      
      if (state === "listening") {
        ctx.strokeStyle = `hsla(142, 70%, 50%, ${ringGlow})`
      } else if (state === "thinking") {
        ctx.strokeStyle = `hsla(260, 80%, 60%, ${ringGlow})`
      } else {
        ctx.strokeStyle = `hsla(32, 100%, 55%, ${ringGlow})`
      }
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Fun bouncy effect when hovered
      if (isHovered && state === "idle") {
        const bounceOffset = Math.sin(time * 8) * 3
        ctx.save()
        ctx.translate(0, bounceOffset)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [size, state, isHovered])

  const stateLabels: Record<OrbState, { es: string; en: string }> = {
    idle: { es: "Toca para hablar", en: "Tap to talk" },
    listening: { es: "Escuchando...", en: "Listening..." },
    speaking: { es: "Hablando...", en: "Speaking..." },
    thinking: { es: "Pensando...", en: "Thinking..." },
  }

  const stateColors: Record<OrbState, string> = {
    idle: "bg-gold",
    listening: "bg-green-500",
    speaking: "bg-gold",
    thinking: "bg-purple-500",
  }

  return (
    <div 
      className="relative flex flex-col items-center gap-4 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="transition-transform duration-200"
      />
      <div className="flex items-center gap-2 rounded-full border-2 border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
        <span 
          className={`inline-block h-3 w-3 rounded-full ${stateColors[state]} ${
            state === "idle" ? "animate-pulse" : 
            state === "thinking" ? "animate-spin" : 
            "animate-pulse"
          }`} 
        />
        <span className="text-base font-medium text-foreground">
          {stateLabels[state].es}
        </span>
      </div>
    </div>
  )
}
