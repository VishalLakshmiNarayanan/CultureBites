"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User } from "lucide-react"
import { MissionTab } from "@/components/tabs/mission-tab"
import { TermsTab } from "@/components/tabs/terms-tab"
import { UsersTab } from "@/components/tabs/users-tab"
import { HostsTab } from "@/components/tabs/hosts-tab"
import { CooksTab } from "@/components/tabs/cooks-tab"
import { GuideTab } from "@/components/tabs/guide-tab"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "mission")
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/signup")
        return
      }

      setUser({
        email: authUser.email || "",
        role: authUser.user_metadata?.role,
      })
      setIsLoading(false)
    }

    loadUser()
  }, [router])

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const navItems = [
    { value: "mission", label: "Mission" },
    { value: "terms", label: "Terms" },
    { value: "users", label: "Guests" },
    { value: "hosts", label: "Hosts" },
    { value: "cooks", label: "Cooks" },
    { value: "guide", label: "How It Works" },
  ]

  const handleNavClick = (value: string) => {
    setActiveTab(value)
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setMenuOpen(false)
    router.push("/auth/signup")
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
                  </Button>
                ))}

                <div className="mt-6 pt-6 border-t border-orange-500/30">
                  {user && (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-orange-300 text-sm mb-2">
                        <User className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-orange-200 hover:text-orange-400 hover:bg-orange-950/30"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="mission">
            <MissionTab />
          </TabsContent>

          <TabsContent value="terms">
            <TermsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="hosts">
            <HostsTab />
          </TabsContent>

          <TabsContent value="cooks">
            <CooksTab />
          </TabsContent>

          <TabsContent value="guide">
            <GuideTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
