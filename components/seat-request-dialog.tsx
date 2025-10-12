"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getAppData, saveAppData } from "@/lib/local-storage"
import type { Event, SeatRequest } from "@/lib/types"

interface SeatRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
}

export function SeatRequestDialog({ open, onOpenChange, event }: SeatRequestDialogProps) {
  const [guestName, setGuestName] = useState("")
  const [note, setNote] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    const data = getAppData()

    // Create seat request
    const newRequest: SeatRequest = {
      id: `seat-${Date.now()}`,
      eventId: event.id,
      guestName: guestName.trim(),
      note: note.trim() || undefined,
      createdAtISO: new Date().toISOString(),
      status: "pending",
    }

    // Update event seats
    const updatedEvents = data.events.map((e) =>
      e.id === event.id ? { ...e, seatsLeft: Math.max(0, e.seatsLeft - 1) } : e,
    )

    saveAppData({
      ...data,
      events: updatedEvents,
      seatRequests: [...data.seatRequests, newRequest],
    })

    toast({
      title: "Request sent!",
      description: `Your seat request for "${event.title}" has been sent to the host.`,
    })

    setGuestName("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Seat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any dietary restrictions or special requests?"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
