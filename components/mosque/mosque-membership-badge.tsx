import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { MembershipType, MosqueRole } from "@/types/mosque";

interface MosqueMembershipBadgeProps {
  mosqueName: string;
  membershipType: MembershipType;
  role: MosqueRole;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function MosqueMembershipBadge({
  mosqueName,
  membershipType,
  role,
  className,
  showIcon = true,
  size = "md",
}: MosqueMembershipBadgeProps) {
  // Define badge colors based on membership type
  const badgeColors = {
    home: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    office:
      "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    roaming:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
  };

  // Define role icons
  const roleIcons = {
    imam: Icons.star,
    muezzin: Icons.mic,
    khadem: Icons.tool,
    khatib: Icons.bookOpen,
    scholar: Icons.graduationCap,
    member: Icons.user,
  };

  const RoleIcon = roleIcons[role];

  // Define badge sizes
  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2.5",
    lg: "text-base py-1.5 px-3",
  };

  return (
    <Badge
      className={cn(
        "font-medium text-white shadow-sm",
        badgeColors[membershipType],
        sizeClasses[size],
        className
      )}
      variant="outline"
    >
      {showIcon && <RoleIcon className="mr-1 h-3 w-3" />}
      <span className="truncate max-w-[120px]">{mosqueName}</span>
    </Badge>
  );
}
