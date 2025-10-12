"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { UserRole } from "@/lib/types"

export default function SignUpPage() {
  const [step, setStep] = useState<"role" | "details">("role")
  const [role, setRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Role-specific fields
  const [spaceType, setSpaceType] = useState("")
  const [spaceCapacity, setSpaceCapacity] = useState("")
  const [cuisineSpecialties, setCuisineSpecialties] = useState("")
  const [experienceYears, setExperienceYears] = useState("")

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep("details")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Prepare metadata based on role
      const metadata: Record<string, unknown> = {
        role,
        display_name: displayName,
        bio,
        location,
      }

      if (role === "host") {
        metadata.space_type = spaceType
        metadata.space_capacity = spaceCapacity ? Number.parseInt(spaceCapacity) : null
      } else if (role === "cook") {
        metadata.cuisine_specialties = cuisineSpecialties.split(",").map((s) => s.trim())
        metadata.experience_years = experienceYears ? Number.parseInt(experienceYears) : null
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: metadata,
        },
      })

      if (signUpError) throw signUpError

      router.push("/auth/signup-success")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "role") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="w-full max-w-4xl">
          <Card className="backdrop-blur-sm bg-white/90">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Choose Your Role</CardTitle>
              <CardDescription>Select how you want to participate in Melting Pot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleRoleSelect("user")}
                  className="p-8 border-2 border-border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
                  <h3 className="text-xl font-bold mb-2">Diner</h3>
                  <p className="text-sm text-muted-foreground">Discover and book unique dining experiences</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("host")}
                  className="p-8 border-2 border-border rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                  <h3 className="text-xl font-bold mb-2">Host</h3>
                  <p className="text-sm text-muted-foreground">Share your space for culinary events</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("cook")}
                  className="p-8 border-2 border-border rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-center group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🍳</div>
                  <h3 className="text-xl font-bold mb-2">Chef</h3>
                  <p className="text-sm text-muted-foreground">Showcase your culinary talents</p>
                </button>
              </div>

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-orange-600 hover:underline">
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
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl">
              Sign Up as {role === "user" ? "Diner" : role === "host" ? "Host" : "Chef"}
            </CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="New York, NY"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>

                {role === "host" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="spaceType">Space Type</Label>
                      <Input
                        id="spaceType"
                        type="text"
                        placeholder="e.g., Rooftop, Garden, Loft"
                        value={spaceType}
                        onChange={(e) => setSpaceType(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="spaceCapacity">Space Capacity</Label>
                      <Input
                        id="spaceCapacity"
                        type="number"
                        placeholder="Maximum guests"
                        value={spaceCapacity}
                        onChange={(e) => setSpaceCapacity(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {role === "cook" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="cuisineSpecialties">Cuisine Specialties</Label>
                      <Input
                        id="cuisineSpecialties"
                        type="text"
                        placeholder="e.g., Italian, Japanese, French"
                        value={cuisineSpecialties}
                        onChange={(e) => setCuisineSpecialties(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        placeholder="Years"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep("role")} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-orange-600 hover:bg-orange-700">
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
