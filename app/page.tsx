"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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
    <div className="min-h-screen w-full bg-black relative">
      {/* Ember Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
          `,
        }}
      />

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
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-black/40 backdrop-blur-sm border border-orange-500/30">
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
