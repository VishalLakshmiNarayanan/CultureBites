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
import { signUpUser } from "../actions"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get("role") as "host" | "cook" | null

  const [step, setStep] = useState<"role" | "details">(roleFromUrl ? "details" : "role")
  const [role, setRole] = useState<"host" | "cook" | null>(roleFromUrl)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (selectedRole: "host" | "cook") => {
    setRole(selectedRole)
    setStep("details")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await signUpUser(email, password, name, role)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    router.push(`/auth/login?role=${role}`)
  }

  if (step === "role") {
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

        <div className="w-full max-w-3xl relative z-10">
          <Card className="backdrop-blur-sm bg-black/80 border-orange-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Join CultureBites
              </CardTitle>
              <CardDescription className="text-orange-100">Choose your role to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleSelect("host")}
                  className="p-8 border-2 border-orange-500/30 rounded-lg hover:border-amber-500 hover:bg-amber-500/10 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                  <h3 className="text-xl font-bold mb-2 text-orange-100">Host</h3>
                  <p className="text-sm text-orange-200/70">Share your space for culinary events</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("cook")}
                  className="p-8 border-2 border-orange-500/30 rounded-lg hover:border-orange-500 hover:bg-orange-500/10 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🍳</div>
                  <h3 className="text-xl font-bold mb-2 text-orange-100">Cook</h3>
                  <p className="text-sm text-orange-200/70">Showcase your culinary talents</p>
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
            <CardTitle className="text-2xl text-orange-100">Sign Up as {role === "host" ? "Host" : "Cook"}</CardTitle>
            <CardDescription className="text-orange-200/70">Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
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
                  <Label htmlFor="name" className="text-orange-100">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                      minLength={6}
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

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-orange-100">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 bg-black/50 border-orange-500/30 text-orange-100 placeholder:text-orange-300/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-2">
                  {!roleFromUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("role")}
                      className="flex-1 border-orange-500/30 text-orange-100 hover:bg-orange-500/10"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`${roleFromUrl ? "w-full" : "flex-1"} bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white`}
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
