"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/signup")
      } else {
        const role = user.user_metadata?.role
        if (role === "host") {
          router.push("/dashboard?tab=hosts")
        } else if (role === "cook") {
          router.push("/dashboard?tab=cooks")
        } else {
          router.push("/dashboard?tab=users")
        }
      }
    }

    checkAuth()
  }, [router])

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
