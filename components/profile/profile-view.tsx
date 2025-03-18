"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { PostList } from "@/components/feed/post-list"

// Mock data for user profile
const userData = {
  id: "user1",
  name: "John Doe",
  username: "@johndoe",
  avatar: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=800",
  bio: "Photographer, traveler, and coffee enthusiast. Always looking for the next adventure!",
  location: "New York, NY",
  website: "johndoe.com",
  joinedDate: "January 2020",
  stats: {
    posts: 42,
    friends: 256,
    photos: 128,
  },
}

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="-mx-4 lg:mx-0 lg:max-w-3xl lg:mx-auto">
      <div className="relative h-48 lg:h-64 bg-gradient-to-r from-pink-500 to-orange-500 rounded-none lg:rounded-t-xl">
        <Image
          src={userData.coverImage || "/placeholder.svg"}
          alt="Cover"
          fill
          className="object-cover mix-blend-overlay opacity-60 rounded-none lg:rounded-t-xl"
        />
        <div className="absolute -bottom-16 left-4 h-32 w-32 rounded-full border-4 border-background overflow-hidden">
          <Image src={userData.avatar || "/placeholder.svg"} alt={userData.name} fill className="object-cover" />
        </div>
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/30">
                <Icons.ellipsis className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-primary/20">
              <DropdownMenuItem>
                <Icons.settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.lock className="mr-2 h-4 w-4" />
                Privacy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.help className="mr-2 h-4 w-4" />
                Help Center
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Icons.logout className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">{userData.username}</p>
          </div>
          <Button variant="outline" className="rounded-full border-primary/20">
            <Icons.edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <Card className="mt-4 rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="mb-3">{userData.bio}</p>
            <div className="flex flex-wrap gap-y-2">
              <div className="flex items-center text-sm text-muted-foreground mr-4">
                <Icons.map className="mr-1 h-4 w-4" />
                {userData.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mr-4">
                <Icons.link className="mr-1 h-4 w-4" />
                {userData.website}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icons.calendar className="mr-1 h-4 w-4" />
                Joined {userData.joinedDate}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6 mb-4">
          <div className="text-center px-4">
            <div className="text-xl font-bold">{userData.stats.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center px-4">
            <div className="text-xl font-bold">{userData.stats.friends}</div>
            <div className="text-sm text-muted-foreground">Friends</div>
          </div>
          <div className="text-center px-4">
            <div className="text-xl font-bold">{userData.stats.photos}</div>
            <div className="text-sm text-muted-foreground">Photos</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="posts"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <PostList />
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=200`}
                    alt="Photo"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={`/placeholder.svg?height=50&width=50`}
                      alt="Friend"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">Friend Name</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

