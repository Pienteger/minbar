"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

// Mock data for notifications
const notifications = [
  {
    id: "1",
    type: "friend_request",
    user: {
      name: "Bashar Ovi",
      avatar: "/ovi.jpg?height=40&width=40",
    },
    content: "sent you a friend request",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    actionable: true,
  },
  {
    id: "2",
    type: "like",
    user: {
      name: "Yusuf Hasan",
      avatar: "/polok.jpg?height=40&width=40",
    },
    content: "liked your post",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    actionable: false,
  },
  {
    id: "3",
    type: "comment",
    user: {
      name: "Zahid Sarmon",
      avatar: "/jahid.jpg?height=40&width=40",
    },
    content: "commented on your photo",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    actionable: false,
  },
  {
    id: "4",
    type: "mention",
    user: {
      name: "Yunus Sarkar",
      avatar: "/yunus.jpg?height=40&width=40",
    },
    content: "mentioned you in a comment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    actionable: false,
  },
  {
    id: "5",
    type: "group_invite",
    user: {
      name: "Arfizur Rahman",
      avatar: "/arfiz.jpg?height=40&width=40",
    },
    content: "invited you to join Photography Enthusiasts group",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    actionable: true,
  },
]

export function NotificationList() {
  const [activeTab, setActiveTab] = useState("all")
  const [notificationState, setNotificationState] = useState(notifications)

  const markAsRead = (id: string) => {
    setNotificationState(
      notificationState.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const handleAction = (id: string, action: "accept" | "decline") => {
    // In a real app, this would call an API to handle the action
    console.log(`Notification ${id}: ${action}`)
    markAsRead(id)
  }

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    if (activeTab === "requests") return notification.type === "friend_request"
    return true
  })

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Unread
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Icons.bell className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-2 text-muted-foreground">No notifications to show</p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-2 lg:gap-3 space-y-3 lg:space-y-0">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-xl transition-all duration-300 hover:shadow-md",
                    notification.isRead
                      ? "bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/20"
                      : "bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20 border border-primary/20 hover:border-primary/30",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {!notification.isRead && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <p>
                        <span className="font-medium">{notification.user.name}</span>{" "}
                        <span className="text-muted-foreground">{notification.content}</span>
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                        {formatDistanceToNow(notification.timestamp)}
                      </span>
                    </div>

                    {notification.actionable && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full"
                          onClick={() => handleAction(notification.id, "accept")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-primary/20"
                          onClick={() => handleAction(notification.id, "decline")}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

