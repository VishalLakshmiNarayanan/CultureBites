"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { addEvent } from "@/lib/local-storage"
import type { Event } from "@/lib/types"

interface HostEventWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hostId: string
  onSuccess: () => void
}

const CUISINES = ["Mexican", "Japanese", "Lebanese", "Italian", "Indian", "French", "Other"]

export function HostEventWizard({ open, onOpenChange, hostId, onSuccess }: HostEventWizardProps) {
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  // Step 1: Details
  const [title, setTitle] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [seatsTotal, setSeatsTotal] = useState("")

  // Step 2: Media
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      console.log("[v0] HostEventWizard opened with hostId:", hostId)
    }
  }, [open, hostId])

  const resetForm = () => {
    setStep(1)
    setTitle("")
    setCuisine("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setLocation("")
    setSeatsTotal("")
    setImages([])
  }

  const handleNext = () => {
    if (step === 1) {
      if (!title || !cuisine || !date || !startTime || !endTime || !location || !seatsTotal) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePublish = async () => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title,
      cuisine,
      hostId,
      dateISO: date,
      startTime,
      endTime,
      location,
      images,
      seatsTotal: Number.parseInt(seatsTotal),
      seatsLeft: Number.parseInt(seatsTotal),
    }

    console.log("[v0] Creating event with hostId:", hostId)
    console.log("[v0] New event object:", newEvent)

    try {
      await addEvent(newEvent)

      toast({
        title: "Event published!",
        description: `"${title}" has been created successfully.`,
      })

      resetForm()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const progress = (step / 3) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event - Step {step} of 3</DialogTitle>
        </DialogHeader>

        <Progress value={progress} className="mb-4" />

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Authentic Oaxacan Feast"
              />
            </div>

            <div>
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="seats">Total Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  value={seatsTotal}
                  onChange={(e) => setSeatsTotal(e.target.value)}
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end">End Time</Label>
                <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
        )}

        {/* Step 2: Media */}
        {step === 2 && (
          <div className="space-y-4">
            <ImageUpload images={images} onChange={setImages} maxImages={5} label="Event Photos (1-5 images)" />
            <p className="text-sm text-muted-foreground">Upload photos of the cuisine, dishes, or dining experience</p>
          </div>
        )}

        {/* Step 3: Preview & Publish */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-6 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <Badge className="mt-2">{cuisine}</Badge>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {startTime} - {endTime}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {location}
                </p>
                <p>
                  <span className="font-semibold">Seats:</span> {seatsTotal}
                </p>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Event photos:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img || "/placeholder.svg"}
                        alt={`Event ${i + 1}`}
                        className="w-full aspect-video object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">Ready to publish your event?</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handlePublish}>Publish Event</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
