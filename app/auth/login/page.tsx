"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from "../actions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError(null)

    console.log("[v0] Starting login process")
    const result = await loginUser(email, password)
    console.log("[v0] Login result:", result)

    if (result.error) {
      console.log("[v0] Login error:", result.error)
      setError(result.error)
      setIsLoading(false)
      return
    }

    // Redirect to the appropriate tab based on user role
    const userRole = result.data?.role
    console.log("[v0] User role:", userRole)

    if (userRole === "host") {
      console.log("[v0] Redirecting to hosts tab")
      router.push("/?tab=hosts")
    } else if (userRole === "cook") {
      console.log("[v0] Redirecting to cooks tab")
      router.push("/?tab=cooks")
    } else {
      console.log("[v0] Redirecting to home")
      router.push("/")
    }

    setIsLoading(false)
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

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-sm bg-black/80 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              {role === "host"
                ? "Sign in to your host account"
                : role === "cook"
                  ? "Sign in to your cook account"
                  : "Sign in to your CultureBites account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-orange-100">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Please enter a valid email address (e.g., user@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-orange-500/30 text-orange-100 placeholder:text-orange-300/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-orange-100">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-black/50 border-orange-500/30 text-orange-100 placeholder:text-orange-300/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm text-orange-200">
                Don't have an account?{" "}
                <Link
                  href={`/auth/signup${role ? `?role=${role}` : ""}`}
                  className="text-orange-400 hover:text-orange-300 hover:underline"
                >
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
