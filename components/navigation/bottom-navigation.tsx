"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const navItems = [
  {
    name: "Home",
    href: "/feed",
    icon: Icons.home,
  },
  {
    name: "Chats",
    href: "/chats",
    icon: Icons.chat,
  },
  {
    name: "Mosques",
    href: "/mosques",
    icon: Icons.mosque,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Icons.bell,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-primary/10">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "animate-pulse-scale")} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

