"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Profile, Booking, Event } from "@/lib/types"
import Link from "next/link"

interface BookingWithEvent extends Booking {
  events: Event
}

interface BookingsListProps {
  bookings: BookingWithEvent[]
  profile: Profile
}

export function BookingsList({ bookings, profile }: BookingsListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <DashboardNav profile={profile} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your event reservations</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
            <p className="text-muted-foreground mb-4">You haven't booked any events yet</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/dashboard">Browse Events</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl line-clamp-1">{booking.events.title}</CardTitle>
                    <Badge variant={booking.status === "confirmed" ? "default" : "destructive"}>{booking.status}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{booking.events.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Total paid</span>
                        <span className="text-xl font-bold text-orange-600">${booking.total_price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-medium">{booking.guests_count}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>🍽️</span>
                        <span>{booking.events.cuisine_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{new Date(booking.events.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{booking.events.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="line-clamp-1">{booking.events.location}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                      <Link href={`/events/${booking.events.id}`}>View Event Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
