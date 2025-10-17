"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HostProfileWizard } from "@/components/host-profile-wizard"
import { CookProfileWizard } from "@/components/cook-profile-wizard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [showHostWizard, setShowHostWizard] = useState(false)
  const [showCookWizard, setShowCookWizard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const userRole = user.user_metadata?.role || searchParams.get("role")
      setRole(userRole)
      setUserEmail(user.email || null)
      setUserId(user.id)

      // Auto-open wizard based on role
      if (userRole === "host") {
        setShowHostWizard(true)
      } else if (userRole === "cook") {
        setShowCookWizard(true)
      } else if (userRole === "user") {
        // Guests don't need profile creation, redirect to events
        router.push("/dashboard?tab=users")
      }

      setIsLoading(false)
    }

    loadUser()
  }, [router, searchParams])

  const handleProfileSuccess = () => {
    if (role === "host") {
      router.push("/dashboard?tab=hosts")
    } else if (role === "cook") {
      router.push("/dashboard?tab=cooks")
    } else {
      router.push("/dashboard?tab=users")
    }
  }

  const handleSkip = () => {
    if (role === "host") {
      router.push("/dashboard?tab=hosts")
    } else if (role === "cook") {
      router.push("/dashboard?tab=cooks")
    } else {
      router.push("/dashboard?tab=users")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
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
        <div className="relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-400">Complete Your Profile</CardTitle>
            <CardDescription className="text-orange-200/80">
              {role === "host"
                ? "Set up your hosting space to start welcoming guests"
                : role === "cook"
                  ? "Create your chef profile to showcase your culinary skills"
                  : "Welcome to CultureBites!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {role === "host" && (
              <Button
                onClick={() => setShowHostWizard(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Create Host Profile
              </Button>
            )}
            {role === "cook" && (
              <Button
                onClick={() => setShowCookWizard(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Create Cook Profile
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip} className="w-full text-orange-300 hover:text-orange-400">
              Skip for now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Host Profile Wizard */}
      {role === "host" && userEmail && userId && (
        <HostProfileWizard
          open={showHostWizard}
          onOpenChange={setShowHostWizard}
          onSuccess={handleProfileSuccess}
          userEmail={userEmail}
          userId={userId}
        />
      )}

      {/* Cook Profile Wizard */}
      {role === "cook" && userEmail && userId && (
        <CookProfileWizard
          open={showCookWizard}
          onOpenChange={setShowCookWizard}
          onSuccess={handleProfileSuccess}
          userEmail={userEmail}
          userId={userId}
        />
      )}
    </div>
  )
}
