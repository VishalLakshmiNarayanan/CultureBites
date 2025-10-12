"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { X, Upload, User, AlertCircle } from "lucide-react"
import { getAppData, saveAppData } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import type { Cook } from "@/lib/types"

interface CookProfileWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CookProfileWizard({ open, onOpenChange, onSuccess }: CookProfileWizardProps) {
  const [name, setName] = useState("")
  const [originCountry, setOriginCountry] = useState("")
  const [story, setStory] = useState("")
  const [specialtyInput, setSpecialtyInput] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<string>("")
  const [cuisineImages, setCuisineImages] = useState<string[]>([])
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()])
      setSpecialtyInput("")
      setErrors((prev) => ({ ...prev, specialties: false }))
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty))
  }

  const handleSubmit = () => {
    console.log("[v0] Cook profile submit - name:", name, "country:", originCountry, "specialties:", specialties)

    const newErrors: { [key: string]: boolean } = {}
    const missingFields: string[] = []

    if (!name.trim()) {
      newErrors.name = true
      missingFields.push("Name")
    }
    if (!originCountry.trim()) {
      newErrors.country = true
      missingFields.push("Origin Country")
    }
    if (!story.trim()) {
      newErrors.story = true
      missingFields.push("Your Story")
    }
    if (specialties.length === 0) {
      newErrors.specialties = true
      missingFields.push("At least one Cuisine Specialty")
    }

    if (missingFields.length > 0) {
      setErrors(newErrors)
      console.log("[v0] Validation failed. Missing fields:", missingFields)
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    const uniqueId = `cook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCook: Cook = {
      id: uniqueId,
      name: name.trim(),
      originCountry: originCountry.trim(),
      specialties,
      story: story.trim(),
      profileImage: profileImage || undefined,
      cuisineImages,
    }

    console.log("[v0] Creating cook profile:", newCook)

    const data = getAppData()
    console.log("[v0] Current cooks count:", data.cooks.length)
    saveAppData({
      ...data,
      cooks: [...data.cooks, newCook],
    })
    console.log("[v0] Cook profile saved successfully. New cooks count:", data.cooks.length + 1)

    toast({
      title: "Profile created!",
      description: "Your cook profile has been created successfully.",
    })

    // Reset form
    setName("")
    setOriginCountry("")
    setStory("")
    setSpecialties([])
    setProfileImage("")
    setCuisineImages([])
    setSpecialtyInput("")
    setErrors({})

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
          <DialogTitle>Create Cook Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
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
                  id="profile-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("profile-image-upload")?.click()}
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

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((prev) => ({ ...prev, name: false }))
              }}
              placeholder="Your name"
              className={errors.name ? "border-red-500 border-2" : ""}
            />
          </div>

          {/* Origin Country */}
          <div className="space-y-2">
            <Label htmlFor="country">
              Origin Country <span className="text-destructive">*</span>
            </Label>
            <Input
              id="country"
              value={originCountry}
              onChange={(e) => {
                setOriginCountry(e.target.value)
                setErrors((prev) => ({ ...prev, country: false }))
              }}
              placeholder="e.g., Italy, Japan, Mexico"
              className={errors.country ? "border-red-500 border-2" : ""}
            />
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label htmlFor="specialty">
              Cuisine Specialties <span className="text-destructive">*</span>
            </Label>
            <div
              className={`p-3 rounded-lg ${errors.specialties ? "bg-red-50 border-2 border-red-500" : "bg-orange-50 border border-orange-200"}`}
            >
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className={`w-4 h-4 mt-0.5 ${errors.specialties ? "text-red-500" : "text-orange-500"}`} />
                <p className={`text-sm font-medium ${errors.specialties ? "text-red-700" : "text-orange-700"}`}>
                  {errors.specialties
                    ? "⚠️ You must add at least one specialty before creating your profile!"
                    : "Type a specialty and click 'Add' to include it (e.g., Pasta, Sushi, Tacos)"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="specialty"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
                placeholder="e.g., Pasta, Sushi, Tacos"
                className={errors.specialties && specialties.length === 0 ? "border-red-500 border-2" : ""}
              />
              <Button type="button" onClick={handleAddSpecialty} className="bg-orange-500 hover:bg-orange-600">
                Add
              </Button>
            </div>
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="gap-1 bg-orange-100 text-orange-700">
                    {specialty}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSpecialty(specialty)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Story */}
          <div className="space-y-2">
            <Label htmlFor="story">
              Your Story <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="story"
              value={story}
              onChange={(e) => {
                setStory(e.target.value)
                setErrors((prev) => ({ ...prev, story: false }))
              }}
              placeholder="Tell us about your culinary journey, what inspires you, and why you love cooking..."
              rows={4}
              className={errors.story ? "border-red-500 border-2" : ""}
            />
          </div>

          {/* Cuisine Photos */}
          <div className="space-y-2">
            <Label>Cuisine Photos</Label>
            <p className="text-sm text-muted-foreground">Upload photos of your signature dishes (up to 5)</p>
            <ImageUpload images={cuisineImages} onChange={setCuisineImages} maxImages={5} />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1 bg-orange-500 hover:bg-orange-600">
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
