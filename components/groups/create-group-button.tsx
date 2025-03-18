"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

export function CreateGroupButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!groupName.trim()) return

    setIsSubmitting(true)

    // Simulate group creation
    setTimeout(() => {
      setIsSubmitting(false)
      setGroupName("")
      setGroupDescription("")
      setIsOpen(false)

      // In a real app, this would navigate to the newly created group
      router.push("/groups")
    }, 1000)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-none"
      >
        <Icons.users className="mr-2 h-5 w-5" />
        Create New Group
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-primary/20 bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Create New Group
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="e.g., Photography Enthusiasts"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea
                id="group-description"
                placeholder="What's this group about?"
                rows={3}
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="border-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label>Group Image</Label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click to upload an image</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-primary/20">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!groupName.trim() || isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

