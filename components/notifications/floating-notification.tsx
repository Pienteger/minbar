"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface NotificationData {
  id: string
  type: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: Date
}

interface FloatingNotificationProps {
  notification: NotificationData
  onClose: () => void
  onAction?: (action: string) => void
}

export function FloatingNotification({ notification, onClose, onAction }: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Handle animation complete
  const handleAnimationComplete = () => {
    if (!isVisible) {
      onClose()
    }
  }

  const getIcon = () => {
    switch (notification.type) {
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-40 ${isDesktop ? "top-4 right-4" : "top-16 left-1/2 transform -translate-x-1/2"} max-w-sm`}
          initial={{ opacity: 0, y: -20, x: isDesktop ? 20 : "-50%" }}
          animate={{ opacity: 1, y: 0, x: isDesktop ? 0 : "-50%" }}
          exit={{ opacity: 0, y: -20, x: isDesktop ? 20 : "-50%" }}
          transition={{ type: "spring", damping: 15 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="bg-background/95 backdrop-blur-md border border-primary/20 rounded-xl shadow-lg p-3 flex items-start space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 p-0.5 bg-background rounded-full">{getIcon()}</div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{notification.user.name}</span>{" "}
                    <span className="text-muted-foreground">{notification.content}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(notification.timestamp)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground"
                  onClick={() => setIsVisible(false)}
                >
                  <Icons.close className="h-3 w-3" />
                </Button>
              </div>

              {notification.type === "friend_request" && (
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full"
                    onClick={() => onAction?.("accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs rounded-full border-primary/20"
                    onClick={() => onAction?.("decline")}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

