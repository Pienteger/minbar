"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"

// Mock data for groups
const groups = [
  {
    id: "1",
    name: "Photography Enthusiasts",
    image: "https://cdn.pixabay.com/photo/2014/11/03/10/44/camera-514992_960_720.jpg",
    members: 128,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 5,
    description: "Share your best shots and photography tips!",
  },
  {
    id: "2",
    name: "Foodies Club",
    image: "https://cdn.pixabay.com/photo/2017/04/05/01/15/food-2203717_960_720.jpg",
    members: 256,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    description: "For those who love cooking and trying new restaurants",
  },
  {
    id: "3",
    name: "Tech Talks",
    image: "https://cdn.pixabay.com/photo/2019/07/14/16/27/pen-4337521_960_720.jpg",
    members: 512,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 12,
    description: "Discussions about the latest in technology",
  },
  {
    id: "4",
    name: "Fitness Motivation",
    image: "https://cdn.pixabay.com/photo/2015/09/06/20/29/sport-927759_960_720.jpg",
    members: 189,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    description: "Stay motivated and share your fitness journey",
  },
  {
    id: "5",
    name: "Book Club",
    image: "https://cdn.pixabay.com/photo/2015/11/19/21/14/glasses-1052023_1280.jpg",
    members: 76,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    description: "Monthly book discussions and recommendations",
  },
]

export function GroupList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups"
          className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredGroups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}`} className="block">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-background/60 backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 hover:scale-[1.01]">
              <div className="relative h-14 w-14 rounded-xl overflow-hidden border-2 border-background">
                <Image src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate flex items-center">
                    {group.name}
                    {group.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-gradient-to-r from-pink-500 to-orange-500">
                        {group.unreadCount} new
                      </Badge>
                    )}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">{group.description}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{group.members} members</span>
                  <span className="text-xs text-muted-foreground">
                    Active {formatDistanceToNow(group.lastActivity)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

