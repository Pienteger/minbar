"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Mock data for notifications
const recentNotifications = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your post",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "commented on your photo",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: "3",
    type: "friend_request",
    user: {
      name: "Sarah Parker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "sent you a friend request",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(recentNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Icons.heart className="h-4 w-4 text-pink-500" />
      case "comment":
        return <Icons.chat className="h-4 w-4 text-blue-500" />
      case "friend_request":
        return <Icons.user className="h-4 w-4 text-green-500" />
      default:
        return <Icons.bell className="h-4 w-4 text-orange-500" />
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {isDesktop && (
          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <Icons.bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl border-primary/20 p-0 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-primary/10">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary hover:text-primary/80"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Icons.bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer focus:bg-muted/50 ${!notification.isRead ? "bg-primary/5" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 p-0.5 bg-background rounded-full">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{notification.user.name}</span>{" "}
                      <span className="text-muted-foreground">{notification.content}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(notification.timestamp)}
                    </p>

                    {notification.type === "friend_request" && !notification.isRead && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full"
                        >
                          Accept
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs rounded-full border-primary/20">
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                  {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
          <Link
            href="/notifications"
            className="w-full text-center p-3 text-sm text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            See all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

