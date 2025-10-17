"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "@/lib/types"
import { signUpUser } from "../actions"

export default function SignUpPage() {
  const [step, setStep] = useState<"role" | "details">("role")
  const [role, setRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep("details")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting signup process for role:", role)

      const result = await signUpUser(email, password, role)

      if (result.error) {
        throw new Error(result.error)
      }

      console.log("[v0] User created successfully, redirecting to login")

      // Redirect to login page with success message
      router.push("/auth/login?message=Account created successfully! Please sign in.")
    } catch (err: unknown) {
      console.error("[v0] Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "role") {
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

        <div className="w-full max-w-4xl relative z-10">
          <Card className="backdrop-blur-md bg-black/60 border-orange-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-orange-400">Choose Your Role</CardTitle>
              <CardDescription className="text-orange-200/80">
                Select how you want to participate in CultureBites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleRoleSelect("user")}
                  className="p-8 border-2 border-orange-500/30 rounded-lg hover:border-orange-500 hover:bg-orange-950/30 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
                  <h3 className="text-xl font-bold mb-2 text-orange-300">Guest</h3>
                  <p className="text-sm text-orange-200/70">Discover and book unique dining experiences</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("host")}
                  className="p-8 border-2 border-orange-500/30 rounded-lg hover:border-amber-500 hover:bg-amber-950/30 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                  <h3 className="text-xl font-bold mb-2 text-amber-300">Host</h3>
                  <p className="text-sm text-amber-200/70">Share your space for culinary events</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("cook")}
                  className="p-8 border-2 border-orange-500/30 rounded-lg hover:border-yellow-500 hover:bg-yellow-950/30 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🍳</div>
                  <h3 className="text-xl font-bold mb-2 text-yellow-300">Cook</h3>
                  <p className="text-sm text-yellow-200/70">Showcase your culinary talents</p>
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-orange-200">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl text-orange-400">
              Sign Up as {role === "user" ? "Guest" : role === "host" ? "Host" : "Cook"}
            </CardTitle>
            <CardDescription className="text-orange-200/80">Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-orange-500/30 text-orange-100"
                  />
                  <p className="text-xs text-orange-200/60">Minimum 6 characters</p>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("role")}
                    className="flex-1 border-orange-500/30 text-orange-300 hover:bg-orange-950/30"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
