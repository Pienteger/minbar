"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface FriendProfileViewProps {
  username: string
}

export function FriendProfileView({ username }: FriendProfileViewProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [friendStatus, setFriendStatus] = useState<"none" | "requested" | "friends">("none")

  // Mock data for the friend's profile
  // In a real app, this would be fetched from an API based on the username
  const userData = {
    id: "zakir",
    name: "Zakir Hossain",
    username: "@zak",
    avatar: "/zakir.jpg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=800",
    bio: "A sinful slave of Almighty\nA knowledge scavenger\nA visionary\nA pioneer\nA philosophy lover\nA fool",
    location: "Rajshahi, BD",
    website: "abzakir.com",
    joinedDate: "March 2019",
    mutualFriends: 12,
    stats: {
      posts: 87,
      friends: 342,
      photos: 215,
    },
    isVerified: true,
  }

  // Mock data for posts
  const posts = [
    {
      id: "post1",
      content:
        "Just captured this amazing sunset at Golden Gate Bridge! The colors were absolutely breathtaking. #photography #sunset #sanfrancisco",
      image: "https://cdn.pixabay.com/photo/2016/03/13/18/10/san-francisco-1254172_1280.jpg?height=400&width=600",
      likes: 124,
      comments: 32,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "post2",
      content:
        "Excited to announce that my photo series 'Urban Wildlife' will be featured in National Geographic's upcoming issue! Dreams do come true when you work hard and stay passionate. 🙏📸",
      image: null,
      likes: 287,
      comments: 76,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    {
      id: "post3",
      content: "Morning hike at Mount Tamalpais. The fog rolling over the hills created such a mystical atmosphere.",
      image: "/placeholder.svg?height=400&width=600",
      likes: 156,
      comments: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    },
  ]

  // Mock data for about section
  const aboutData = {
    work: [
      {
        company: "Ahar Mela",
        position: "Owner",
        period: "2024 - Present",
      },
      {
        company: "Wildlife Magazine",
        position: "Staff Photographer",
        period: "2018 - 2020",
      },
    ],
    education: [
      {
        school: "Rajshahi University",
        degree: "MFA in Photography",
        period: "2016 - 2018",
      },
      {
        school: "UC Berkeley",
        degree: "BA in Environmental Science",
        period: "2012 - 2016",
      },
    ],
    places: [
      { name: "Rajshahi, BD", type: "Current City", since: "2000" },
      { name: "Rajshahi, BD", type: "Hometown", since: "Born" },
    ],
    contactInfo: {
      email: "public.email@example.com",
      website: "zakir.com",
      social: {
        instagram: "@zakir.captures",
        twitter: "@zakir_photo",
      },
    },
  }

  // Handle friend request
  const handleFriendRequest = () => {
    if (friendStatus === "none") {
      setFriendStatus("requested")
    } else if (friendStatus === "requested") {
      setFriendStatus("none")
    }
  }

  // Format date for posts
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Left sidebar content
  const renderSidebar = () => (
    <div className="lg:w-1/3 space-y-6 mb-6 lg:mb-0">
      {/* Intro Card */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-3">Intro</h3>
          <p className="mb-4 text-sm">{userData.bio}</p>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Icons.briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{aboutData.work[0].position} at {aboutData.work[0].company}</span>
            </div>
            <div className="flex items-center text-sm">
              <Icons.graduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Studied at {aboutData.education[0].school}</span>
            </div>
            <div className="flex items-center text-sm">
              <Icons.mapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Lives in {aboutData.places[0].name}</span>
            </div>
            <div className="flex items-center text-sm">
              <Icons.home className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>From {aboutData.places[1].name}</span>
            </div>
            <div className="flex items-center text-sm">
              <Icons.calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Joined {userData.joinedDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Icons.link className="mr-2 h-4 w-4 text-muted-foreground" />
              <a
                href={`https://${userData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {userData.website}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Card */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Photos</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              See All Photos
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=100&width=100&text=Photo+${i + 1}`}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Friends Card */}
      <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Friends</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              See All Friends
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{userData.stats.friends} friends</p>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Link key={i} href={`/profile/friend${i + 1}`} className="block group">
                <div className="space-y-1">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=80&width=80&text=Friend+${i + 1}`}
                      alt={`Friend ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs font-medium truncate">Friend Name {i + 1}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="-mx-4 lg:mx-0 lg:max-w-5xl lg:mx-auto">
      {/* Cover Photo */}
      <div className="relative h-48 lg:h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-none lg:rounded-t-xl">
        <Image
          src={userData.coverImage || "/placeholder.svg"}
          alt="Cover"
          fill
          className="object-cover mix-blend-overlay opacity-80 rounded-none lg:rounded-t-xl"
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 rounded-lg"
          >
            <Icons.camera className="mr-2 h-4 w-4" />
            View Cover Photo
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative bg-background rounded-none lg:rounded-b-xl border-b lg:border lg:border-primary/10 lg:shadow-sm">
        <div className="px-4 pb-4 pt-4 lg:pt-0 lg:pb-5">
          {/* Profile Picture and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col lg:flex-row lg:items-end">
              {/* Profile Picture */}
              <div className="relative -mt-16 lg:-mt-24 mb-3 lg:mb-0 lg:mr-4">
                <div className="h-32 w-32 lg:h-44 lg:w-44 rounded-full border-4 border-background overflow-hidden">
                  <Image
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Name and Basic Info */}
              <div className="lg:mb-4">
                <div className="flex items-center">
                  <h1 className="text-2xl lg:text-3xl font-bold">{userData.name}</h1>
                  {userData.isVerified && (
                    <Badge variant="outline" className="ml-2 bg-blue-500 text-white border-none">
                      <Icons.check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{userData.username}</p>
                {userData.mutualFriends > 0 && (
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Icons.users className="h-4 w-4 mr-1" />
                    <span>{userData.mutualFriends} mutual friends</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex mt-3 lg:mt-0 space-x-2 lg:mb-4">
              <Button
                variant={friendStatus === "requested" ? "outline" : "default"}
                className={
                  friendStatus === "requested"
                    ? "rounded-lg border-primary/20"
                    : "rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }
                onClick={handleFriendRequest}
              >
                {friendStatus === "none" && (
                  <>
                    <Icons.userPlus className="mr-2 h-4 w-4" />
                    Add Friend
                  </>
                )}
                {friendStatus === "requested" && (
                  <>
                    <Icons.userMinus className="mr-2 h-4 w-4" />
                    Cancel Request
                  </>
                )}
                {friendStatus === "friends" && (
                  <>
                    <Icons.check className="mr-2 h-4 w-4" />
                    Friends
                  </>
                )}
              </Button>
              <Button variant="outline" className="rounded-lg border-primary/20">
                <Icons.chat className="mr-2 h-4 w-4" />
                Message
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-lg border-primary/20">
                    <Icons.ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-primary/20">
                  <DropdownMenuItem>
                    <Icons.bell className="mr-2 h-4 w-4" />
                    Follow
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.bookmark className="mr-2 h-4 w-4" />
                    Save Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.share className="mr-2 h-4 w-4" />
                    Share Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Icons.ban className="mr-2 h-4 w-4" />
                    Block
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Icons.flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-12 p-0 bg-transparent space-x-2 border-b rounded-none">
              <TabsTrigger
                value="posts"
                className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Photos
              </TabsTrigger>
            </TabsList>

            {/* Tab Content - Must be direct children of Tabs component */}
            <div className="mt-6 px-4 lg:px-0">
              <div className="lg:flex lg:space-x-6">
                {/* Left Column - About and Friends */}
                {renderSidebar()}

                {/* Right Column - Posts and Content */}
                <div className="lg:w-2/3">
                  <TabsContent value="posts" className="mt-0 space-y-6">
                    {posts.map((post) => (
                      <Card
                        key={post.id}
                        className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={userData.avatar} alt={userData.name} />
                              <AvatarFallback>{userData.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{userData.name}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</div>
                            </div>
                          </div>

                          <p className="mb-3 whitespace-pre-wrap">{post.content}</p>

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

                          <Separator className="my-3" />

                          <div className="flex justify-between">
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Icons.heart className="mr-2 h-4 w-4" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Icons.messageCircle className="mr-2 h-4 w-4" />
                              Comment
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Icons.share className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="about" className="mt-0 space-y-6">
                    <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-4">About</h3>

                        <div className="space-y-6">
                          {/* Work and Education */}
                          <div>
                            <h4 className="font-medium text-lg mb-3 flex items-center">
                              <Icons.briefcase className="mr-2 h-5 w-5" />
                              Work and Education
                            </h4>
                            <div className="space-y-4">
                              {aboutData.work.map((job, i) => (
                                <div key={i} className="flex">
                                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                    <Icons.briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {job.position} at {job.company}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{job.period}</p>
                                  </div>
                                </div>
                              ))}

                              {aboutData.education.map((edu, i) => (
                                <div key={i} className="flex">
                                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                                    <Icons.graduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {edu.degree} from {edu.school}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{edu.period}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Places Lived */}
                          <div>
                            <h4 className="font-medium text-lg mb-3 flex items-center">
                              <Icons.mapPin className="mr-2 h-5 w-5" />
                              Places Lived
                            </h4>
                            <div className="space-y-4">
                              {aboutData.places.map((place, i) => (
                                <div key={i} className="flex">
                                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                                    {place.type === "Current City" ? (
                                      <Icons.mapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <Icons.home className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{place.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {place.type} · {place.since}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Contact Info */}
                          <div>
                            <h4 className="font-medium text-lg mb-3 flex items-center">
                              <Icons.mail className="mr-2 h-5 w-5" />
                              Contact Info
                            </h4>
                            <div className="space-y-4">
                              <div className="flex">
                                <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mr-3">
                                  <Icons.mail className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                  <p className="font-medium">{aboutData.contactInfo.email}</p>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                                  <Icons.link className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                  <p className="font-medium">{aboutData.contactInfo.website}</p>
                                  <p className="text-sm text-muted-foreground">Website</p>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                                  <Icons.instagram className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <p className="font-medium">{aboutData.contactInfo.social.instagram}</p>
                                  <p className="text-sm text-muted-foreground">Instagram</p>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                  <Icons.twitter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium">{aboutData.contactInfo.social.twitter}</p>
                                  <p className="text-sm text-muted-foreground">Twitter</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="friends" className="mt-0">
                    <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-4">Friends · {userData.stats.friends}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <Link key={i} href={`/profile/friend${i + 1}`} className="block group">
                              <div className="rounded-xl border border-primary/10 p-3 hover:border-primary/20 hover:shadow-sm transition-all">
                                <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                                  <Image
                                    src={`/placeholder.svg?height=150&width=150&text=Friend+${i + 1}`}
                                    alt={`Friend ${i + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <p className="font-medium">Friend Name {i + 1}</p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.floor(Math.random() * 10) + 1} mutual friends
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="photos" className="mt-0">
                    <Card className="rounded-xl border-primary/20 overflow-hidden bg-background/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-4">Photos · {userData.stats.photos}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                              <Image
                                src={`/placeholder.svg?height=200&width=200&text=Photo+${i + 1}`}
                                alt={`Photo ${i + 1}`}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

