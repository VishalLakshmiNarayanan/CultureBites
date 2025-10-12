"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Event, Profile } from "@/lib/types"
import Link from "next/link"

interface EventDetailsProps {
  event: Event
  host: Profile | null
  cook: Profile | null
  currentUser: Profile | null
}

export function EventDetails({ event, host, cook, currentUser }: EventDetailsProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [guestsCount, setGuestsCount] = useState("1")
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()

  const handleBooking = async () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    if (currentUser.role !== "user") {
      alert("Only diners can book events")
      return
    }

    const guests = Number.parseInt(guestsCount)
    if (guests < 1 || guests > event.max_guests) {
      alert(`Please enter a valid number of guests (1-${event.max_guests})`)
      return
    }

    const supabase = createClient()
    setIsBooking(true)

    try {
      const totalPrice = event.price_per_person * guests

      const { error } = await supabase.from("bookings").insert({
        event_id: event.id,
        user_id: currentUser.id,
        guests_count: guests,
        total_price: totalPrice,
        status: "confirmed",
      })

      if (error) {
        if (error.code === "23505") {
          alert("You have already booked this event")
        } else {
          throw error
        }
      } else {
        alert("Booking confirmed! Check your bookings page for details.")
        setShowBookingDialog(false)
      }
    } catch (error) {
      console.error("[v0] Error creating booking:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const totalPrice = event.price_per_person * Number.parseInt(guestsCount || "1")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
          >
            Melting Pot
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80">
              <div className="relative h-96 bg-gradient-to-br from-orange-200 to-amber-200">
                {event.image_url && (
                  <img
                    src={event.image_url || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <Badge className="absolute top-4 right-4 bg-white text-orange-600 text-lg px-4 py-2">
                  {event.cuisine_type}
                </Badge>
              </div>
            </Card>

            {/* Event Info */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-base">{event.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      event.status === "upcoming"
                        ? "default"
                        : event.status === "completed"
                          ? "secondary"
                          : "destructive"
                    }
                    className="ml-4"
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📅</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🕐</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-semibold">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📍</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-2xl">👥</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{event.max_guests} guests</p>
                    </div>
                  </div>
                </div>

                {event.dietary_options && event.dietary_options.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Dietary Options</p>
                    <div className="flex flex-wrap gap-2">
                      {event.dietary_options.map((option, idx) => (
                        <Badge key={idx} variant="outline">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Host & Chef Info */}
            <Card className="backdrop-blur-sm bg-white/80">
              <CardHeader>
                <CardTitle>Event Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Host */}
                {host && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Hosted by</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={host.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{host.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{host.display_name}</p>
                        <p className="text-sm text-muted-foreground">{host.location}</p>
                        {host.bio && <p className="text-sm mt-1">{host.bio}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {cook && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Chef</p>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={cook.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{cook.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{cook.display_name}</p>
                          {cook.experience_years && (
                            <p className="text-sm text-muted-foreground">{cook.experience_years} years of experience</p>
                          )}
                          {cook.cuisine_specialties && cook.cuisine_specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cook.cuisine_specialties.map((cuisine, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {cuisine}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-white/80 sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">Book This Event</CardTitle>
                <CardDescription>Reserve your spot for this culinary experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-orange-600">${event.price_per_person}</span>
                    <span className="text-muted-foreground">per person</span>
                  </div>
                </div>

                {event.status === "upcoming" ? (
                  <>
                    {currentUser?.role === "user" ? (
                      <Button
                        onClick={() => setShowBookingDialog(true)}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-lg py-6"
                      >
                        Book Now
                      </Button>
                    ) : currentUser ? (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Only diners can book events</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => router.push("/auth/login")}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-lg py-6"
                      >
                        Sign In to Book
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">This event is no longer available for booking</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maximum guests</span>
                    <span className="font-medium">{event.max_guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event date</span>
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event time</span>
                    <span className="font-medium">{event.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>Enter the number of guests for this event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={event.max_guests}
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Maximum {event.max_guests} guests</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Price per person</span>
                <span className="font-medium">${event.price_per_person}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Number of guests</span>
                <span className="font-medium">{guestsCount}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBooking} disabled={isBooking} className="flex-1 bg-orange-600 hover:bg-orange-700">
                {isBooking ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
