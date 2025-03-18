"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Story {
  id: string
  image: string
  text?: string
  createdAt: Date
}

interface UserStory {
  id: string
  username: string
  avatar: string
  stories: Story[]
}

interface StoryViewerProps {
  stories: UserStory[]
  initialUserIndex: number
  initialStoryIndex: number
  onClose: () => void
}

export function StoryViewer({ stories, initialUserIndex, initialStoryIndex, onClose }: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState("")
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const storyDuration = 5000 // 5 seconds per story
  const progressIncrement = 100 / (storyDuration / 100) // Update progress every 100ms

  const currentUser = stories[currentUserIndex]
  const currentStory = currentUser.stories[currentStoryIndex]

  // Handle story progression
  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    setProgress(0)

    if (!isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next story or user
            goToNextStory()
            return 0
          }
          return prev + progressIncrement
        })
      }, 100)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentUserIndex, currentStoryIndex, isPaused])

  const goToNextStory = () => {
    // Check if there are more stories from current user
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      // Move to next user
      if (currentUserIndex < stories.length - 1) {
        setCurrentUserIndex(currentUserIndex + 1)
        setCurrentStoryIndex(0)
      } else {
        // End of all stories
        onClose()
      }
    }
  }

  const goToPrevStory = () => {
    // Check if there are previous stories from current user
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else {
      // Move to previous user
      if (currentUserIndex > 0) {
        setCurrentUserIndex(currentUserIndex - 1)
        const prevUserStories = stories[currentUserIndex - 1].stories
        setCurrentStoryIndex(prevUserStories.length - 1)
      }
      // If we're at the first story of the first user, do nothing
    }
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim()) {
      // In a real app, this would send the reply
      console.log(`Replying to ${currentUser.username}'s story: ${replyText}`)
      setReplyText("")
    }
  }

  // Handle keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextStory()
      } else if (e.key === "ArrowLeft") {
        goToPrevStory()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentUserIndex, currentStoryIndex])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Story container */}
        <div
          className="relative w-full h-full md:w-[420px] md:h-[90vh] md:rounded-xl overflow-hidden"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex space-x-1 p-2">
            {currentUser.stories.map((story, index) => (
              <div key={story.id} className="h-1 bg-white/30 rounded-full flex-1">
                {index === currentStoryIndex && (
                  <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                )}
                {index < currentStoryIndex && <div className="h-full bg-white rounded-full w-full" />}
              </div>
            ))}
          </div>

          {/* User info */}
          <div className="absolute top-4 left-0 right-0 z-20 flex items-center px-4 mt-2">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-2 text-white">
              <div className="font-semibold">{currentUser.username}</div>
              <div className="text-xs opacity-80">{formatDistanceToNow(currentStory.createdAt)}</div>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-white hover:bg-white/10" onClick={onClose}>
              <Icons.close className="h-6 w-6" />
            </Button>
          </div>

          {/* Story content */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40">
            <Image src={currentStory.image || "/placeholder.svg"} alt="Story" fill className="object-cover" priority />

            {/* Story text if any */}
            {currentStory.text && (
              <div className="absolute bottom-24 left-0 right-0 px-4 text-white text-center font-medium text-lg">
                {currentStory.text}
              </div>
            )}
          </div>

          {/* Navigation buttons - more visible for desktop */}
          <button
            className="absolute top-0 left-0 w-1/3 h-full z-10 focus:outline-none"
            onClick={goToPrevStory}
            aria-label="Previous story"
          />
          <button
            className="absolute top-0 right-0 w-1/3 h-full z-10 focus:outline-none"
            onClick={goToNextStory}
            aria-label="Next story"
          />

          {/* Desktop navigation arrows */}
          {isDesktop && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
                onClick={goToPrevStory}
              >
                <Icons.chevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
                onClick={goToNextStory}
              >
                <Icons.chevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Reply input */}
          <form onSubmit={handleReply} className="absolute bottom-4 left-4 right-4 z-20 flex space-x-2">
            <Input
              placeholder="Reply to story..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/20 border-none text-white placeholder:text-white/70 rounded-full backdrop-blur-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              disabled={!replyText.trim()}
            >
              <Icons.send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

