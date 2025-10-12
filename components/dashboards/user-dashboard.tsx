"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlipCard } from "@/components/flip-card"
import { DashboardNav } from "@/components/dashboard-nav"
import { AIRecommendations } from "@/components/ai-recommendations"
import type { Profile, Event } from "@/lib/types"
import Link from "next/link"

interface UserDashboardProps {
  profile: Profile
}

export default function UserDashboard({ profile }: UserDashboardProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFlipCard, setShowFlipCard] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const supabase = createClient()
    setIsLoading(true)

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("date", { ascending: true })
      .limit(20)

    if (!error && data) {
      setEvents(data)
    }
    setIsLoading(false)
  }

  const handleSurpriseMe = () => {
    setShowFlipCard(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <DashboardNav profile={profile} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.display_name}!</h1>
          <p className="text-muted-foreground">Discover your next culinary adventure</p>
        </div>

        {/* Surprise Me Button */}
        <div className="mb-8">
          <Button
            size="lg"
            onClick={handleSurpriseMe}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-lg px-8"
          >
            🎲 Surprise Me!
          </Button>
        </div>

        {/* Flip Card Modal */}
        {showFlipCard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:bg-white/20"
                onClick={() => setShowFlipCard(false)}
              >
                ✕
              </Button>
              <FlipCard events={events} />
            </div>
          </div>
        )}

        <div className="mb-12">
          <AIRecommendations userId={profile.id} preferences={profile.bio} />
        </div>

        {/* Upcoming Events Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Upcoming Events</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
              <p className="text-muted-foreground mb-4">No upcoming events yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for new culinary experiences!</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm bg-white/80 h-full">
                    <div className="relative h-48 bg-gradient-to-br from-orange-200 to-amber-200">
                      {event.image_url && (
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge className="absolute top-3 right-3 bg-white text-orange-600">{event.cuisine_type}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-semibold">${event.price_per_person} per person</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
