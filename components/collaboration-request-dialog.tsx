"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAppData, addCollaborationRequest } from "@/lib/local-storage"
import { X } from "lucide-react"
import type { Host, Cook, CollaborationRequest, Event } from "@/lib/types"

interface CollaborationRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  host?: Host
  cook?: Cook
  cookId?: string
  hostId?: string
  eventId?: string
  onSuccess: () => void
}

export function CollaborationRequestDialog({
  open,
  onOpenChange,
  host,
  cook,
  cookId,
  hostId,
  eventId,
  onSuccess,
}: CollaborationRequestDialogProps) {
  const [message, setMessage] = useState("")
  const [proposedDishes, setProposedDishes] = useState<string[]>([])
  const [currentDish, setCurrentDish] = useState("")
  const [event, setEvent] = useState<Event | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId && open) {
        const data = await getAppData()
        const foundEvent = data.events?.find((e) => e.id === eventId) || null
        setEvent(foundEvent)
      } else {
        setEvent(null)
      }
    }
    fetchEvent()
  }, [eventId, open])

  const addDish = () => {
    if (currentDish.trim() && proposedDishes.length < 5) {
      setProposedDishes([...proposedDishes, currentDish.trim()])
      setCurrentDish("")
    }
  }

  const removeDish = (index: number) => {
    setProposedDishes(proposedDishes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message",
        variant: "destructive",
      })
      return
    }

    const newRequest: CollaborationRequest = {
      id: `collab-${Date.now()}`,
      fromCookId: cookId || cook?.id || "",
      toHostId: hostId || host?.id || "",
      eventId: eventId,
      message: message.trim(),
      proposedDishes,
      status: "pending",
      createdAtISO: new Date().toISOString(),
    }

    try {
      await addCollaborationRequest(newRequest)

      const recipientName = host?.name || cook?.name || "them"
      toast({
        title: "Request sent!",
        description: `Your collaboration request has been sent to ${recipientName}.`,
      })

      setMessage("")
      setProposedDishes([])
      setCurrentDish("")
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("[v0] Error sending collaboration request:", error)
      toast({
        title: "Error",
        description: "Failed to send collaboration request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const title = host ? `Request to Collaborate with ${host.name}` : `Request to Collaborate with ${cook?.name}`
  const subtitle = host ? `${host.spaceTitle}` : `${cook?.specialties.join(", ")}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          {event && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm font-semibold">For Event:</p>
              <p className="text-sm">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.dateISO).toLocaleDateString()} • {event.cuisine}
              </p>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to collaborate..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="dish">Proposed Dishes (optional, up to 5)</Label>
            <div className="flex gap-2">
              <Input
                id="dish"
                value={currentDish}
                onChange={(e) => setCurrentDish(e.target.value)}
                placeholder="e.g., Authentic Tacos al Pastor"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addDish()
                  }
                }}
              />
              <Button type="button" onClick={addDish} disabled={proposedDishes.length >= 5}>
                Add
              </Button>
            </div>
          </div>

          {proposedDishes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {proposedDishes.map((dish, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {dish}
                  <button type="button" onClick={() => removeDish(index)} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

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
