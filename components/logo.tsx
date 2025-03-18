import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">M</span>
      </div>
      <span className="font-bold text-xl">Minbar</span>
    </div>
  )
}

