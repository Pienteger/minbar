"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import type { Mosque, MembershipType, MembershipStatus } from "@/types/mosque"
import { cn } from "@/lib/utils"

interface MosqueCardProps {
  mosque: Mosque
  membership?: {
    type: MembershipType
    status: MembershipStatus
  }
  onJoin?: (mosqueId: string, membershipType: MembershipType) => void
  className?: string
}

export function MosqueCard({ mosque, membership, onJoin, className }: MosqueCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [selectedMembershipType, setSelectedMembershipType] = useState<MembershipType | null>(null)

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

  const getMembershipBadge = () => {
    if (!membership) return null

    let color = ""
    let icon = null

    switch (membership.type) {
      case "home":
        color = "bg-blue-500"
        icon = <Icons.home className="h-3 w-3 mr-1" />
        break
      case "office":
        color = "bg-green-500"
        icon = <Icons.briefcase className="h-3 w-3 mr-1" />
        break
      case "roaming":
        color = "bg-purple-500"
        icon = <Icons.map className="h-3 w-3 mr-1" />
        break
    }

    let statusColor = ""
    switch (membership.status) {
      case "active":
        statusColor = "bg-green-500"
        break
      case "pending":
        statusColor = "bg-amber-500"
        break
      case "break":
        statusColor = "bg-gray-500"
        break
      case "rejected":
        statusColor = "bg-red-500"
        break
    }

    return (
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <Badge className={`${color} text-white flex items-center`}>
          {icon}
          <span className="capitalize">{membership.type}</span>
        </Badge>
        {membership.status !== "active" && (
          <Badge className={`${statusColor} text-white`}>
            <span className="capitalize">{membership.status}</span>
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md group", className)}>
      <div className="relative h-40">
        <Image
          src={mosque.coverImage || "/placeholder.svg?height=160&width=400"}
          alt={mosque.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="font-bold text-lg">{mosque.name}</h3>
          <p className="text-sm text-white/80">
            {mosque.city}, {mosque.country}
          </p>
        </div>
        {getMembershipBadge()}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icons.users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{mosque.memberCount} members</span>
        </div>

        <p className="text-sm line-clamp-2">{mosque.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" asChild className="rounded-full border-primary/20">
          <Link href={`/mosques/${mosque.id}`}>View Details</Link>
        </Button>

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
                  Join
                </>
              )}
            </Button>

            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block">
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
          <Button
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            onClick={() => handleJoin(membership.type)}
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Rejoining...
              </>
            ) : (
              <>
                <Icons.arrowRight className="mr-2 h-4 w-4" />
                Rejoin
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="rounded-full border-primary/20" disabled={isJoining}>
            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
            Joined
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

