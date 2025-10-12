"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AuthSelectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "host"
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push(`/?tab=${role}s`)
      } else {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router, role])

  if (checking) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/cooking-together.png')`,
            filter: "blur(3px)",
            opacity: 0.7,
            transform: "scale(1.1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)),
              radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.15) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        <Card className="backdrop-blur-sm bg-black/80 border-orange-500/30">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <img src="/images/logo.png" alt="CultureBites Logo" className="h-16 w-16 object-contain" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                CultureBites
              </h1>
            </div>
            <CardTitle className="text-2xl text-orange-100">
              {role === "host" ? "Host" : "Cook"} Authentication
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              {role === "host"
                ? "Sign in or create an account to start hosting events"
                : "Sign in or create an account to start cooking"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push(`/auth/login?role=${role}`)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>

            <Button
              onClick={() => router.push(`/auth/signup?role=${role}`)}
              variant="outline"
              className="w-full border-2 border-orange-400/50 text-black hover:bg-orange-500/10 hover:border-orange-400 py-6 text-lg"
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>

            <div className="text-center pt-2">
              <Button variant="link" onClick={() => router.push("/")} className="text-orange-400 hover:text-orange-300">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
