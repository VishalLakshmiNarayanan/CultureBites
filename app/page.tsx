"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { MissionTab } from "@/components/tabs/mission-tab"
import { TermsTab } from "@/components/tabs/terms-tab"
import { UsersTab } from "@/components/tabs/users-tab"
import { HostsTab } from "@/components/tabs/hosts-tab"
import { CooksTab } from "@/components/tabs/cooks-tab"
import { resetAppData } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { toast } = useToast()

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      resetAppData()
      toast({
        title: "Data Cleared",
        description: "All events, hosts, and cooks have been removed. Refresh the page to see changes.",
      })
      window.location.reload()
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="absolute right-0 top-0 text-orange-300 hover:text-red-400 hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>

          <h1 className="text-6xl font-bold text-balance mb-3 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            CultureBites
          </h1>
          <p className="text-xl text-orange-100 text-balance font-medium tracking-wide">Meet, Greet, Eat, Repeat</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="mission" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8 bg-black/40 backdrop-blur-sm border border-orange-500/30">
            <TabsTrigger
              value="mission"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200"
            >
              Mission
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200"
            >
              Terms
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200"
            >
              Guests
            </TabsTrigger>
            <TabsTrigger
              value="hosts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200"
            >
              Hosts
            </TabsTrigger>
            <TabsTrigger
              value="cooks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-200"
            >
              Cooks
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
        </Tabs>
      </div>
    </div>
  )
}
