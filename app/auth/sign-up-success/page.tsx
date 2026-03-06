import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, Mail, CheckCircle } from 'lucide-react'

export default function Page() {
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
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-gold" />
                  <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">
                Registro Exitoso!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Revisa tu correo para confirmar tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <Mail className="h-5 w-5 text-gold" />
                <span>Hemos enviado un correo de verificacion</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Por favor revisa tu bandeja de entrada (y spam) para confirmar tu cuenta antes de iniciar sesion.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="text-gold hover:text-gold-light underline underline-offset-4 transition-colors text-sm"
                >
                  Ir a Iniciar Sesion
                </Link>
              </div>
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
