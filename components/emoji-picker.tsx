"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  children: React.ReactNode
}

export function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native)
    setOpen(false)
  }

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={buttonRef}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-primary/20 rounded-xl" side="top" align="center" sideOffset={5}>
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          previewPosition="none"
          skinTonePosition="none"
          set="native"
        />
      </PopoverContent>
    </Popover>
  )
}

