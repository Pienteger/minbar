"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"

// Mock data for a group
const groupData = {
  id: "1",
  name: "Photography Enthusiasts",
  image: "/placeholder.svg?height=200&width=600",
  coverImage: "/placeholder.svg?height=300&width=800",
  description:
    "A community for photography lovers to share their work, discuss techniques, and organize meetups. Whether you're a beginner or a professional, everyone is welcome!",
  members: 128,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  isAdmin: true,
  posts: [
    {
      id: "post1",
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just got a new camera! Can't wait to try it out this weekend. Any recommendations for good spots in the city?",
      image: "/placeholder.svg?height=400&width=600",
      likes: 24,
      comments: 8,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "post2",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Here's a shot from yesterday's sunset. Edited in Lightroom with my custom preset.",
      image: "/placeholder.svg?height=400&width=600",
      likes: 42,
      comments: 12,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
  ],
  members_list: [
    {
      id: "user1",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Admin",
    },
    {
      id: "user2",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
    },
    {
      id: "user3",
      name: "Sarah Parker",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
    },
    {
      id: "user4",
      name: "Mike Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
    },
  ],
  media: [
    {
      id: "media1",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "media2",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "media3",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "media4",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "media5",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "media6",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
    },
  ],
}

interface GroupDetailProps {
  groupId: string
}

export function GroupDetail({ groupId }: GroupDetailProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [message, setMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    // In a real app, this would send the message to the group
    setMessage("")
  }

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative h-48 bg-gradient-to-r from-pink-500 to-orange-500">
        <Image
          src={groupData.coverImage || "/placeholder.svg"}
          alt={groupData.name}
          fill
          className="object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
          <h1 className="text-2xl font-bold">{groupData.name}</h1>
          <p className="text-sm opacity-90">
            {groupData.members} members · Created {formatDistanceToNow(groupData.createdAt)}
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="default"
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full"
          >
            {groupData.isAdmin ? "Invite Members" : "Join Group"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icons.ellipsis className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-primary/20">
              {groupData.isAdmin ? (
                <>
                  <DropdownMenuItem>
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Group Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.users className="mr-2 h-4 w-4" />
                    Manage Members
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <Icons.bell className="mr-2 h-4 w-4" />
                  Mute Notifications
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Icons.bookmark className="mr-2 h-4 w-4" />
                Save Group
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                {groupData.isAdmin ? (
                  <>
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete Group
                  </>
                ) : (
                  <>
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Leave Group
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="mt-4 rounded-xl border-primary/20 overflow-hidden">
          <CardContent className="p-4">
            <p className="text-sm">{groupData.description}</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="posts"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 space-y-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Write something to the group..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-full border-primary/20 bg-background/60 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim()}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  <Icons.send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {groupData.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden rounded-xl border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar} alt={post.user.name} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.user.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDistanceToNow(post.createdAt)}</div>
                      </div>
                    </div>

                    <p className="mb-3">{post.content}</p>

                    {post.image && (
                      <div className="relative rounded-lg overflow-hidden mb-3">
                        <div className="aspect-video relative">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>{post.likes} likes</div>
                      <div>{post.comments} comments</div>
                    </div>

                    <div className="flex justify-between border-t mt-3 pt-3">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Icons.heart className="mr-2 h-4 w-4" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Icons.chat className="mr-2 h-4 w-4" />
                        Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <div className="space-y-3">
              {groupData.members_list.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>

                  {groupData.isAdmin && member.role !== "Admin" && (
                    <Button variant="ghost" size="sm">
                      <Icons.ellipsis className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {groupData.media.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt="Media"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

