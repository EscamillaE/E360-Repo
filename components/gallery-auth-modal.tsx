"use client"

import { useState } from "react"
import { X, Loader2, Shield } from "lucide-react"
import { useApp } from "@/components/providers"
import { createClient } from "@/lib/supabase/client"

interface GalleryAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GalleryAuthModal({ isOpen, onClose, onSuccess }: GalleryAuthModalProps) {
  const { locale } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = {
    es: {
      title: "Autenticacion Requerida",
      subtitle: "Ingresa con tu cuenta de administrador",
      email: "Correo electronico",
      password: "Contrasena",
      login: "Iniciar sesion",
      loggingIn: "Verificando...",
      cancel: "Cancelar",
      invalidCredentials: "Credenciales invalidas",
      notAdmin: "No tienes permisos de administrador",
      error: "Error al iniciar sesion",
    },
    en: {
      title: "Authentication Required",
      subtitle: "Sign in with your admin account",
      email: "Email address",
      password: "Password",
      login: "Sign in",
      loggingIn: "Verifying...",
      cancel: "Cancel",
      invalidCredentials: "Invalid credentials",
      notAdmin: "You don't have admin permissions",
      error: "Login error",
    },
  }[locale]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(t.invalidCredentials)
        return
      }

      if (!data.user) {
        setError(t.error)
        return
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        // Sign out if not admin
        await supabase.auth.signOut()
        setError(t.notAdmin)
        return
      }

      // Success - user is admin
      onSuccess()
    } catch (err) {
      console.error("Login error:", err)
      setError(t.error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
              <Shield className="h-4 w-4 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eventos360.com"
                required
                autoComplete="email"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-foreground">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.loggingIn}
                </>
              ) : (
                t.login
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
