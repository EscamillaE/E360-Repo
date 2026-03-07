"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get("redirect") || "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError("Credenciales invalidas")
        return
      }

      if (!data.user) {
        setError("Error de autenticacion")
        return
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut()
        setError("No tienes permisos de administrador")
        return
      }

      // Redirect to admin or specified redirect
      router.push(redirect)
      router.refresh()
    } catch {
      setError("Error al iniciar sesion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Eventos 360"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Panel Administrativo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con tu cuenta de administrador
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-gold/10 p-3">
            <Shield className="h-4 w-4 text-gold" />
            <span className="text-xs font-medium text-gold">Acceso restringido</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eventos360.com"
                required
                autoComplete="email"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-foreground">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Iniciar sesion"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Eres cliente?{" "}
          <Link href="/cliente" className="text-gold hover:underline">
            Accede al portal de clientes
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
