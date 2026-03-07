"use client"

import { useState } from "react"
import { Loader2, Shield, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface SetupResult {
  email: string
  success: boolean
  error?: string
}

export default function SetupPage() {
  const [setupKey, setSetupKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SetupResult[] | null>(null)
  const [error, setError] = useState("")

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResults(null)

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Setup failed")
        return
      }

      setResults(data.results)
    } catch {
      setError("An error occurred during setup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Shield className="h-7 w-7 text-gold" />
            </div>
          </div>

          <h1 className="mb-2 text-center text-xl font-bold text-foreground">
            Admin Setup
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Initialize admin accounts for Eventos 360
          </p>

          {!results ? (
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="setupKey" className="text-xs font-medium text-foreground">
                  Setup Key
                </label>
                <input
                  id="setupKey"
                  type="password"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  placeholder="Enter setup key"
                  required
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </span>
                ) : (
                  "Initialize Admin Accounts"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-foreground">Setup Results:</h2>
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={result.email}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      result.success
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {result.email}
                      </p>
                      {result.error && (
                        <p className="text-xs text-muted-foreground">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/admin"
                className="mt-4 block w-full rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-gold/90"
              >
                Go to Admin Portal
              </Link>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          This page should be removed after initial setup.
        </p>
      </div>
    </div>
  )
}
