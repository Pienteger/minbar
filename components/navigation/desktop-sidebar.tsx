"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    name: "Groups",
    href: "/groups",
    icon: Icons.users,
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
    name: "Profile",
    href: "/profile",
    icon: Icons.user,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col h-screen w-64 border-r border-primary/10 bg-background/80 backdrop-blur-md fixed left-0 top-0 z-30 p-4">
      <div className="flex items-center mb-8 pl-2">
        <Link href={"/feed"}>
          <Logo className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute left-0 w-1 h-8 rounded-full bg-gradient-to-b from-pink-500 to-orange-500"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="font-medium">{item.name}</span>

              {item.name === "Notifications" && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-[10px] text-white">
                  5
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/me.jpg?height=40&width=40" alt="User" />
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">Mahmudul Hasan</div>
              <div className="text-muted-foreground text-xs">@mahmudx</div>
            </div>
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </div>
  );
}
