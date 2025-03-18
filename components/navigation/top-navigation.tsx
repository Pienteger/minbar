"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Logo } from "@/components/logo"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

export function TopNavigation() {
  const pathname = usePathname()

  // Determine which title to show based on the current path
  let title = ""
  if (pathname === "/feed") title = "Home"
  else if (pathname === "/chats") title = "Chats"
  else if (pathname === "/groups") title = "Groups"
  else if (pathname === "/notifications") title = "Notifications"
  else if (pathname === "/profile") title = "Profile"
  else if (pathname.startsWith("/search")) title = "Search"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-14 flex items-center px-4">
      {pathname === "/feed" ? <Logo className="h-6" /> : <div className="font-semibold text-lg">{title}</div>}

      <div className="ml-auto flex items-center space-x-2">
        {pathname === "/feed" && (
          <>
            <NotificationDropdown />
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
              <Link href="/search">
                <Icons.search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
          </>
        )}

        {pathname === "/chats" && (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Icons.add className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
        )}
      </div>
    </header>
  )
}

