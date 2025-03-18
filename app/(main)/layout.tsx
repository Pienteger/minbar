import type React from "react"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationProvider } from "@/components/notifications/notification-provider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-950/20 dark:to-orange-950/20">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Mobile Top Navigation */}
        <div className="lg:hidden">
          <TopNavigation />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 container mx-auto pb-16 pt-14 lg:pt-8 lg:pb-8 px-4">{children}</main>
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <BottomNavigation />
          {/* <div className="fixed bottom-20 right-4">
            <ThemeToggle />
          </div> */}
        </div>
      </div>
    </NotificationProvider>
  )
}

