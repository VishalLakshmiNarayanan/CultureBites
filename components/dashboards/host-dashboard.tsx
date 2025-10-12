"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Profile, Contact, Event } from "@/lib/types"

interface HostDashboardProps {
  profile: Profile
}

export default function HostDashboard({ profile }: HostDashboardProps) {
  const [cooks, setCooks] = useState<Profile[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCook, setSelectedCook] = useState<Profile | null>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Event form state
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventCuisine, setEventCuisine] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventLocation, setEventLocation] = useState(profile.location || "")
  const [eventMaxGuests, setEventMaxGuests] = useState("")
  const [eventPrice, setEventPrice] = useState("")
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  useEffect(() => {
    fetchCooks()
    fetchContacts()
    fetchEvents()
  }, [])

  const fetchCooks = async () => {
    const supabase = createClient()
    setIsLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "cook")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setCooks(data)
    }
    setIsLoading(false)
  }

  const fetchContacts = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setContacts(data)
    }
  }

  const fetchEvents = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("host_id", profile.id)
      .order("date", { ascending: false })

    if (!error && data) {
      setEvents(data)
    }
  }

  const handleContactCook = async () => {
    if (!selectedCook || !message.trim()) return

    const supabase = createClient()
    setIsSending(true)

    try {
      const { error } = await supabase.from("contacts").insert({
        sender_id: profile.id,
        recipient_id: selectedCook.id,
        message: message.trim(),
        status: "pending",
      })

      if (error) throw error

      setMessage("")
      setSelectedCook(null)
      fetchContacts()
      alert("Message sent successfully!")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleCreateEvent = async () => {
    if (
      !eventTitle ||
      !eventDescription ||
      !eventCuisine ||
      !eventDate ||
      !eventTime ||
      !eventMaxGuests ||
      !eventPrice
    ) {
      alert("Please fill in all required fields")
      return
    }

    const supabase = createClient()
    setIsCreatingEvent(true)

    try {
      const { error } = await supabase.from("events").insert({
        host_id: profile.id,
        title: eventTitle,
        description: eventDescription,
        cuisine_type: eventCuisine,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        max_guests: Number.parseInt(eventMaxGuests),
        price_per_person: Number.parseFloat(eventPrice),
        status: "upcoming",
      })

      if (error) throw error

      // Reset form
      setEventTitle("")
      setEventDescription("")
      setEventCuisine("")
      setEventDate("")
      setEventTime("")
      setEventMaxGuests("")
      setEventPrice("")
      setShowCreateEvent(false)
      fetchEvents()
      alert("Event created successfully!")
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setIsCreatingEvent(false)
    }
  }

  const filteredCooks = cooks.filter(
    (cook) =>
      cook.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cook.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cook.cuisine_specialties?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sentContacts = contacts.filter((c) => c.sender_id === profile.id)
  const receivedContacts = contacts.filter((c) => c.recipient_id === profile.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <DashboardNav profile={profile} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
          <p className="text-muted-foreground">Manage your space and connect with chefs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Chefs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cooks.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sentContacts.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{receivedContacts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cooks" className="space-y-6">
          <TabsList className="bg-white/80">
            <TabsTrigger value="cooks">Discover Chefs</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
          </TabsList>

          {/* Discover Chefs Tab */}
          <TabsContent value="cooks" className="space-y-6">
            <div className="flex items-center justify-between">
              <Input
                type="search"
                placeholder="Search chefs by name, location, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md bg-white/80"
              />
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse backdrop-blur-sm bg-white/80">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCooks.length === 0 ? (
              <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
                <p className="text-muted-foreground">No chefs found matching your search</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCooks.map((cook) => (
                  <Card key={cook.id} className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{cook.display_name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{cook.location || "Location not specified"}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cook.experience_years && (
                          <div className="flex items-center gap-2 text-sm">
                            <span>⭐</span>
                            <span>{cook.experience_years} years of experience</span>
                          </div>
                        )}
                        {cook.cuisine_specialties && cook.cuisine_specialties.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Specialties:</p>
                            <div className="flex flex-wrap gap-1">
                              {cook.cuisine_specialties.slice(0, 4).map((cuisine, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {cuisine}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {cook.bio && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{cook.bio}</p>}
                        <Button
                          onClick={() => setSelectedCook(cook)}
                          className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                        >
                          Contact Chef
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowCreateEvent(true)} className="bg-orange-600 hover:bg-orange-700">
                Create New Event
              </Button>
            </div>

            {events.length === 0 ? (
              <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
                <p className="text-muted-foreground mb-4">You haven't created any events yet</p>
                <Button onClick={() => setShowCreateEvent(true)} className="bg-orange-600 hover:bg-orange-700">
                  Create Your First Event
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                        <Badge
                          variant={
                            event.status === "upcoming"
                              ? "default"
                              : event.status === "completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>🍽️</span>
                          <span>{event.cuisine_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>Max {event.max_guests} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-semibold">${event.price_per_person} per person</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sent Messages */}
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                  <CardDescription>Messages you've sent to chefs</CardDescription>
                </CardHeader>
                <CardContent>
                  {sentContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No messages sent yet</p>
                  ) : (
                    <div className="space-y-4">
                      {sentContacts.map((contact) => (
                        <div key={contact.id} className="border-b pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">To: Chef</span>
                            <Badge
                              variant={
                                contact.status === "accepted"
                                  ? "default"
                                  : contact.status === "declined"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Received Messages */}
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle>Received Messages</CardTitle>
                  <CardDescription>Messages from chefs</CardDescription>
                </CardHeader>
                <CardContent>
                  {receivedContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No messages received yet</p>
                  ) : (
                    <div className="space-y-4">
                      {receivedContacts.map((contact) => (
                        <div key={contact.id} className="border-b pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">From: Chef</span>
                            <Badge
                              variant={
                                contact.status === "accepted"
                                  ? "default"
                                  : contact.status === "declined"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Chef Dialog */}
      <Dialog open={!!selectedCook} onOpenChange={(open) => !open && setSelectedCook(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedCook?.display_name}</DialogTitle>
            <DialogDescription>Send a message to discuss hosting an event at your space</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cook-message">Your Message</Label>
              <Textarea
                id="cook-message"
                placeholder="Hi! I'd love to host an event at my space..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedCook(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleContactCook}
                disabled={isSending || !message.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details for your upcoming event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input
                id="event-title"
                placeholder="e.g., Italian Night Under the Stars"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                placeholder="Describe your event..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-cuisine">Cuisine Type *</Label>
                <Input
                  id="event-cuisine"
                  placeholder="e.g., Italian"
                  value={eventCuisine}
                  onChange={(e) => setEventCuisine(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-max-guests">Max Guests *</Label>
                <Input
                  id="event-max-guests"
                  type="number"
                  placeholder="12"
                  value={eventMaxGuests}
                  onChange={(e) => setEventMaxGuests(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time *</Label>
                <Input id="event-time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">Location *</Label>
              <Input
                id="event-location"
                placeholder="Brooklyn, NY"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-price">Price per Person ($) *</Label>
              <Input
                id="event-price"
                type="number"
                step="0.01"
                placeholder="75.00"
                value={eventPrice}
                onChange={(e) => setEventPrice(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={isCreatingEvent}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isCreatingEvent ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
