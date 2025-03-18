"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { MosqueRoleBadge } from "@/components/mosque/mosque-role-badge"
import { MosqueFeed } from "@/components/mosque/mosque-feed"
import { ScholarQA } from "@/components/mosque/scholar-qa"
import { MosqueEvents } from "@/components/mosque/mosque-events"
import { MosqueBusinessDirectory } from "@/components/mosque/mosque-business-directory"
import type { Mosque, MosqueRole, MembershipType, MembershipStatus } from "@/types/mosque"

interface MosqueProfileProps {
  mosque: Mosque
  membership?: {
    type: MembershipType
    status: MembershipStatus
    role: MosqueRole
  }
  onJoin?: (mosqueId: string, membershipType: MembershipType) => void
  onBreak?: (mosqueId: string) => void
  onRejoin?: (mosqueId: string) => void
}

export function MosqueProfile({ mosque, membership, onJoin, onBreak, onRejoin }: MosqueProfileProps) {
  const [activeTab, setActiveTab] = useState("feed")
  const [isJoining, setIsJoining] = useState(false)
  const [selectedMembershipType, setSelectedMembershipType] = useState<MembershipType | null>(null)
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false)

  const handleJoin = (type: MembershipType) => {
    setIsJoining(true)
    setSelectedMembershipType(type)

    if (onJoin) {
      onJoin(mosque.id, type)
    }

    // In a real app, this would be handled by the onJoin callback
    setTimeout(() => {
      setIsJoining(false)
      setSelectedMembershipType(null)
    }, 1000)
  }

  const handleBreak = () => {
    if (onBreak) {
      onBreak(mosque.id)
    }
    setIsBreakModalOpen(false)
  }

  const handleRejoin = () => {
    if (onRejoin && membership) {
      onRejoin(mosque.id)
    }
  }

  const getMembershipBadge = () => {
    if (!membership) return null

    let color = ""
    let icon = null

    switch (membership.type) {
      case "home":
        color = "bg-blue-500"
        icon = <Icons.home className="h-4 w-4 mr-1" />
        break
      case "office":
        color = "bg-green-500"
        icon = <Icons.briefcase className="h-4 w-4 mr-1" />
        break
      case "roaming":
        color = "bg-purple-500"
        icon = <Icons.map className="h-4 w-4 mr-1" />
        break
    }

    return (
      <Badge className={`${color} text-white flex items-center`}>
        {icon}
        <span className="capitalize">{membership.type} Mosque</span>
      </Badge>
    )
  }

  const getStatusBadge = () => {
    if (!membership) return null

    let color = ""
    let text = ""

    switch (membership.status) {
      case "active":
        color = "bg-green-500"
        text = "Active Member"
        break
      case "pending":
        color = "bg-amber-500"
        text = "Verification Pending"
        break
      case "break":
        color = "bg-gray-500"
        text = "On Break"
        break
      case "rejected":
        color = "bg-red-500"
        text = "Verification Rejected"
        break
    }

    return <Badge className={`${color} text-white`}>{text}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Cover Image and Profile Info */}
      <div className="relative">
        <div className="h-48 md:h-64 lg:h-80 relative rounded-xl overflow-hidden">
          <Image
            src={mosque.coverImage || "/placeholder.svg?height=300&width=1200"}
            alt={mosque.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{mosque.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center">
              <Icons.mapPin className="h-4 w-4 mr-1" />
              <span>
                {mosque.city}, {mosque.country}
              </span>
            </div>
            <div className="flex items-center">
              <Icons.users className="h-4 w-4 mr-1" />
              <span>{mosque.memberCount} members</span>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-2 items-end">
          {getMembershipBadge()}
          {getStatusBadge()}
          {membership && membership.role !== "member" && <MosqueRoleBadge role={membership.role} />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {mosque.website && (
            <Button variant="outline" className="rounded-full border-primary/20">
              <Icons.globe className="mr-2 h-4 w-4" />
              Website
            </Button>
          )}
          <Button variant="outline" className="rounded-full border-primary/20">
            <Icons.share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="flex gap-2">
          {!membership ? (
            <div className="relative group">
              <Button
                className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={() => handleJoin("home")}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Icons.add className="mr-2 h-4 w-4" />
                    Join Mosque
                  </>
                )}
              </Button>

              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10">
                <Card className="p-2 w-40 shadow-lg">
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full justify-start rounded-lg bg-blue-500 hover:bg-blue-600"
                      onClick={() => handleJoin("home")}
                      disabled={isJoining}
                    >
                      <Icons.home className="mr-2 h-4 w-4" />
                      Home Mosque
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-start rounded-lg bg-green-500 hover:bg-green-600"
                      onClick={() => handleJoin("office")}
                      disabled={isJoining}
                    >
                      <Icons.briefcase className="mr-2 h-4 w-4" />
                      Office Mosque
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-start rounded-lg bg-purple-500 hover:bg-purple-600"
                      onClick={() => handleJoin("roaming")}
                      disabled={isJoining}
                    >
                      <Icons.map className="mr-2 h-4 w-4" />
                      Roaming Mosque
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ) : membership.status === "break" ? (
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600" onClick={handleRejoin}>
              <Icons.arrowRight className="mr-2 h-4 w-4" />
              Rejoin Mosque
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              onClick={() => setIsBreakModalOpen(true)}
            >
              <Icons.clock className="mr-2 h-4 w-4" />
              Take a Break
            </Button>
          )}
        </div>
      </div>

      {/* Mosque Description */}
      <Card className="rounded-xl border-primary/20">
        <CardContent className="p-4">
          <p>{mosque.description}</p>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="feed"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Q&A
          </TabsTrigger>
          <TabsTrigger
            value="directory"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Directory
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <MosqueFeed mosqueId={mosque.id} userRole={membership?.role} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <MosqueEvents mosqueId={mosque.id} userRole={membership?.role} />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <ScholarQA mosqueId={mosque.id} userRole={membership?.role} />
        </TabsContent>

        <TabsContent value="directory" className="mt-6">
          <MosqueBusinessDirectory mosqueId={mosque.id} userRole={membership?.role} />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Mosque Members</h2>
              {membership?.role === "imam" && (
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock member data */}
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="rounded-xl border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=User${i + 1}`}
                          alt={`User ${i + 1}`}
                        />
                        <AvatarFallback>U{i + 1}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">User Name {i + 1}</p>
                        <p className="text-sm text-muted-foreground">@username{i + 1}</p>
                      </div>
                      {i === 0 && <MosqueRoleBadge role="imam" size="sm" />}
                      {i === 1 && <MosqueRoleBadge role="muezzin" size="sm" />}
                      {i === 2 && <MosqueRoleBadge role="khatib" size="sm" />}
                      {i === 3 && <MosqueRoleBadge role="scholar" size="sm" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

