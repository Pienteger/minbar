"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { FloatingNotification } from "@/components/notifications/floating-notification"

// Mock notifications that will appear randomly
const mockNotifications = [
  {
    id: "n1",
    type: "like",
    user: {
      name: "Forhad Hasan Anik",
      avatar: "/forhad.jpg?height=40&width=40",
    },
    content: "liked your post",
    timestamp: new Date(),
  },
  {
    id: "n2",
    type: "comment",
    user: {
      name: "Zakir Hossen",
      avatar: "/zakir.jpg?height=40&width=40",
    },
    content: "commented on your photo",
    timestamp: new Date(),
  },
  {
    id: "n3",
    type: "friend_request",
    user: {
      name: "Sarwar Zoha",
      avatar: "/zoha.jpg?height=40&width=40",
    },
    content: "sent you a friend request",
    timestamp: new Date(),
  },
]

interface NotificationContextType {
  showNotification: (notification: any) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [activeNotification, setActiveNotification] = useState<any | null>(null)

  // Function to show a notification
  const showNotification = (notification: any) => {
    setActiveNotification(notification)
  }

  // For demo purposes, show random notifications occasionally
  useEffect(() => {
    // Only in development and if enabled
    if (process.env.NODE_ENV === "development") {
      const showRandomNotification = () => {
        // Only show if no notification is currently active
        if (!activeNotification) {
          const randomIndex = Math.floor(Math.random() * mockNotifications.length)
          const notification = {
            ...mockNotifications[randomIndex],
            id: `${mockNotifications[randomIndex].id}-${Date.now()}`,
            timestamp: new Date(),
          }
          showNotification(notification)
        }
      }

      // Show first notification after 10 seconds
      const initialTimer = setTimeout(showRandomNotification, 10000)

      // Then show random notifications every 30-60 seconds
      const interval = setInterval(
        () => {
          // 50% chance to show a notification
          if (Math.random() > 0.5) {
            showRandomNotification()
          }
        },
        30000 + Math.random() * 30000,
      )

      return () => {
        clearTimeout(initialTimer)
        clearInterval(interval)
      }
    }
  }, [activeNotification])

  const handleNotificationClose = () => {
    setActiveNotification(null)
  }

  const handleNotificationAction = (action: string) => {
    console.log(`Notification action: ${action} for ${activeNotification?.id}`)
    setActiveNotification(null)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Render the floating notification if active */}
      {activeNotification && (
        <FloatingNotification
          notification={activeNotification}
          onClose={handleNotificationClose}
          onAction={handleNotificationAction}
        />
      )}
    </NotificationContext.Provider>
  )
}

