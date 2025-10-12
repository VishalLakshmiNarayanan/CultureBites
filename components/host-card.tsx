"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, ImageIcon, Calendar } from "lucide-react"
import { useState } from "react"
import { GalleryDialog } from "@/components/gallery-dialog"
import type { Host, Event } from "@/lib/types"

interface HostCardProps {
  host: Host
  events?: Event[]
  onRequestCollaboration: (eventId?: string) => void
}

export function HostCard({ host, events = [], onRequestCollaboration }: HostCardProps) {
  const [showGallery, setShowGallery] = useState(false)
  const [showEvents, setShowEvents] = useState(false)

  const availableEvents = events.filter((e) => !e.cookId && new Date(e.dateISO) >= new Date())

  return (
    <>
      <GlassCard className="overflow-hidden hover:shadow-2xl transition-shadow">
        <div className="h-40 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h3 className="text-xl font-bold">{host.spaceTitle}</h3>
            <p className="text-sm text-white/90">{host.name}</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{host.spaceDesc}</p>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {host.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity: {host.capacity}
            </div>
            {availableEvents.length > 0 && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {availableEvents.length} event{availableEvents.length !== 1 ? "s" : ""} available
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGallery(true)}
              className="border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              View Space
            </Button>
            {availableEvents.length > 0 ? (
              <Button size="sm" className="flex-1" onClick={() => setShowEvents(!showEvents)}>
                {showEvents ? "Hide" : "View"} Events
              </Button>
            ) : (
              <Button size="sm" className="flex-1" disabled>
                No Events Available
              </Button>
            )}
          </div>

          {showEvents && availableEvents.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-semibold">Available Events:</p>
              {availableEvents.map((event) => (
                <div key={event.id} className="p-2 border rounded-lg space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.dateISO).toLocaleDateString()} • {event.startTime}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.cuisine}
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => onRequestCollaboration(event.id)}>
                    Collaborate on this Event
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <GalleryDialog
        open={showGallery}
        onOpenChange={setShowGallery}
        images={host.photos || []}
        title={host.spaceTitle}
      />
    </>
  )
}
