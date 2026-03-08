"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface E360AnimatedLogoProps {
  size?: number
  micActive?: boolean
  showMicButton?: boolean
  className?: string
}

export function E360AnimatedLogo({ 
  size = 200, 
  micActive = false, 
  showMicButton = false,
  className = ""
}: E360AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const [localMicActive, setLocalMicActive] = useState(false)
  
  const isMicOn = micActive || localMicActive

  // Balloon configuration - arranged to form "360" shape
  const balloonsRef = useRef<Array<{
    x: number
    y: number
    baseSize: number
    size: number
    color: string
    offsetX: number
    offsetY: number
    phase: number
    inflation: number
  }>>([])

  // Initialize balloons
  useEffect(() => {
    const colors = [
      "hsl(32, 100%, 52%)",   // Gold
      "hsl(25, 100%, 55%)",   // Neon orange
      "hsl(42, 100%, 58%)",   // Neon yellow
      "hsl(38, 100%, 50%)",   // Gold light
      "hsl(30, 100%, 60%)",   // Light orange
    ]

    // Create balloon positions that form the logo shape
    const positions = [
      // "3" shape
      { x: 0.2, y: 0.25 }, { x: 0.28, y: 0.2 }, { x: 0.35, y: 0.25 },
      { x: 0.35, y: 0.35 }, { x: 0.28, y: 0.45 },
      { x: 0.35, y: 0.55 }, { x: 0.35, y: 0.65 }, { x: 0.28, y: 0.75 }, { x: 0.2, y: 0.7 },
      // "6" shape
      { x: 0.45, y: 0.3 }, { x: 0.5, y: 0.22 }, { x: 0.58, y: 0.25 },
      { x: 0.45, y: 0.4 }, { x: 0.45, y: 0.5 }, { x: 0.45, y: 0.6 },
      { x: 0.5, y: 0.7 }, { x: 0.58, y: 0.7 }, { x: 0.58, y: 0.6 }, { x: 0.5, y: 0.55 },
      // "0" shape
      { x: 0.72, y: 0.25 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.45 },
      { x: 0.8, y: 0.55 }, { x: 0.8, y: 0.7 }, { x: 0.72, y: 0.75 },
      { x: 0.65, y: 0.7 }, { x: 0.65, y: 0.55 }, { x: 0.65, y: 0.45 }, { x: 0.65, y: 0.3 },
    ]

    balloonsRef.current = positions.map((pos, i) => ({
      x: pos.x * size,
      y: pos.y * size,
      baseSize: 12 + Math.random() * 8,
      size: 12 + Math.random() * 8,
      color: colors[i % colors.length],
      offsetX: pos.x * size,
      offsetY: pos.y * size,
      phase: Math.random() * Math.PI * 2,
      inflation: 0,
    }))
  }, [size])

  // Setup microphone
  useEffect(() => {
    if (!isMicOn) {
      audioContextRef.current?.close()
      audioContextRef.current = null
      return
    }
    
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
      audioContextRef.current = null
    }
  }, [isMicOn])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size * window.devicePixelRatio
    canvas.height = size * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    let time = 0
    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, size, size)
      
      // Get audio level
      let audioLevel = 0
      if (analyserRef.current && dataArrayRef.current && isMicOn) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)
        audioLevel = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length / 255
      }
      
      balloonsRef.current.forEach((balloon, i) => {
        // Inflate based on audio
        const targetInflation = isMicOn ? audioLevel * 25 : 0
        balloon.inflation += (targetInflation - balloon.inflation) * 0.15
        balloon.size = balloon.baseSize + balloon.inflation
        
        // Gentle floating motion
        const floatX = Math.sin(time + balloon.phase) * 2
        const floatY = Math.cos(time * 0.7 + balloon.phase) * 2
        
        balloon.x = balloon.offsetX + floatX
        balloon.y = balloon.offsetY + floatY
        
        // Draw balloon shadow
        ctx.beginPath()
        ctx.ellipse(balloon.x + 2, balloon.y + 2, balloon.size * 0.9, balloon.size * 1.1, 0, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fill()
        
        // Draw balloon body
        ctx.beginPath()
        ctx.ellipse(balloon.x, balloon.y, balloon.size * 0.9, balloon.size * 1.1, 0, 0, Math.PI * 2)
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(
          balloon.x - balloon.size * 0.3,
          balloon.y - balloon.size * 0.3,
          0,
          balloon.x,
          balloon.y,
          balloon.size * 1.2
        )
        gradient.addColorStop(0, `${balloon.color.replace(')', ', 1)').replace('hsl', 'hsla')}`)
        gradient.addColorStop(0.7, balloon.color)
        gradient.addColorStop(1, `${balloon.color.replace(')', ', 0.8)').replace('hsl', 'hsla')}`)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Highlight
        ctx.beginPath()
        ctx.ellipse(
          balloon.x - balloon.size * 0.25,
          balloon.y - balloon.size * 0.35,
          balloon.size * 0.2,
          balloon.size * 0.15,
          -0.5,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fill()
        
        // Balloon knot
        ctx.beginPath()
        ctx.moveTo(balloon.x, balloon.y + balloon.size * 1.1)
        ctx.lineTo(balloon.x - 2, balloon.y + balloon.size * 1.1 + 4)
        ctx.lineTo(balloon.x + 2, balloon.y + balloon.size * 1.1 + 4)
        ctx.closePath()
        ctx.fillStyle = balloon.color
        ctx.fill()
        
        // String
        ctx.beginPath()
        ctx.moveTo(balloon.x, balloon.y + balloon.size * 1.1 + 4)
        ctx.quadraticCurveTo(
          balloon.x + Math.sin(time + i) * 3,
          balloon.y + balloon.size * 1.5,
          balloon.x,
          balloon.y + balloon.size * 2
        )
        ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [size, isMicOn])

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ width: size, height: size }}
      />
      {showMicButton && (
        <button
          onClick={() => setLocalMicActive(!localMicActive)}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            localMicActive 
              ? "bg-gradient-to-r from-neon-orange to-gold text-white shadow-[0_0_20px_hsl(32,100%,52%,0.5)]" 
              : "bg-card/80 border-2 border-border text-muted-foreground hover:border-gold"
          }`}
        >
          {localMicActive ? "🎤 Listening..." : "🎈 Tap to inflate"}
        </button>
      )}
    </div>
  )
}
