"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { MissionTab } from "@/components/tabs/mission-tab"
import { TermsTab } from "@/components/tabs/terms-tab"
import { UsersTab } from "@/components/tabs/users-tab"
import { HostsTab } from "@/components/tabs/hosts-tab"
import { CooksTab } from "@/components/tabs/cooks-tab"
import { GuideTab } from "@/components/tabs/guide-tab"
import { resetAppData } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { toast } = useToast()

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      resetAppData()
      toast({
        title: "Data Cleared",
        description: "All events, hosts, and cooks have been removed.",
      })
      setTimeout(() => window.location.reload(), 500)
    }
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
            transform: "scale(1.1)", // Prevents blur edge artifacts
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="absolute right-0 top-0 text-orange-300 hover:text-red-400 hover:bg-red-950/30 text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Clear All Data</span>
            <span className="sm:hidden">Clear</span>
          </Button>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-balance mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            CultureBites
          </h1>
          <p className="text-sm sm:text-xl text-orange-100 text-balance font-medium tracking-wide">
            Meet, Greet, Eat, Repeat
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="mission" className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 sm:grid-cols-6 gap-1 mb-4 sm:mb-8 bg-black/40 backdrop-blur-sm border border-orange-500/30 p-1">
            <TabsTrigger
              value="mission"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              Mission
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              Terms
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              Guests
            </TabsTrigger>
            <TabsTrigger
              value="hosts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              Hosts
            </TabsTrigger>
            <TabsTrigger
              value="cooks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              Cooks
            </TabsTrigger>
            <TabsTrigger
              value="guide"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">How It Works</span>
              <span className="sm:hidden">Guide</span>
            </TabsTrigger>
          </TabsList>

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
