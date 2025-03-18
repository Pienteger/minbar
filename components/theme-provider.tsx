"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force theme application on client-side
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Apply theme class directly to document element to ensure it works
  React.useEffect(() => {
    if (mounted) {
      const theme = localStorage.getItem("theme") || props.defaultTheme || "system"
      const root = window.document.documentElement

      // Remove existing theme classes
      root.classList.remove("light", "dark")

      // Apply theme based on stored preference or system preference
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }
  }, [mounted, props.defaultTheme])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

