import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
                  <AlertCircle className="h-16 w-16 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">
                Algo salio mal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {params?.error ? (
                <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md">
                  Error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ocurrio un error inesperado. Por favor intenta de nuevo.
                </p>
              )}
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild className="bg-gold hover:bg-gold-light text-background">
                  <Link href="/auth/login">
                    Intentar de nuevo
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Link href="/">
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
