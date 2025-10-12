"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FlipCuisineCard } from "@/components/flip-cuisine-card"
import { GlassCard } from "@/components/glass-card"
import { Search, Shuffle } from "lucide-react"
import { getAppData } from "@/lib/local-storage"
import type { Event, Cook, Host } from "@/lib/types"
import { cn } from "@/lib/utils"

const CUISINE_TAGS = ["Mexican", "Japanese", "Lebanese", "Italian", "Indian", "French"]

export function UsersTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [cooks, setCooks] = useState<Cook[]>([])
  const [hosts, setHosts] = useState<Host[]>([])
  const [savedEventIds, setSavedEventIds] = useState<string[]>([])
  const [surpriseEventId, setSurpriseEventId] = useState<string | null>(null)

  useEffect(() => {
    const data = getAppData()
    console.log("[v0] Loading events. Total events:", data.events.length)
    console.log("[v0] Total collaboration requests:", data.collaborationRequests.length)

    const eventsWithCooks = data.events.filter((event) => {
      if (!event.cookId) {
        console.log("[v0] Event", event.id, "has no cook assigned")
        return false
      }
      const hasAcceptedCollab = data.collaborationRequests.some(
        (req) => req.toHostId === event.hostId && req.fromCookId === event.cookId && req.status === "accepted",
      )
      if (!hasAcceptedCollab) {
        console.log("[v0] Event", event.id, "has no accepted collaboration")
      }
      return hasAcceptedCollab
    })

    console.log("[v0] Events with accepted collaborations:", eventsWithCooks.length)
    setEvents(eventsWithCooks)
    setCooks(data.cooks)
    setHosts(data.hosts)

    const saved = localStorage.getItem("saved-events")
    if (saved) {
      setSavedEventIds(JSON.parse(saved))
    }
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.includes(event.cuisine)

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const toggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) => {
      const updated = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
      localStorage.setItem("saved-events", JSON.stringify(updated))
      return updated
    })
  }

  const handleSurpriseMe = () => {
    if (filteredEvents.length === 0) return
    const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)]
    setSurpriseEventId(randomEvent.id)
    // Scroll to the event
    setTimeout(() => {
      const element = document.getElementById(`event-${randomEvent.id}`)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  const getEventHost = (hostId: string) => hosts.find((h) => h.id === hostId)
  const getEventCook = (cookId?: string) => (cookId ? cooks.find((c) => c.id === cookId) : undefined)

  const getCookCuisineImage = (cookId?: string) => {
    if (!cookId) return "/diverse-food-spread.png"
    const cook = cooks.find((c) => c.id === cookId)
    return cook?.cuisineImages?.[0] || "/diverse-food-spread.png"
  }

  if (events.length === 0 && cooks.length === 0 && hosts.length === 0) {
    return (
      <div className="space-y-8">
        <GlassCard className="p-12 text-center">
          <p className="text-orange-200 text-lg">No info available</p>
          <p className="text-sm text-orange-300/70 mt-2">
            Hosts need to create events and cooks need to collaborate before events appear here.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
            <Input
              placeholder="Search by cuisine, dish, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 border-orange-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CUISINE_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                    : "border-orange-400 text-orange-700 hover:bg-orange-100",
                )}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Button
            onClick={handleSurpriseMe}
            disabled={filteredEvents.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Surprise Me
          </Button>
        </div>
      </GlassCard>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-gray-700">No events available yet. Check back soon!</p>
        </GlassCard>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {filteredEvents.length} Events Available
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const cuisineImage = getCookCuisineImage(event.cookId)
              const isHighlighted = surpriseEventId === event.id

              return (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className={cn(
                    "transition-all duration-300",
                    isHighlighted && "ring-4 ring-orange-500 ring-offset-4 rounded-lg",
                  )}
                >
                  <FlipCuisineCard
                    event={event}
                    host={getEventHost(event.hostId)}
                    cook={getEventCook(event.cookId)}
                    onSave={() => toggleSaveEvent(event.id)}
                    isSaved={savedEventIds.includes(event.id)}
                    cuisineImage={cuisineImage}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
