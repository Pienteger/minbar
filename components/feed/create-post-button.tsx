"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { RichTextEditor } from "@/components/rich-text-editor"

export function CreatePostButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!postContent.trim()) return

    setIsSubmitting(true)

    // Simulate post creation
    setTimeout(() => {
      setIsSubmitting(false)
      setPostContent("")
      setIsOpen(false)
    }, 1000)
  }

  return (
    <>
      <Card className="overflow-hidden rounded-xl border-primary/20 bg-background/60 backdrop-blur-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/me.jpg?height=40&width=40" alt="User" />
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground font-normal h-10 rounded-full border-primary/20"
              onClick={() => setIsOpen(true)}
            >
              What&apos;s on your mind?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t p-2 flex justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20"
            onClick={() => setIsOpen(true)}
          >
            <Icons.image className="h-4 w-4 mr-2" />
            Photo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
            onClick={() => setIsOpen(true)}
          >
            <Icons.smile className="h-4 w-4 mr-2" />
            Feeling
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-primary/20 bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Create Post
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-start space-x-3 pt-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">John Doe</div>

              <RichTextEditor
                value={postContent}
                onChange={setPostContent}
                placeholder="What's on your mind?"
                minHeight="120px"
                maxHeight="300px"
              />

              <div className="mt-4 flex items-center justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!postContent.trim() || isSubmitting}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

