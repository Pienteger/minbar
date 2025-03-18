import type { MosqueRole } from "@/types/mosque"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface MosqueRoleBadgeProps {
  role: MosqueRole
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MosqueRoleBadge({ role, size = "md", className }: MosqueRoleBadgeProps) {
  const getIconAndColor = () => {
    switch (role) {
      case "imam":
        return {
          icon: (
            <Icons.star className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")} />
          ),
          color: "bg-amber-500 text-white",
        }
      case "muezzin":
        return {
          icon: (
            <Icons.bell className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")} />
          ),
          color: "bg-blue-500 text-white",
        }
      case "khadem":
        return {
          icon: (
            <Icons.settings className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")} />
          ),
          color: "bg-green-500 text-white",
        }
      case "khatib":
        return {
          icon: (
            <Icons.fileText className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")} />
          ),
          color: "bg-purple-500 text-white",
        }
      case "scholar":
        return {
          icon: (
            <Icons.graduationCap
              className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")}
            />
          ),
          color: "bg-indigo-500 text-white",
        }
      default:
        return {
          icon: (
            <Icons.user className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5", "mr-1")} />
          ),
          color: "bg-gray-500 text-white",
        }
    }
  }

  const { icon, color } = getIconAndColor()

  return (
    <Badge
      className={cn(
        color,
        size === "sm" ? "text-xs px-2 py-0.5" : size === "md" ? "text-sm px-2.5 py-0.5" : "px-3 py-1",
        "flex items-center font-medium",
        className,
      )}
    >
      {icon}
      <span className="capitalize">{role}</span>
    </Badge>
  )
}

