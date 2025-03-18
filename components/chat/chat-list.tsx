"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"

// Mock data for chats
const chats = [
  {
    id: "1",
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: {
      text: "Hey, how's it going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: true,
      isUser: false,
    },
  },
  {
    id: "2",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "Did you see the new movie?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      isUser: false,
    },
  },
  {
    id: "3",
    user: {
      name: "Sarah Parker",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: {
      text: "I'll be there in 10 minutes",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      isUser: true,
    },
  },
  {
    id: "4",
    user: {
      name: "Mike Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "Thanks for the help!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      isUser: false,
    },
  },
  {
    id: "5",
    user: {
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "Let's meet tomorrow for coffee",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      isUser: false,
    },
  },
]

export function ChatList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter((chat) => chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search chats"
          className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-1 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {filteredChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10 hover:shadow-sm"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
              </Avatar>
              {chat.user.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{chat.user.name}</h3>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(chat.lastMessage.timestamp)}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage.isUser && "You: "}
                  {chat.lastMessage.text}
                </p>
                {!chat.lastMessage.isRead && !chat.lastMessage.isUser && (
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

