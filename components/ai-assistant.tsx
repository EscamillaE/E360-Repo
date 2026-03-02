"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react"

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-gold/30 bg-card/80 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:border-gold/60 hover:bg-card",
          isOpen && "hidden"
        )}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-4 w-4 text-gold" />
        <span className="text-foreground">AI Assistant</span>
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-500 ease-out",
          "bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto",
          "md:w-[420px]",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-[min(580px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border border-gold/20 bg-card/95 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Eventos 360 AI
                </h3>
                <p className="text-xs text-muted-foreground">
                  Asistente de eventos
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                  <MessageSquare className="h-6 w-6 text-gold" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Bienvenido a Eventos 360
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[280px]">
                  Preguntame sobre nuestros paquetes de DJ, efectos especiales,
                  shows de robot LED, pistas de baile y mas.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {[
                    "Paquetes de DJ",
                    "Efectos especiales",
                    "Shows de drones",
                    "Cotizacion",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        sendMessage({ text: suggestion })
                      }}
                      className="rounded-full border border-gold/20 bg-secondary/50 px-3 py-1.5 text-xs text-foreground transition-all hover:border-gold/40 hover:bg-secondary"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = getMessageText(message)
              if (!text) return null
              const isUser = message.role === "user"
              return (
                <div
                  key={message.id}
                  className={cn(
                    "mb-3 flex",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      isUser
                        ? "bg-gold text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    )}
                  >
                    {text}
                  </div>
                </div>
              )
            })}

            {isLoading && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Pensando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-primary-foreground transition-all hover:bg-gold-light disabled:opacity-40 disabled:hover:bg-gold"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
