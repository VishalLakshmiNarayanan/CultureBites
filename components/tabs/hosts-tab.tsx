"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HostEventWizard } from "@/components/host-event-wizard"
import { HostProfileWizard } from "@/components/host-profile-wizard"
import { CookCard } from "@/components/cook-card"
import { CollaborationRequestDialog } from "@/components/collaboration-request-dialog"
import { Plus, MapPin, Users } from "lucide-react"
import { getAppData, saveAppData } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import type { Host, Event, SeatRequest, CollaborationRequest, Cook } from "@/lib/types"

export function HostsTab() {
  const [showProfileWizard, setShowProfileWizard] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [myHosts, setMyHosts] = useState<Host[]>([])
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null)
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [seatRequests, setSeatRequests] = useState<SeatRequest[]>([])
  const [collabRequests, setCollabRequests] = useState<CollaborationRequest[]>([])
  const [cooks, setCooks] = useState<Cook[]>([])
  const [selectedCook, setSelectedCook] = useState<Cook | null>(null)
  const [showCookRequestDialog, setShowCookRequestDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    const data = getAppData()
    setMyHosts(data.hosts)

    if (!selectedHostId && data.hosts.length > 0) {
      setSelectedHostId(data.hosts[0].id)
    }

    setCooks(data.cooks)

    if (selectedHostId) {
      const hostEvents = data.events.filter((e) => e.hostId === selectedHostId)
      setMyEvents(hostEvents)

      const eventIds = hostEvents.map((e) => e.id)
      const requests = data.seatRequests.filter((r) => eventIds.includes(r.eventId))
      setSeatRequests(requests)

      const collabs = data.collaborationRequests.filter((r) => r.toHostId === selectedHostId)
      setCollabRequests(collabs)
    }
  }

  useEffect(() => {
    if (selectedHostId) {
      refreshData()
    }
  }, [selectedHostId])

  const selectedHost = myHosts.find((h) => h.id === selectedHostId)

  const handleAcceptCollaboration = (requestId: string) => {
    const data = getAppData()
    const request = data.collaborationRequests.find((r) => r.id === requestId)

    const updatedRequests = data.collaborationRequests.map((r) =>
      r.id === requestId ? { ...r, status: "accepted" as const } : r,
    )

    let updatedEvents = data.events
    if (request?.eventId) {
      updatedEvents = data.events.map((e) => (e.id === request.eventId ? { ...e, cookId: request.fromCookId } : e))
    }

    saveAppData({
      ...data,
      collaborationRequests: updatedRequests,
      events: updatedEvents,
    })

    toast({
      title: "Request accepted",
      description: "The collaboration request has been accepted. The cook has been assigned to the event.",
    })

    refreshData()
  }

  const handleDeclineCollaboration = (requestId: string) => {
    const data = getAppData()
    const updatedRequests = data.collaborationRequests.map((r) =>
      r.id === requestId ? { ...r, status: "declined" as const } : r,
    )

    saveAppData({
      ...data,
      collaborationRequests: updatedRequests,
    })

    toast({
      title: "Request declined",
      description: "The collaboration request has been declined.",
    })

    refreshData()
  }

  const handleApproveSeat = (requestId: string) => {
    const data = getAppData()
    const updatedRequests = data.seatRequests.map((r) =>
      r.id === requestId ? { ...r, status: "approved" as const } : r,
    )

    saveAppData({
      ...data,
      seatRequests: updatedRequests,
    })

    toast({
      title: "Seat approved",
      description: "The seat request has been approved.",
    })

    refreshData()
  }

  const handleWaitlistSeat = (requestId: string, eventId: string) => {
    const data = getAppData()
    const updatedRequests = data.seatRequests.map((r) =>
      r.id === requestId ? { ...r, status: "waitlist" as const } : r,
    )

    const updatedEvents = data.events.map((e) => (e.id === eventId ? { ...e, seatsLeft: e.seatsLeft + 1 } : e))

    saveAppData({
      ...data,
      seatRequests: updatedRequests,
      events: updatedEvents,
    })

    toast({
      title: "Added to waitlist",
      description: "The guest has been added to the waitlist.",
    })

    refreshData()
  }

  const handleDeclineSeat = (requestId: string, eventId: string) => {
    const data = getAppData()
    const updatedRequests = data.seatRequests.map((r) =>
      r.id === requestId ? { ...r, status: "declined" as const } : r,
    )

    const updatedEvents = data.events.map((e) => (e.id === eventId ? { ...e, seatsLeft: e.seatsLeft + 1 } : e))

    saveAppData({
      ...data,
      seatRequests: updatedRequests,
      events: updatedEvents,
    })

    toast({
      title: "Request declined",
      description: "The seat request has been declined and the seat restored.",
    })

    refreshData()
  }

  const handleRequestCookCollaboration = (cook: Cook) => {
    setSelectedCook(cook)
    setShowCookRequestDialog(true)
  }

  const upcomingEvents = myEvents.filter((e) => new Date(e.dateISO) >= new Date())
  const pastEvents = myEvents.filter((e) => new Date(e.dateISO) < new Date())

  if (myHosts.length === 0) {
    return (
      <div className="space-y-8">
        <GlassCard className="p-12 text-center space-y-4 bg-white/80 backdrop-blur-md">
          <p className="text-gray-700 text-lg font-semibold">No host profile available</p>
          <p className="text-sm text-gray-600">Create a host profile to start hosting events.</p>
          <Button
            onClick={() => setShowProfileWizard(true)}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Host Profile
          </Button>
        </GlassCard>

        <HostProfileWizard open={showProfileWizard} onOpenChange={setShowProfileWizard} onSuccess={refreshData} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: My Space & Events */}
      <div className="space-y-6">
        <GlassCard className="p-4 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-700 mb-2 block">Active Host Profile</div>
              <Select value={selectedHostId || undefined} onValueChange={setSelectedHostId}>
                <SelectTrigger className="bg-white/60 border-orange-300">
                  <SelectValue placeholder="Select a host profile" />
                </SelectTrigger>
                <SelectContent>
                  {myHosts.map((host) => (
                    <SelectItem key={host.id} value={host.id}>
                      {host.name} - {host.spaceTitle}
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

        {selectedHost && (
          <>
            <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">My Space</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{selectedHost.spaceTitle}</h3>
                <p className="text-gray-600">{selectedHost.spaceDesc}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {selectedHost.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-orange-500" />
                    Capacity: {selectedHost.capacity}
                  </div>
                </div>
              </div>
            </GlassCard>

            <Button
              onClick={() => setShowWizard(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>

            <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">My Events</h2>
              <Tabs defaultValue="upcoming">
                <TabsList className="grid w-full grid-cols-2 bg-gray-200">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                  >
                    Upcoming ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                  >
                    Past ({pastEvents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-3 mt-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No upcoming events</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 border-2 border-orange-200 rounded-lg space-y-2 bg-white/60">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(event.dateISO).toLocaleDateString()} • {event.startTime}
                            </p>
                          </div>
                          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                            {event.cuisine}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>
                            {event.seatsLeft} / {event.seatsTotal} seats available
                          </span>
                        </div>
                        {seatRequests.filter((r) => r.eventId === event.id && r.status === "pending").length > 0 && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {seatRequests.filter((r) => r.eventId === event.id && r.status === "pending").length}{" "}
                            pending requests
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-3 mt-4">
                  {pastEvents.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No past events</p>
                  ) : (
                    pastEvents.map((event) => (
                      <div key={event.id} className="p-4 border-2 border-gray-300 rounded-lg opacity-60 bg-white/40">
                        <h4 className="font-semibold text-gray-700">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.dateISO).toLocaleDateString()} • {event.startTime}
                        </p>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </GlassCard>

            <GlassCard className="p-6 bg-black/40 backdrop-blur-md border-orange-500/30">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Browse Cooks</h2>
              {cooks.length === 0 ? (
                <p className="text-center text-orange-200/70 py-8">
                  No cooks available yet. Cooks need to create their profiles first.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-900">Find talented cooks to collaborate with for your events</p>
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                    {cooks.map((cook) => (
                      <CookCard
                        key={cook.id}
                        cook={cook}
                        onRequestCollaboration={() => handleRequestCookCollaboration(cook)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </div>

      {/* Right Column: Connections */}
      <div className="space-y-6">
        {selectedHost && (
          <GlassCard className="p-6 bg-white/80 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Connections Inbox</h2>

            <Tabs defaultValue="collaborations">
              <TabsList className="grid w-full grid-cols-2 bg-gray-200">
                <TabsTrigger
                  value="collaborations"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  Collaborations ({collabRequests.filter((r) => r.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger
                  value="seats"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  Seat Requests ({seatRequests.filter((r) => r.status === "pending").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="collaborations" className="space-y-3 mt-4">
                {collabRequests.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No collaboration requests</p>
                ) : (
                  collabRequests.map((request) => {
                    const cook = getAppData().cooks.find((c) => c.id === request.fromCookId)
                    const event = request.eventId ? myEvents.find((e) => e.id === request.eventId) : null
                    return (
                      <div key={request.id} className="p-4 border-2 border-orange-200 rounded-lg space-y-3 bg-white/60">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{cook?.name || "Unknown Cook"}</p>
                            <p className="text-sm text-gray-600">
                              {cook?.originCountry} • {cook?.specialties.join(", ")}
                            </p>
                            {event && (
                              <p className="text-sm font-medium text-orange-600 mt-1">For event: {event.title}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(request.createdAtISO).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.status === "accepted"
                                ? "default"
                                : request.status === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={request.status === "accepted" ? "bg-green-500 text-white" : ""}
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{request.message}</p>
                        {request.proposedDishes.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-1 text-gray-800">Proposed dishes:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.proposedDishes.map((dish, i) => (
                                <Badge key={i} variant="outline" className="border-orange-400 text-orange-700">
                                  {dish}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                              onClick={() => handleAcceptCollaboration(request.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-orange-400 text-orange-700 hover:bg-orange-100 bg-transparent"
                              onClick={() => handleDeclineCollaboration(request.id)}
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="seats" className="space-y-3 mt-4">
                {seatRequests.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No seat requests</p>
                ) : (
                  seatRequests.map((request) => {
                    const event = myEvents.find((e) => e.id === request.eventId)
                    return (
                      <div key={request.id} className="p-4 border-2 border-orange-200 rounded-lg space-y-2 bg-white/60">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{request.guestName}</p>
                            <p className="text-sm text-gray-600">{event?.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(request.createdAtISO).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={request.status === "approved" ? "bg-green-500 text-white" : ""}
                          >
                            {request.status}
                          </Badge>
                        </div>
                        {request.note && <p className="text-sm text-gray-600">{request.note}</p>}
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                              onClick={() => handleApproveSeat(request.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-orange-400 text-orange-700 hover:bg-orange-100 bg-transparent"
                              onClick={() => handleWaitlistSeat(request.id, request.eventId)}
                            >
                              Waitlist
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-red-400 text-red-700 hover:bg-red-100 bg-transparent"
                              onClick={() => handleDeclineSeat(request.id, request.eventId)}
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </TabsContent>
            </Tabs>
          </GlassCard>
        )}
      </div>

      {selectedHostId && (
        <>
          <HostEventWizard
            open={showWizard}
            onOpenChange={setShowWizard}
            hostId={selectedHostId}
            onSuccess={refreshData}
          />

          {selectedCook && (
            <CollaborationRequestDialog
              open={showCookRequestDialog}
              onOpenChange={setShowCookRequestDialog}
              cook={selectedCook}
              hostId={selectedHostId}
              onSuccess={refreshData}
            />
          )}
        </>
      )}

      <HostProfileWizard open={showProfileWizard} onOpenChange={setShowProfileWizard} onSuccess={refreshData} />
    </div>
  )
}
