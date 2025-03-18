"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

// Mock data for trending topics
const trendingTopics = [
  { id: "1", name: "Photography", posts: 1240 },
  { id: "2", name: "TechNews", posts: 980 },
  { id: "3", name: "Travel", posts: 756 },
  { id: "4", name: "FoodieLife", posts: 542 },
  { id: "5", name: "Fitness", posts: 321 },
]

// Mock data for friend suggestions
const friendSuggestions = [
  {
    id: "1",
    name: "Kawsarul Shuvo",
    avatar: "/shuvo.jpg?height=40&width=40",
    mutualFriends: 5,
  },
  {
    id: "2",
    name: "Bashar Ovi",
    avatar: "/ovi.jpg?height=40&width=40",
    mutualFriends: 3,
  },
  {
    id: "3",
    name: "Zahid Sarmon",
    avatar: "/jahid.jpg?height=40&width=40",
    mutualFriends: 2,
  },
]

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "1",
    title: "Photography Workshop",
    date: "Tomorrow, 3:00 PM",
    attendees: 24,
    image: "https://picsum.photos/id/1/60",
  },
  {
    id: "2",
    title: "Tech Meetup",
    date: "Saturday, 6:00 PM",
    attendees: 42,
    image: "https://picsum.photos/id/2/60",
  },
]

export function DesktopRightSidebar() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6 sticky top-8">
      {/* Search */}
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friend Suggestions */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">People you may know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friendSuggestions.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{friend.name}</div>
                  <div className="text-xs text-muted-foreground">{friend.mutualFriends} mutual friends</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
                <Icons.add className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5">
            See More
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Link key={topic.id} href={`/search?q=${topic.name}`}>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 hover:from-pink-500/20 hover:to-orange-500/20 border-primary/20 text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  #{topic.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex space-x-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-muted-foreground">{event.date}</div>
                <div className="text-xs text-muted-foreground">{event.attendees} attending</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-primary/20 hover:bg-primary/10 self-center"
              >
                Join
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5">
            See All Events
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-2">
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Terms
          </Link>
          <Link href="#" className="hover:underline">
            Cookies
          </Link>
          <Link href="#" className="hover:underline">
            Advertising
          </Link>
          <Link href="#" className="hover:underline">
            Help
          </Link>
        </div>
        <div>© 2025 Minbar. All rights reserved.</div>
      </div>
    </div>
  )
}

