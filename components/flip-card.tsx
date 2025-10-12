"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/types"
import Link from "next/link"

interface FlipCardProps {
  events: Event[]
}

export function FlipCard({ events }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)

  useEffect(() => {
    if (events.length > 0) {
      // Pick a random event
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      setCurrentEvent(randomEvent)

      // Auto-flip after a short delay
      const timer = setTimeout(() => {
        setIsFlipped(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [events])

  if (!currentEvent) {
    return (
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No events available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="perspective-1000 w-full max-w-md">
      <motion.div
        className="relative w-full h-[500px]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Card className="w-full h-full flex items-center justify-center backdrop-blur-sm bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300">
            <CardContent className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎲</div>
              <p className="text-2xl font-bold text-orange-600">Surprise!</p>
              <p className="text-muted-foreground mt-2">Flipping to reveal your event...</p>
            </CardContent>
          </Card>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="w-full h-full overflow-hidden backdrop-blur-sm bg-white/95 border-2 border-orange-300">
            <div className="relative h-48 bg-gradient-to-br from-orange-200 to-amber-200">
              {currentEvent.image_url && (
                <img
                  src={currentEvent.image_url || "/placeholder.svg"}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                />
              )}
              <Badge className="absolute top-3 right-3 bg-white text-orange-600">{currentEvent.cuisine_type}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{currentEvent.title}</CardTitle>
              <CardDescription className="line-clamp-2">{currentEvent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{new Date(currentEvent.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{currentEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="line-clamp-1">{currentEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span className="font-semibold">${currentEvent.price_per_person} per person</span>
                </div>
              </div>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href={`/events/${currentEvent.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
