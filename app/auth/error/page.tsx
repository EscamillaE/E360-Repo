import Link from 'next/link'
import { Sparkles, AlertCircle } from 'lucide-react'

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
              <span className="text-2xl font-bold">
                Eventos<span className="text-gold">360</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <div className="p-6 text-center border-b border-border/30">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Algo salio mal
              </h1>
            </div>
            <div className="p-6 text-center">
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
                <Link
                  href="/auth/login"
                  className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-background transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 text-center"
                >
                  Intentar de nuevo
                </Link>
                <Link
                  href="/"
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-center"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
