"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface PexelsImagePickerProps {
  onSelect: (imageUrl: string) => void
  defaultQuery?: string
}

interface PexelsPhoto {
  id: number
  url: string
  largeUrl: string
  photographer: string
}

export function PexelsImagePicker({ onSelect, defaultQuery = "food" }: PexelsImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [photos, setPhotos] = useState<PexelsPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(defaultQuery)

  useEffect(() => {
    if (isOpen) {
      fetchPhotos(searchQuery)
    }
  }, [isOpen])

  const fetchPhotos = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pexels?query=${encodeURIComponent(query)}&per_page=12`)
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error("[v0] Error fetching Pexels photos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPhotos(searchQuery)
  }

  const handleSelectPhoto = (photo: PexelsPhoto) => {
    onSelect(photo.largeUrl)
    setIsOpen(false)
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        Browse Images
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose an Image</DialogTitle>
            <DialogDescription>Search and select a photo from Pexels</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search for images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => handleSelectPhoto(photo)}
                  className="relative aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-orange-600 transition-all group"
                >
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={`Photo by ${photo.photographer}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Select</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && photos.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No images found. Try a different search term.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
