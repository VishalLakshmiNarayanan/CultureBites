"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { Upload, User } from "lucide-react"
import { getAppData, saveAppData } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import type { Host } from "@/lib/types"

interface HostProfileWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hostId: string
  onSuccess: () => void
}

export function HostProfileWizard({ open, onOpenChange, hostId, onSuccess }: HostProfileWizardProps) {
  const [name, setName] = useState("")
  const [spaceTitle, setSpaceTitle] = useState("")
  const [spaceDesc, setSpaceDesc] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("6")
  const [profileImage, setProfileImage] = useState<string>("")
  const [photos, setPhotos] = useState<string[]>([])
  const { toast } = useToast()

  const handleSubmit = () => {
    console.log("[v0] Host profile submit - name:", name, "space:", spaceTitle, "location:", location)

    if (!name.trim() || !spaceTitle.trim() || !spaceDesc.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const finalCapacity = Math.min(Number.parseInt(capacity) || 6, 6)

    const newHost: Host = {
      id: hostId,
      name: name.trim(),
      spaceTitle: spaceTitle.trim(),
      spaceDesc: spaceDesc.trim(),
      location: location.trim(),
      capacity: finalCapacity,
      profileImage: profileImage || undefined,
      photos,
    }

    console.log("[v0] Creating host profile:", newHost)

    const data = getAppData()
    saveAppData({
      ...data,
      hosts: [...data.hosts, newHost],
    })

    toast({
      title: "Profile created!",
      description: "Your host profile has been created successfully.",
    })

    setName("")
    setSpaceTitle("")
    setSpaceDesc("")
    setLocation("")
    setCapacity("6")
    setProfileImage("")
    setPhotos([])

    onSuccess()
    onOpenChange(false)
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfileImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Host Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <p className="text-sm text-muted-foreground">Upload a photo of yourself</p>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  id="host-profile-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("host-profile-image-upload")?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </Button>
                {profileImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileImage("")}
                    className="w-full mt-2"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spaceTitle">
              Space Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="spaceTitle"
              value={spaceTitle}
              onChange={(e) => setSpaceTitle(e.target.value)}
              placeholder="e.g., Cozy Downtown Loft, Garden Patio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spaceDesc">
              Space Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="spaceDesc"
              value={spaceDesc}
              onChange={(e) => setSpaceDesc(e.target.value)}
              placeholder="Describe your space, amenities, atmosphere..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Max 6)</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="6"
              min="1"
              max="6"
            />
            <p className="text-xs text-muted-foreground">Maximum capacity is 6 guests</p>
          </div>

          <div className="space-y-2">
            <Label>Event Space Photos</Label>
            <p className="text-sm text-muted-foreground">Upload photos of your space (up to 5)</p>
            <ImageUpload images={photos} onChange={setPhotos} maxImages={5} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">
              Create Profile
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
