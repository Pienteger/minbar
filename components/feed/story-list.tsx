"use client"

import { useState } from "react"
import Image from "next/image"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { StoryViewer } from "@/components/story/story-viewer"
import { CreateStoryDialog } from "@/components/story/create-story-dialog"

// Mock data for stories with multiple stories per user
const userStories = [
  {
    id: "1",
    username: "You",
    avatar: "/me.jpg?height=40&width=40",
    hasStory: false,
    isUser: true,
    stories: [],
  },
  {
    id: "2",
    username: "arfiz",
    avatar: "/arfiz.jpg?height=40&width=40",
    hasStory: true,
    isUser: false,
    stories: [
      {
        id: "s1",
        image: "/placeholder.svg?height=800&width=400",
        text: "Beautiful sunset today! 🌅",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "s2",
        image: "/placeholder.svg?height=800&width=400",
        text: "Can't wait for the weekend!",
        createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      },
    ],
  },
  {
    id: "3",
    username: "toha",
    avatar: "/toha.png?height=40&width=40",
    hasStory: true,
    isUser: false,
    stories: [
      {
        id: "s3",
        image: "/placeholder.svg?height=800&width=400",
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      },
    ],
  },
  {
    id: "4",
    username: "refat",
    avatar: "/refat.jpg?height=40&width=40",
    hasStory: true,
    isUser: false,
    stories: [
      {
        id: "s4",
        image: "/placeholder.svg?height=800&width=400",
        text: "New recipe I tried today!",
        createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      },
      {
        id: "s5",
        image: "/placeholder.svg?height=800&width=400",
        createdAt: new Date(Date.now() - 1000 * 60 * 175), // 2.9 hours ago
      },
      {
        id: "s6",
        image: "/placeholder.svg?height=800&width=400",
        text: "The final result 😋",
        createdAt: new Date(Date.now() - 1000 * 60 * 170), // 2.8 hours ago
      },
    ],
  },
  {
    id: "5",
    username: "yunus",
    avatar: "/yunus.jpg?height=40&width=40",
    hasStory: true,
    isUser: false,
    stories: [
      {
        id: "s7",
        image: "/placeholder.svg?height=800&width=400",
        createdAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      },
    ],
  },
  {
    id: "6",
    username: "kayem",
    avatar: "/kayem.jpg?height=40&width=40",
    hasStory: true,
    isUser: false,
    stories: [
      {
        id: "s8",
        image: "/placeholder.svg?height=800&width=400",
        text: "Concert night! 🎵",
        createdAt: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
      },
      {
        id: "s9",
        image: "/placeholder.svg?height=800&width=400",
        createdAt: new Date(Date.now() - 1000 * 60 * 290), // 4.8 hours ago
      },
    ],
  },
]

export function StoryList() {
  const [stories, setStories] = useState(userStories)
  const [activeStoryUser, setActiveStoryUser] = useState<number | null>(null)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)

  const handleStoryClick = (index: number) => {
    if (index === 0) {
      // This is the "You" story, open create story dialog
      setIsCreateStoryOpen(true)
    } else if (stories[index].hasStory) {
      setActiveStoryUser(index)
      setIsStoryOpen(true)
    }
  }

  const handleCloseStory = () => {
    setIsStoryOpen(false)
    setActiveStoryUser(null)
  }

  const handleCreateStory = (text: string, image: string) => {
    // Create a new story for the current user
    const newStory = {
      id: `s${Date.now()}`,
      image,
      text: text || undefined,
      createdAt: new Date(),
    }

    // Update the user's stories
    const updatedStories = [...stories]
    updatedStories[0] = {
      ...updatedStories[0],
      hasStory: true,
      stories: [...(updatedStories[0].stories || []), newStory],
    }

    setStories(updatedStories)
  }

  // Filter out users with stories for the story viewer
  const storiesForViewer = stories.filter((user) => user.hasStory && user.stories.length > 0)

  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-2 px-4 -mx-4 lg:mx-0 lg:px-0 scrollbar-hide">
        {stories.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col items-center space-y-1"
            onClick={() => handleStoryClick(index)}
          >
            <div
              className={cn(
                "relative rounded-full p-[2px]",
                user.hasStory
                  ? "bg-gradient-to-tr from-pink-500 to-orange-500"
                  : user.isUser
                    ? "bg-gradient-to-tr from-blue-500 to-purple-500"
                    : "bg-transparent",
                activeStoryUser === index ? "scale-110" : "",
              )}
            >
              <div className="rounded-full bg-background p-[2px]">
                <div className="relative h-16 w-16 lg:h-20 lg:w-20 overflow-hidden rounded-full">
                  <Image src={user.avatar || "/placeholder.svg"} alt={user.username} fill className="object-cover" />
                  {user.isUser && (
                    <div className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full p-1">
                      <Icons.add className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple stories indicator */}
              {user.stories.length > 1 && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background rounded-full px-1.5 py-0.5 text-[10px] font-medium border border-primary/20">
                  {user.stories.length}
                </div>
              )}
            </div>
            <span className="text-xs truncate w-16 text-center">{user.username}</span>
          </motion.div>
        ))}
      </div>

      {/* Story Viewer - Use the same full-screen component for both mobile and desktop */}
      {isStoryOpen && activeStoryUser !== null && (
        <StoryViewer
          stories={storiesForViewer}
          initialUserIndex={storiesForViewer.findIndex((s) => s.id === stories[activeStoryUser].id)}
          initialStoryIndex={0}
          onClose={handleCloseStory}
        />
      )}

      {/* Create Story Dialog */}
      <CreateStoryDialog
        open={isCreateStoryOpen}
        onOpenChange={setIsCreateStoryOpen}
        onCreateStory={handleCreateStory}
      />
    </div>
  )
}

