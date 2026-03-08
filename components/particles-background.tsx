"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number>()

  // Golden/orange particle colors
  const colors = [
    "rgba(255, 149, 0, opacity)", // Neon orange
    "rgba(255, 165, 0, opacity)", // Gold
    "rgba(255, 200, 80, opacity)", // Light gold
    "rgba(255, 120, 0, opacity)", // Deep orange
    "rgba(255, 180, 60, opacity)", // Amber
  ]

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((dimensions.width * dimensions.height) / 15000))
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle())
    }

    function createParticle(): Particle {
      const maxLife = 300 + Math.random() * 200
      return {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2, // Slight upward drift
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * maxLife,
        maxLife,
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Mouse interaction - particles gently move away
        if (mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x
          const dy = particle.y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.5
            particle.vx += (dx / dist) * force
            particle.vy += (dy / dist) * force
          }
        }

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Fade based on life
        const lifeRatio = particle.life / particle.maxLife
        const fadeOpacity = lifeRatio < 0.2 
          ? particle.opacity * (lifeRatio / 0.2)
          : lifeRatio > 0.8 
            ? particle.opacity * (1 - (lifeRatio - 0.8) / 0.2)
            : particle.opacity

        // Draw particle with glow
        const color = particle.color.replace("opacity", String(fadeOpacity))
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, particle.color.replace("opacity", String(fadeOpacity * 0.5)))
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Reset particle if out of bounds or life ended
        if (
          particle.x < -50 ||
          particle.x > dimensions.width + 50 ||
          particle.y < -50 ||
          particle.y > dimensions.height + 50 ||
          particle.life > particle.maxLife
        ) {
          particlesRef.current[index] = createParticle()
          // Spawn from edges for a flowing effect
          if (Math.random() > 0.5) {
            particlesRef.current[index].y = dimensions.height + 20
            particlesRef.current[index].vy = -Math.random() * 0.5 - 0.3
          }
        }
      })

      // Draw connections between nearby particles
      ctx.strokeStyle = "rgba(255, 149, 0, 0.05)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.globalAlpha = (120 - dist) / 120 * 0.3
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, colors])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "screen" }}
    />
  )
}
