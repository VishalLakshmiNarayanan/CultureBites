"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HostCard } from "@/components/host-card"
import { CollaborationRequestDialog } from "@/components/collaboration-request-dialog"
import { CookProfileWizard } from "@/components/cook-profile-wizard"
import { Search, Plus, User, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getAppData } from "@/lib/local-storage"
import type { Host, CollaborationRequest, Cook, Event } from "@/lib/types"

export function CooksTab() {
  const [showProfileWizard, setShowProfileWizard] = useState(false)
  const [myCooks, setMyCooks] = useState<Cook[]>([])
  const [selectedCookId, setSelectedCookId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [minCapacity, setMinCapacity] = useState([0])
  const [hosts, setHosts] = useState<Host[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [myRequests, setMyRequests] = useState<CollaborationRequest[]>([])
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        setUserEmail(user.email || null)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    console.log("[v0] Refreshing cook data...")
    const data = await getAppData()

    console.log("[v0] Total cooks:", data.cooks.length)
    setMyCooks(data.cooks || [])

    if (!selectedCookId && data.cooks && data.cooks.length > 0) {
      setSelectedCookId(data.cooks[0].id)
    }

    setHosts(data.hosts || [])
    setEvents(data.events || [])

    if (selectedCookId) {
      const requests = (data.collaborationRequests || []).filter((r) => r.fromCookId === selectedCookId)
      setMyRequests(requests)
    }
  }

  useEffect(() => {
    if (selectedCookId) {
      refreshData()
    }
  }, [selectedCookId])

  const selectedCook = myCooks.find((c) => c.id === selectedCookId)

  const filteredHosts = (hosts || []).filter((host) => {
    const matchesSearch =
      searchQuery === "" ||
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.spaceTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCapacity = host.capacity >= minCapacity[0]

    return matchesSearch && matchesCapacity
  })

  const handleRequestCollaboration = (host: Host, eventId?: string) => {
    setSelectedHost(host)
    setSelectedEventId(eventId)
    setShowRequestDialog(true)
  }

  const pendingRequests = myRequests.filter((r) => r.status === "pending")
  const acceptedRequests = myRequests.filter((r) => r.status === "accepted")
  const declinedRequests = myRequests.filter((r) => r.status === "declined")

  if (myCooks.length === 0) {
    return (
      <div className="space-y-8">
        <GlassCard className="p-12 text-center space-y-4 bg-white/80 backdrop-blur-md">
          <p className="text-gray-700 text-lg font-semibold">No cook profile available</p>
          <p className="text-sm text-gray-600">Create a cook profile to start collaborating with hosts.</p>
          <Button
            onClick={() => setShowProfileWizard(true)}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Cook Profile
          </Button>
        </GlassCard>

        {userId && userEmail && (
          <CookProfileWizard
            open={showProfileWizard}
            onOpenChange={setShowProfileWizard}
            onSuccess={() => {
              setShowProfileWizard(false)
              refreshData()
            }}
            userId={userId}
            userEmail={userEmail}
          />
        )}
      </div>
    )
  }

  if (hosts.length === 0) {
    return (
      <div className="space-y-8">
        <GlassCard className="p-12 text-center bg-white/80 backdrop-blur-md">
          <p className="text-gray-700 text-lg font-semibold">No hosts available</p>
          <p className="text-sm text-gray-600 mt-2">
            Hosts need to create their spaces before you can send collaboration requests.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: My Profile & Find Hosts (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Selector Card */}
        <GlassCard className="p-4 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Active Cook Profile</Label>
              <Select value={selectedCookId || undefined} onValueChange={setSelectedCookId}>
                <SelectTrigger className="bg-white/60 border-orange-300">
                  <SelectValue placeholder="Select a cook profile" />
                </SelectTrigger>
                <SelectContent>
                  {myCooks.map((cook) => (
                    <SelectItem key={cook.id} value={cook.id}>
                      {cook.name} - {cook.originCountry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setShowProfileWizard(true)}
              size="sm"
              variant="outline"
              className="border-orange-400 text-orange-700 hover:bg-orange-100 mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </Button>
          </div>
        </GlassCard>

        {/* My Cook Profile Section */}
        {selectedCook && (
          <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">My Cook Profile</h2>
            <div className="space-y-4">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
                  {selectedCook.profileImage ? (
                    <img
                      src={selectedCook.profileImage || "/placeholder.svg"}
                      alt={selectedCook.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{selectedCook.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{selectedCook.originCountry}</span>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-sm font-semibold text-orange-600 mb-2">SPECIALTIES</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCook.specialties.map((specialty) => (
                    <Badge key={specialty} className="bg-orange-100 text-orange-700 border-orange-300">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div>
                <p className="text-sm font-semibold text-orange-600 mb-2">MY STORY</p>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedCook.story}</p>
              </div>

              {/* Cuisine Images */}
              {selectedCook.cuisineImages && selectedCook.cuisineImages.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-orange-600 mb-2">MY DISHES</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCook.cuisineImages.slice(0, 3).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-orange-200">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Dish ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Hosts</h2>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
              <Input
                placeholder="Search by location, space name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-orange-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500"
              />
            </div>

            {/* Capacity Filter */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Minimum Capacity: {minCapacity[0]}</Label>
              <Slider
                value={minCapacity}
                onValueChange={setMinCapacity}
                max={30}
                step={5}
                className="w-full [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-600"
              />
            </div>
          </div>
        </GlassCard>

        {/* Host Grid */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-amber-400">{filteredHosts.length} Spaces Available</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHosts.map((host) => {
              const hostEvents = events.filter((e) => e.hostId === host.id)
              return (
                <HostCard
                  key={host.id}
                  host={host}
                  events={hostEvents}
                  onRequestCollaboration={(eventId) => handleRequestCollaboration(host, eventId)}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Column: My Connections (1/3 width) */}
      <div className="space-y-6">
        <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Connections</h2>

          <div className="space-y-4">
            {/* Pending */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                  Pending
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {pendingRequests.length}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {pendingRequests.map((request) => {
                    const host = hosts.find((h) => h.id === request.toHostId)
                    const event = request.eventId ? events.find((e) => e.id === request.eventId) : null
                    return (
                      <div key={request.id} className="p-3 border-2 border-orange-200 rounded-lg text-sm bg-white/60">
                        <p className="font-semibold text-gray-800">{host?.name}</p>
                        <p className="text-gray-600">{host?.spaceTitle}</p>
                        {event && <p className="text-xs text-orange-600 mt-1">For: {event.title}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          Sent {new Date(request.createdAtISO).toLocaleDateString()}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Accepted */}
            {acceptedRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                  Accepted
                  <Badge className="bg-green-500 text-white">{acceptedRequests.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {acceptedRequests.map((request) => {
                    const host = hosts.find((h) => h.id === request.toHostId)
                    const event = request.eventId ? events.find((e) => e.id === request.eventId) : null
                    return (
                      <div key={request.id} className="p-3 border-2 border-green-300 rounded-lg text-sm bg-green-50">
                        <p className="font-semibold text-gray-800">{host?.name}</p>
                        <p className="text-gray-600">{host?.spaceTitle}</p>
                        {event && <p className="text-xs text-green-700 mt-1">Event: {event.title}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Declined */}
            {declinedRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                  Declined
                  <Badge variant="destructive">{declinedRequests.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {declinedRequests.map((request) => {
                    const host = hosts.find((h) => h.id === request.toHostId)
                    return (
                      <div
                        key={request.id}
                        className="p-3 border-2 border-gray-300 rounded-lg text-sm opacity-60 bg-white/40"
                      >
                        <p className="font-semibold text-gray-700">{host?.name}</p>
                        <p className="text-gray-600">{host?.spaceTitle}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {myRequests.length === 0 && (
              <p className="text-center text-gray-600 py-8 text-sm">
                No collaboration requests yet. Browse hosts and send a request!
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Collaboration Request Dialog */}
      {selectedCookId && selectedHost && (
        <CollaborationRequestDialog
          open={showRequestDialog}
          onOpenChange={setShowRequestDialog}
          host={selectedHost}
          cookId={selectedCookId}
          eventId={selectedEventId}
          onSuccess={refreshData}
        />
      )}

      {userId && userEmail && (
        <CookProfileWizard
          open={showProfileWizard}
          onOpenChange={setShowProfileWizard}
          onSuccess={() => {
            setShowProfileWizard(false)
            refreshData()
          }}
          userId={userId}
          userEmail={userEmail}
        />
      )}
    </div>
  )
}
