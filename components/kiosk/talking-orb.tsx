"use client"

import { useEffect, useRef, useState } from "react"

type OrbState = "idle" | "listening" | "speaking" | "thinking"

interface TalkingOrbProps {
  state?: OrbState
  size?: number
  onClick?: () => void
}

export function TalkingOrb({ state = "idle", size = 280, onClick }: TalkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    let time = 0
    const centerX = size / 2
    const centerY = size / 2
    const baseRadius = size * 0.32

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, size, size)

      // Outer glow layers
      const glowLayers = 5
      for (let i = glowLayers; i >= 0; i--) {
        const glowRadius = baseRadius + i * 18
        const alpha = 0.08 - i * 0.012
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowRadius
        )
        gradient.addColorStop(0, `hsla(32, 100%, 55%, ${alpha})`)
        gradient.addColorStop(0.5, `hsla(25, 100%, 50%, ${alpha * 0.5})`)
        gradient.addColorStop(1, "transparent")
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // State-specific animations
      if (state === "listening") {
        // Green pulse waves
        for (let i = 0; i < 3; i++) {
          const waveTime = (time * 2 + i * 0.5) % 2
          const waveRadius = baseRadius + waveTime * 50
          const waveAlpha = Math.max(0, 0.4 - waveTime * 0.2)
          
          ctx.beginPath()
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(142, 70%, 50%, ${waveAlpha})`
          ctx.lineWidth = 3
          ctx.stroke()
        }
      } else if (state === "speaking") {
        // Audio wave visualization
        const waveCount = 12
        for (let i = 0; i < waveCount; i++) {
          const angle = (i / waveCount) * Math.PI * 2
          const waveOffset = Math.sin(time * 8 + i * 0.8) * 20
          const waveRadius = baseRadius + 15 + waveOffset
          
          const x1 = centerX + Math.cos(angle) * baseRadius
          const y1 = centerY + Math.sin(angle) * baseRadius
          const x2 = centerX + Math.cos(angle) * waveRadius
          const y2 = centerY + Math.sin(angle) * waveRadius
          
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, "hsla(32, 100%, 55%, 0.8)")
          gradient.addColorStop(1, "hsla(42, 100%, 60%, 0)")
          
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 4
          ctx.lineCap = "round"
          ctx.stroke()
        }
      } else if (state === "thinking") {
        // Rotating dots
        const dotCount = 8
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + time * 3
          const dotRadius = baseRadius + 30
          const x = centerX + Math.cos(angle) * dotRadius
          const y = centerY + Math.sin(angle) * dotRadius
          const alpha = 0.3 + Math.sin(time * 4 + i) * 0.3
          
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(32, 100%, 55%, ${alpha})`
          ctx.fill()
        }
      }

      // Main orb with pulsing
      const pulseScale = 1 + Math.sin(time * 2) * 0.03
      const orbRadius = baseRadius * pulseScale * (isHovered ? 1.05 : 1)

      // Inner gradient for the orb
      const orbGradient = ctx.createRadialGradient(
        centerX - orbRadius * 0.3, centerY - orbRadius * 0.3, 0,
        centerX, centerY, orbRadius
      )
      orbGradient.addColorStop(0, "hsla(42, 100%, 70%, 1)")
      orbGradient.addColorStop(0.3, "hsla(32, 100%, 55%, 1)")
      orbGradient.addColorStop(0.7, "hsla(25, 100%, 50%, 1)")
      orbGradient.addColorStop(1, "hsla(20, 100%, 40%, 1)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = orbGradient
      ctx.fill()

      // Highlight reflection
      const highlightGradient = ctx.createRadialGradient(
        centerX - orbRadius * 0.35, centerY - orbRadius * 0.35, 0,
        centerX - orbRadius * 0.35, centerY - orbRadius * 0.35, orbRadius * 0.5
      )
      highlightGradient.addColorStop(0, "hsla(0, 0%, 100%, 0.6)")
      highlightGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
      ctx.fillStyle = highlightGradient
      ctx.fill()

      // Border ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbRadius + 2, 0, Math.PI * 2)
      ctx.strokeStyle = `hsla(32, 100%, 60%, ${0.3 + Math.sin(time * 2) * 0.1})`
      ctx.lineWidth = 2
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [size, state, isHovered])

  const stateLabels: Record<OrbState, string> = {
    idle: "Toca para hablar",
    listening: "Escuchando...",
    speaking: "Hablando...",
    thinking: "Pensando...",
  }

  return (
    <div 
      className="relative flex flex-col items-center gap-6 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="transition-transform duration-300"
      />
      <div className="flex items-center gap-2">
        <span 
          className={`inline-block h-3 w-3 rounded-full ${
            state === "idle" ? "bg-gold animate-pulse" :
            state === "listening" ? "bg-green-500 animate-pulse" :
            state === "speaking" ? "bg-gold animate-pulse" :
            "bg-gold animate-spin"
          }`} 
        />
        <span className="text-lg font-medium text-foreground">
          {stateLabels[state]}
        </span>
      </div>
    </div>
  )
}
