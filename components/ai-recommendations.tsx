"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Event } from "@/lib/types"
import Link from "next/link"

interface AIRecommendationsProps {
  userId: string
  preferences?: string
}

interface Recommendation {
  event: Event
  reason: string
}

export function AIRecommendations({ userId, preferences }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, preferences }),
      })

      const data = await response.json()
      setRecommendations(data.recommendations || [])
      setHasGenerated(true)
    } catch (error) {
      console.error("[v0] Error fetching recommendations:", error)
      alert("Failed to generate recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasGenerated) {
    return (
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Get personalized event suggestions based on your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              "Get AI Recommendations"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <p className="text-muted-foreground">AI-curated events based on your profile</p>
        </div>
        <Button
          onClick={generateRecommendations}
          disabled={isLoading}
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <Card className="p-12 text-center backdrop-blur-sm bg-white/80">
          <p className="text-muted-foreground">No recommendations available at the moment</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <Link key={rec.event.id} href={`/events/${rec.event.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm bg-white/80 h-full relative">
                <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-600 to-amber-600">
                  AI Pick #{idx + 1}
                </Badge>
                <div className="relative h-48 bg-gradient-to-br from-orange-200 to-amber-200">
                  {rec.event.image_url && (
                    <img
                      src={rec.event.image_url || "/placeholder.svg"}
                      alt={rec.event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge className="absolute top-3 right-3 bg-white text-orange-600">{rec.event.cuisine_type}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-1">{rec.event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{rec.event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-900">
                        <span className="font-semibold">Why we recommend this:</span> {rec.reason}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{new Date(rec.event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{rec.event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="line-clamp-1">{rec.event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold">${rec.event.price_per_person} per person</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
