"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Heart, ImageIcon, User } from "lucide-react"
import { GalleryDialog } from "@/components/gallery-dialog"
import { SeatRequestDialog } from "@/components/seat-request-dialog"
import type { Event, Host, Cook } from "@/lib/types"

interface FlipCuisineCardProps {
  event: Event
  host?: Host
  cook?: Cook
  onSave: () => void
  isSaved: boolean
  cuisineImage?: string
  isAlreadyRegistered?: boolean
  userEmail?: string | null
}

export function FlipCuisineCard({
  event,
  host,
  cook,
  onSave,
  isSaved,
  cuisineImage,
  isAlreadyRegistered = false,
  userEmail,
}: FlipCuisineCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showSeatRequest, setShowSeatRequest] = useState(false)

  const frontImage = cuisineImage || cook?.cuisineImages?.[0] || "/diverse-food-spread.png"
  const hostImages = host?.photos || []

  return (
    <>
      <div className={`flip-card-container ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card" onClick={() => setIsFlipped(!isFlipped)}>
          <div className="card-front">
            <img src={frontImage || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
            {isAlreadyRegistered && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-white text-xl font-bold">Already Registered</p>
                  <p className="text-white/70 text-sm mt-1">You've requested seats for this event</p>
                </div>
              </div>
            )}
            {/* */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex flex-col justify-end p-8 text-white">
              <Badge className="mb-4 text-lg px-4 py-2 w-fit bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0">
                {event.cuisine}
              </Badge>
              <h3 className="text-4xl font-bold mb-2 text-balance">{event.title}</h3>
              <p className="text-white/90 text-lg">Click to reveal details</p>
            </div>
            <div className="img-bg absolute inset-0 pointer-events-none" />
          </div>

          <div className="card-back">
            {isAlreadyRegistered && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20 rounded-3xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">✓</div>
                  <p className="text-white text-2xl font-bold">Already Registered</p>
                  <p className="text-white/70 text-base mt-2">You've requested seats for this event</p>
                </div>
              </div>
            )}
            {/* */}
            <div className="w-full h-full p-4 md:p-6 flex flex-col overflow-y-auto text-gray-800">
              {/* Profile Pictures Section */}
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-4 md:mb-6">
                {/* Host Profile */}
                {host && (
                  <div className="flex flex-col items-center">
                    {host.profileImage ? (
                      <img
                        src={host.profileImage || "/placeholder.svg"}
                        alt={host.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-orange-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-100 flex items-center justify-center border-4 border-orange-500 shadow-lg">
                        <User className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
                      </div>
                    )}
                    <p className="text-xs md:text-sm font-semibold text-gray-700 mt-2">Host: {host.name}</p>
                    <p className="text-xs text-gray-500">{host.spaceTitle}</p>
                  </div>
                )}

                {/* Cook Profile */}
                {cook && (
                  <div className="flex flex-col items-center">
                    {cook.profileImage ? (
                      <img
                        src={cook.profileImage || "/placeholder.svg"}
                        alt={cook.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-amber-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-500 shadow-lg">
                        <User className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
                      </div>
                    )}
                    <p className="text-xs md:text-sm font-semibold text-gray-700 mt-2">Chef: {cook.name}</p>
                    <p className="text-xs text-gray-500">{cook.originCountry}</p>
                  </div>
                )}
              </div>

              {/* Event Title */}
              <h3 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {event.title}
              </h3>

              {/* Cook's Story - Prominently Displayed */}
              {cook && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                  <p className="text-xs md:text-sm font-bold text-orange-600 mb-2">Why I'm Cooking This:</p>
                  <p className="text-xs md:text-sm italic text-gray-700 leading-relaxed">"{cook.story}"</p>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm mb-3 md:mb-4">
                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">{new Date(event.dateISO).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="truncate text-gray-700">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">
                    {event.seatsLeft} / {event.seatsTotal} seats
                  </span>
                </div>
              </div>

              {/* Event Space Photos Preview */}
              {hostImages && hostImages.length > 0 && (
                <div className="mb-3 md:mb-4">
                  <p className="text-xs md:text-sm font-semibold text-orange-600 mb-2">Event Space:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {hostImages.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt={`Space ${idx + 1}`}
                        className="w-full h-16 md:h-20 object-cover rounded-lg border border-orange-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 md:pt-4 border-t border-orange-200 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowGallery(true)
                  }}
                  disabled={!hostImages || hostImages.length === 0}
                  className="bg-white border-orange-300 hover:bg-orange-50 hover:border-orange-500 text-gray-700 text-xs md:text-sm px-2 md:px-3"
                >
                  <ImageIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Photos ({hostImages?.length || 0})
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSeatRequest(true)
                  }}
                  disabled={event.seatsLeft === 0 || isAlreadyRegistered}
                  //
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs md:text-sm"
                >
                  {isAlreadyRegistered ? "Already Registered" : "Request Seat"}
                  {/* */}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSave()
                  }}
                  className="hover:bg-orange-50 px-2 md:px-3"
                >
                  <Heart
                    className={`w-3 h-3 md:w-4 md:h-4 ${isSaved ? "fill-current text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>
            </div>
            <div className="img-bg absolute inset-0 pointer-events-none" />
          </div>
        </div>
      </div>

      <GalleryDialog
        open={showGallery}
        onOpenChange={setShowGallery}
        images={hostImages}
        title={host?.spaceTitle || event.title}
      />

      <SeatRequestDialog open={showSeatRequest} onOpenChange={setShowSeatRequest} event={event} />
    </>
  )
}
