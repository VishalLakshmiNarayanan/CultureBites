"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInUser } from "../actions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const logoPath = "/images/culture-bites-logo.png" // Make sure this path matches your logo location
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const msg = searchParams.get("message")
    if (msg) {
      setMessage(msg)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      console.log("[v0] Attempting login for:", email)

      const result = await signInUser(email, password)

      if (result.error) {
        throw new Error(result.error)
      }

      console.log("[v0] Login successful, role:", result.role)

      router.refresh()

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (result.role === "host") {
        router.push("/dashboard?tab=hosts")
      } else if (result.role === "cook") {
        router.push("/dashboard?tab=cooks")
      } else {
        router.push("/dashboard?tab=users")
      }
    } catch (err: unknown) {
      console.error("[v0] Login failed:", err)
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-black">
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

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-md bg-black/60 border-orange-500/30">
          <CardHeader>
            <div className="flex flex-col items-center mb-6">
              <img src="/images/cooking-together.png" alt="Culture Bites Logo" className="w-32 h-32 mb-4 rounded-full object-cover" />
              <h1 className="text-3xl font-bold text-orange-400 mb-2">Culture Bites</h1>
              <p className="text-center text-orange-200/80">Connect through authentic culinary experiences</p>
            </div>
            <CardTitle className="text-2xl text-orange-400">Welcome Back</CardTitle>
            <CardDescription className="text-orange-200/80">Sign in to your CultureBites account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-orange-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-orange-500/30 text-orange-100 placeholder:text-orange-300/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-orange-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-orange-500/30 text-orange-100"
                  />
                </div>

                {message && <p className="text-sm text-green-400">{message}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm text-orange-200">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
