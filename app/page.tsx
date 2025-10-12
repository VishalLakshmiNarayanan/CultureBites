"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MissionTab } from "@/components/tabs/mission-tab"
import { TermsTab } from "@/components/tabs/terms-tab"
import { UsersTab } from "@/components/tabs/users-tab"
import { HostsTab } from "@/components/tabs/hosts-tab"
import { CooksTab } from "@/components/tabs/cooks-tab"
import { GuideTab } from "@/components/tabs/guide-tab"
import { logoutUser } from "@/app/auth/actions"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("mission")
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string; displayName: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Checking authentication")
    const email = getCookie("user_email")
    const role = getCookie("user_role")
    const displayName = getCookie("user_name")

    console.log("[v0] Cookies found:", { email, role, displayName })

    if (email) {
      const currentUser = {
        email,
        role: role || "",
        displayName: displayName || email,
      }
      console.log("[v0] Current user:", currentUser)
      setUser(currentUser)
    } else {
      console.log("[v0] No user found")
      setUser(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tab = searchParams.get("tab")
    if (tab) {
      console.log("[v0] Setting active tab from URL:", tab)
      setActiveTab(tab)
    }
  }, [searchParams])

  const navItems = [
    { value: "mission", label: "Mission", requiresAuth: false },
    { value: "terms", label: "Terms", requiresAuth: false },
    { value: "users", label: "Guests", requiresAuth: false },
    { value: "hosts", label: "Hosts", requiresAuth: true, role: "host" },
    { value: "cooks", label: "Cooks", requiresAuth: true, role: "cook" },
    { value: "guide", label: "How It Works", requiresAuth: false },
  ]

  const handleNavClick = async (value: string) => {
    const navItem = navItems.find((item) => item.value === value)

    if (navItem?.requiresAuth && !user) {
      // Redirect to auth selection page
      console.log("[v0] User not authenticated, redirecting to auth")
      router.push(`/auth/select?role=${navItem.role}`)
      setMenuOpen(false)
      return
    }

    // If switching to a public tab (non-role tab) and user is logged in, log them out
    if (!navItem?.requiresAuth && user && value !== "users") {
      console.log("[v0] Logging out user when switching to public tab:", value)
      await logoutUser()
      setUser(null)
    }

    console.log("[v0] Navigating to tab:", value)
    setActiveTab(value)
    // Update URL to reflect the new tab
    router.push(`/?tab=${value}`)
    setMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/cooking-together.png')`,
            filter: "blur(3px)",
            opacity: 0.7,
            transform: "scale(1.1)",
          }}
        />

        {/* Black/Dark Tint Overlay */}
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

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 relative">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-0 top-0 text-orange-300 hover:text-orange-400 hover:bg-orange-950/30"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black/95 border-orange-500/30 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-orange-400 text-xl font-bold">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    onClick={() => handleNavClick(item.value)}
                    className={`justify-start text-left text-base py-6 ${
                      activeTab === item.value
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                        : "text-orange-200 hover:text-orange-400 hover:bg-orange-950/30"
                    }`}
                  >
                    {item.label}
                    {item.requiresAuth && !user && <span className="ml-auto text-xs">🔒</span>}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {user && (
            <div className="absolute left-12 sm:left-14 top-0 flex flex-row items-center gap-1">
              <span className="text-orange-300 text-xs sm:text-sm font-medium">Hello,</span>
              <span className="text-orange-400 text-sm sm:text-base font-bold">{user.displayName}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <img
              src="/images/logo.png"
              alt="CultureBites Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain"
            />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              CultureBites
            </h1>
          </div>

          <p className="text-sm sm:text-xl text-orange-100 text-balance font-medium tracking-wide">
            Meet, Greet, Eat, Repeat
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleNavClick} className="w-full">
          <TabsContent value="mission">
            <MissionTab />
          </TabsContent>

          <TabsContent value="terms">
            <TermsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="hosts">{user ? <HostsTab /> : null}</TabsContent>

          <TabsContent value="cooks">{user ? <CooksTab /> : null}</TabsContent>

          <TabsContent value="guide">
            <GuideTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
