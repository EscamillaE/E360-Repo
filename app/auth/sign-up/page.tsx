'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function Page() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Las contrasenas no coinciden')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/cliente`,
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error al registrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-gold transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
              </div>
              <span className="text-2xl font-bold text-glow-gold">
                Eventos<span className="text-gold">360</span>
              </span>
            </Link>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Crear Cuenta</CardTitle>
              <CardDescription className="text-muted-foreground">
                Registrate para acceder a cotizaciones y mas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-foreground">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Juan Perez"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-background/50 border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-foreground">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="442 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background/50 border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-foreground">Correo Electronico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-foreground">Contrasena</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-foreground">Confirmar Contrasena</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="bg-background/50 border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                      {error}
                    </p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-light text-background font-semibold transition-all hover:shadow-lg hover:shadow-gold/20" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </div>
                <div className="mt-5 text-center text-sm text-muted-foreground">
                  Ya tienes cuenta?{' '}
                  <Link
                    href="/auth/login"
                    className="text-gold hover:text-gold-light underline underline-offset-4 transition-colors"
                  >
                    Iniciar Sesion
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold transition-colors">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
