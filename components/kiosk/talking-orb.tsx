"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TalkingOrbProps {
  isListening?: boolean
  isSpeaking?: boolean
  isThinking?: boolean
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  className?: string
}

export function TalkingOrb({
  isListening = false,
  isSpeaking = false,
  isThinking = false,
  size = "lg",
  onClick,
  className,
}: TalkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [pulseIntensity, setPulseIntensity] = useState(0)

  const sizeMap = {
    sm: 120,
    md: 200,
    lg: 280,
  }

  const orbSize = sizeMap[size]

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.width / dpr
    const height = canvas.height / dpr
    const centerX = width / 2
    const centerY = height / 2
    const baseRadius = Math.min(width, height) * 0.35

    ctx.clearRect(0, 0, width * dpr, height * dpr)
    ctx.save()
    ctx.scale(dpr, dpr)

    const time = Date.now() / 1000

    // Outer glow rings
    const numRings = 4
    for (let i = numRings; i >= 0; i--) {
      const ringPulse = isListening || isSpeaking ? Math.sin(time * 3 + i * 0.5) * 0.15 + 0.85 : 1
      const ringRadius = baseRadius + (i * 20) + (isSpeaking ? Math.sin(time * 8 + i) * 8 : 0)
      const alpha = (0.1 - i * 0.02) * ringPulse

      const gradient = ctx.createRadialGradient(
        centerX, centerY, ringRadius * 0.8,
        centerX, centerY, ringRadius
      )
      gradient.addColorStop(0, `hsla(38, 92%, 50%, 0)`)
      gradient.addColorStop(0.5, `hsla(38, 92%, 55%, ${alpha})`)
      gradient.addColorStop(1, `hsla(38, 92%, 50%, 0)`)

      ctx.beginPath()
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Main orb gradient
    const speakingPulse = isSpeaking ? Math.sin(time * 6) * 0.1 + 1 : 1
    const listeningPulse = isListening ? Math.sin(time * 4) * 0.08 + 1 : 1
    const thinkingPulse = isThinking ? Math.sin(time * 2) * 0.05 + 1 : 1
    const currentRadius = baseRadius * speakingPulse * listeningPulse * thinkingPulse

    // Background glow
    const bgGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, currentRadius * 1.5
    )
    bgGlow.addColorStop(0, `hsla(38, 92%, 55%, 0.3)`)
    bgGlow.addColorStop(0.5, `hsla(38, 92%, 50%, 0.1)`)
    bgGlow.addColorStop(1, `hsla(38, 92%, 50%, 0)`)
    ctx.fillStyle = bgGlow
    ctx.fillRect(0, 0, width, height)

    // Main orb body
    const mainGradient = ctx.createRadialGradient(
      centerX - currentRadius * 0.3, centerY - currentRadius * 0.3, 0,
      centerX, centerY, currentRadius
    )
    mainGradient.addColorStop(0, `hsl(43, 96%, 70%)`)
    mainGradient.addColorStop(0.3, `hsl(38, 92%, 55%)`)
    mainGradient.addColorStop(0.7, `hsl(33, 88%, 45%)`)
    mainGradient.addColorStop(1, `hsl(28, 85%, 30%)`)

    ctx.beginPath()
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
    ctx.fillStyle = mainGradient
    ctx.fill()

    // Inner highlight
    const highlight = ctx.createRadialGradient(
      centerX - currentRadius * 0.4, centerY - currentRadius * 0.4, 0,
      centerX - currentRadius * 0.2, centerY - currentRadius * 0.2, currentRadius * 0.5
    )
    highlight.addColorStop(0, `hsla(48, 100%, 90%, 0.8)`)
    highlight.addColorStop(0.5, `hsla(43, 96%, 70%, 0.3)`)
    highlight.addColorStop(1, `hsla(38, 92%, 50%, 0)`)

    ctx.beginPath()
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
    ctx.fillStyle = highlight
    ctx.fill()

    // Audio wave visualization when speaking
    if (isSpeaking) {
      const waveCount = 8
      for (let i = 0; i < waveCount; i++) {
        const angle = (i / waveCount) * Math.PI * 2 + time * 2
        const waveAmplitude = Math.sin(time * 8 + i * 0.8) * 15 + 10
        const startX = centerX + Math.cos(angle) * currentRadius * 0.6
        const startY = centerY + Math.sin(angle) * currentRadius * 0.6
        const endX = centerX + Math.cos(angle) * (currentRadius * 0.6 + waveAmplitude)
        const endY = centerY + Math.sin(angle) * (currentRadius * 0.6 + waveAmplitude)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `hsla(48, 100%, 85%, ${0.6 + Math.sin(time * 6 + i) * 0.4})`
        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.stroke()
      }
    }

    // Listening animation - concentric pulses
    if (isListening) {
      const pulseCount = 3
      for (let i = 0; i < pulseCount; i++) {
        const pulsePhase = (time * 1.5 + i * 0.5) % 1
        const pulseRadius = currentRadius + pulsePhase * 60
        const pulseAlpha = (1 - pulsePhase) * 0.3

        ctx.beginPath()
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(38, 92%, 60%, ${pulseAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // Thinking animation - rotating dots
    if (isThinking) {
      const dotCount = 5
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + time * 3
        const dotRadius = currentRadius * 0.7
        const x = centerX + Math.cos(angle) * dotRadius
        const y = centerY + Math.sin(angle) * dotRadius
        const dotSize = 4 + Math.sin(time * 4 + i) * 2

        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(48, 100%, 85%, ${0.5 + Math.sin(time * 3 + i) * 0.3})`
        ctx.fill()
      }
    }

    // Reflection arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, currentRadius * 0.9, -Math.PI * 0.8, -Math.PI * 0.3)
    ctx.strokeStyle = `hsla(48, 100%, 95%, 0.15)`
    ctx.lineWidth = currentRadius * 0.08
    ctx.lineCap = "round"
    ctx.stroke()

    ctx.restore()

    animationRef.current = requestAnimationFrame(draw)
  }, [isListening, isSpeaking, isThinking])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = orbSize * dpr
    canvas.height = orbSize * dpr
    canvas.style.width = `${orbSize}px`
    canvas.style.height = `${orbSize}px`

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [draw, orbSize])

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none",
        className
      )}
      aria-label="Interact with AI assistant"
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: orbSize, height: orbSize }}
      />
      {/* Status indicator */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all",
          isListening && "bg-green-500/20 text-green-300",
          isSpeaking && "bg-gold/20 text-gold",
          isThinking && "bg-blue-500/20 text-blue-300",
          !isListening && !isSpeaking && !isThinking && "bg-card/50 text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isListening && "bg-green-400 animate-pulse",
            isSpeaking && "bg-gold animate-pulse",
            isThinking && "bg-blue-400 animate-pulse",
            !isListening && !isSpeaking && !isThinking && "bg-muted-foreground"
          )}
        />
        {isListening && "Escuchando..."}
        {isSpeaking && "Hablando..."}
        {isThinking && "Pensando..."}
        {!isListening && !isSpeaking && !isThinking && "Toca para hablar"}
      </div>
    </button>
  )
}
