"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GalleryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: string[]
  title: string
}

export function GalleryDialog({ open, onOpenChange, images, title }: GalleryDialogProps) {
  const imageList = images || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title} - Photo Gallery</DialogTitle>
        </DialogHeader>
        {imageList.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>No photos available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {imageList.map((imageUrl, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${title} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
