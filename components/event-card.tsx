"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/glass-card"
import { Calendar, Clock, MapPin, Users, Heart } from "lucide-react"
import type { Event, Host, Cook } from "@/lib/types"

interface EventCardProps {
  event: Event
  host?: Host
  cook?: Cook
  onSave: () => void
  isSaved: boolean
}

export function EventCard({ event, host, cook, onSave, isSaved }: EventCardProps) {
  return (
    <GlassCard className="overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <Badge className="mb-2">{event.cuisine}</Badge>
          <h3 className="text-xl font-bold">{event.title}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.dateISO).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.seatsLeft} seats left
          </div>
        </div>

        {cook && (
          <p className="text-sm">
            <span className="font-semibold">Chef:</span> {cook.name}
          </p>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" disabled={event.seatsLeft === 0}>
            Request Seat
          </Button>
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current text-red-500" : ""}`} />
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
