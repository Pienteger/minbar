"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import Image from "next/image"

interface CreateStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateStory: (text: string, image: string) => void
}

export function CreateStoryDialog({ open, onOpenChange, onCreateStory }: CreateStoryDialogProps) {
  const [storyText, setStoryText] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!selectedImage) return

    setIsSubmitting(true)

    // Simulate story creation
    setTimeout(() => {
      onCreateStory(storyText, selectedImage)
      setIsSubmitting(false)
      setStoryText("")
      setSelectedImage(null)
      onOpenChange(false)
    }, 1000)
  }

  // For demo purposes, use placeholder images
  const demoImages = [
    "/placeholder.svg?height=800&width=400&text=Story+1",
    "/placeholder.svg?height=800&width=400&text=Story+2",
    "/placeholder.svg?height=800&width=400&text=Story+3",
    "/placeholder.svg?height=800&width=400&text=Story+4",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border-primary/20 bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Create Story
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {selectedImage ? (
            <div className="relative aspect-[9/16] max-h-[300px] rounded-lg overflow-hidden mx-auto">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Selected story image"
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <Icons.close className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <Textarea
                  placeholder="Add text to your story..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="bg-transparent border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0"
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {demoImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent hover:border-primary"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Story template ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Upload image</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-primary/20">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedImage || isSubmitting}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Share Story"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

