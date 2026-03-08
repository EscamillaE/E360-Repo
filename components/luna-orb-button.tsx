"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LunaOrbButtonProps {
  onClick: () => void
  isActive?: boolean
  isSpeaking?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LunaOrbButton({ 
  onClick, 
  isActive = false, 
  isSpeaking = false,
  size = "md",
  className 
}: LunaOrbButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<number>()

  const sizeMap = {
    sm: { canvas: 32, orb: 12 },
    md: { canvas: 44, orb: 16 },
    lg: { canvas: 64, orb: 24 },
  }

  const dims = sizeMap[size]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = dims.canvas * dpr
    canvas.height = dims.canvas * dpr
    ctx.scale(dpr, dpr)

    let time = 0

    const animate = () => {
      if (!ctx) return
      time += 0.05

      ctx.clearRect(0, 0, dims.canvas, dims.canvas)

      const centerX = dims.canvas / 2
      const centerY = dims.canvas / 2
      const baseRadius = dims.orb

      // Outer glow
      const glowIntensity = isActive || isHovered ? 0.6 : 0.3
      const glowRadius = baseRadius * (isActive ? 2 : 1.5)
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, glowRadius
      )
      outerGlow.addColorStop(0, `rgba(255, 149, 0, ${glowIntensity})`)
      outerGlow.addColorStop(0.5, `rgba(255, 149, 0, ${glowIntensity * 0.5})`)
      outerGlow.addColorStop(1, "transparent")
      ctx.fillStyle = outerGlow
      ctx.fillRect(0, 0, dims.canvas, dims.canvas)

      // Speaking animation - pulsing rings
      if (isSpeaking) {
        const pulseCount = 3
        for (let i = 0; i < pulseCount; i++) {
          const phase = (time * 2 + i * 0.5) % 2
          const ringRadius = baseRadius + phase * baseRadius * 0.8
          const ringAlpha = Math.max(0, 1 - phase)
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 149, 0, ${ringAlpha * 0.4})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      // Main orb with gradient
      const orbGradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.3, centerY - baseRadius * 0.3, 0,
        centerX, centerY, baseRadius
      )
      orbGradient.addColorStop(0, "#ffcc66")
      orbGradient.addColorStop(0.5, "#ff9500")
      orbGradient.addColorStop(1, "#ff6600")

      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2)
      ctx.fillStyle = orbGradient
      ctx.fill()

      // Inner shine
      ctx.beginPath()
      ctx.arc(
        centerX - baseRadius * 0.25,
        centerY - baseRadius * 0.25,
        baseRadius * 0.35,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
      ctx.fill()

      // Hover pulse
      if (isHovered && !isSpeaking) {
        const hoverPulse = Math.sin(time * 3) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(centerX, centerY, baseRadius * (1.1 + hoverPulse * 0.1), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 149, 0, ${hoverPulse * 0.5})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dims.canvas, dims.orb, isActive, isHovered, isSpeaking])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-transform duration-200",
        isHovered && "scale-110",
        isActive && "scale-105",
        className
      )}
      style={{ width: dims.canvas, height: dims.canvas }}
      aria-label="Talk to Luna"
    >
      <canvas
        ref={canvasRef}
        style={{ width: dims.canvas, height: dims.canvas }}
        className="pointer-events-none"
      />
    </button>
  )
}
