"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GalleryDialog } from "@/components/gallery-dialog"
import { useState } from "react"
import { User, MapPin } from "lucide-react"
import type { Cook } from "@/lib/types"

interface CookCardProps {
  cook: Cook
  onRequestCollaboration: () => void
}

export function CookCard({ cook, onRequestCollaboration }: CookCardProps) {
  const [showGallery, setShowGallery] = useState(false)

  return (
    <>
      <Card className="overflow-hidden bg-black/40 backdrop-blur-md border-orange-500/30 hover:border-orange-400/60 transition-all hover:shadow-lg hover:shadow-orange-500/20">
        <div className="p-6 space-y-4">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            {/* Profile Picture Circle */}
            <div className="flex-shrink-0">
              {cook.profileImage ? (
                <img
                  src={cook.profileImage || "/placeholder.svg"}
                  alt={cook.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-400/50 ring-2 ring-orange-500/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center border-2 border-orange-400/50 ring-2 ring-orange-500/20">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Name and Origin */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-orange-100 mb-1">{cook.name}</h3>
              <div className="flex items-center gap-1 text-orange-300/80">
                <MapPin className="w-4 h-4" />
                <p className="text-sm">{cook.originCountry}</p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {cook.specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  className="bg-orange-500/20 text-orange-200 border-orange-400/30 hover:bg-orange-500/30"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cook's Story */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Why I Cook</p>
            <p className="text-sm text-orange-100/90 leading-relaxed line-clamp-3">{cook.story}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onRequestCollaboration}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
            >
              Request Collaboration
            </Button>
            {cook.cuisineImages && cook.cuisineImages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGallery(true)}
                className="bg-black/20 border-orange-400/30 text-orange-200 hover:bg-orange-500/20 hover:border-orange-400/60"
              >
                View Dishes ({cook.cuisineImages.length})
              </Button>
            )}
          </div>
        </div>
      </Card>

      {cook.cuisineImages && cook.cuisineImages.length > 0 && (
        <GalleryDialog
          open={showGallery}
          onOpenChange={setShowGallery}
          images={cook.cuisineImages}
          title={`${cook.name}'s Cuisine`}
        />
      )}
    </>
  )
}
