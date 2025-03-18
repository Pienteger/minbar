"use client";

import type React from "react";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Image from "next/image";

interface StickerPickerProps {
  onStickerSelect: (stickerUrl: string) => void;
  children: React.ReactNode;
}

// Mock sticker packs
const stickerPacks = [
  {
    id: "emotions",
    name: "Emotions",
    stickers: [
      "/placeholder.svg?height=80&width=80&text=😊",
      "/placeholder.svg?height=80&width=80&text=😂",
      "/placeholder.svg?height=80&width=80&text=😍",
      "/placeholder.svg?height=80&width=80&text=😭",
      "/placeholder.svg?height=80&width=80&text=😡",
      "/placeholder.svg?height=80&width=80&text=🥳",
      "/placeholder.svg?height=80&width=80&text=😴",
      "/placeholder.svg?height=80&width=80&text=🤔",
      "/placeholder.svg?height=80&width=80&text=😎",
      "/placeholder.svg?height=80&width=80&text=🙄",
      "/placeholder.svg?height=80&width=80&text=😱",
      "/placeholder.svg?height=80&width=80&text=🤗",
    ],
  },
  {
    id: "animals",
    name: "Animals",
    stickers: [
      "/placeholder.svg?height=80&width=80&text=🐶",
      "/placeholder.svg?height=80&width=80&text=🐱",
      "/placeholder.svg?height=80&width=80&text=🐼",
      "/placeholder.svg?height=80&width=80&text=🦊",
      "/placeholder.svg?height=80&width=80&text=🦁",
      "/placeholder.svg?height=80&width=80&text=🐯",
      "/placeholder.svg?height=80&width=80&text=🐨",
      "/placeholder.svg?height=80&width=80&text=🐮",
      "/placeholder.svg?height=80&width=80&text=🐷",
      "/placeholder.svg?height=80&width=80&text=🐸",
      "/placeholder.svg?height=80&width=80&text=🦄",
      "/placeholder.svg?height=80&width=80&text=🐙",
    ],
  },
  {
    id: "food",
    name: "Food",
    stickers: [
      "/placeholder.svg?height=80&width=80&text=🍕",
      "/placeholder.svg?height=80&width=80&text=🍔",
      "/placeholder.svg?height=80&width=80&text=🍦",
      "/placeholder.svg?height=80&width=80&text=🍩",
      "/placeholder.svg?height=80&width=80&text=🍓",
      "/placeholder.svg?height=80&width=80&text=🍎",
      "/placeholder.svg?height=80&width=80&text=🍑",
      "/placeholder.svg?height=80&width=80&text=🍇",
      "/placeholder.svg?height=80&width=80&text=🍣",
      "/placeholder.svg?height=80&width=80&text=🌮",
      "/placeholder.svg?height=80&width=80&text=🍜",
      "/placeholder.svg?height=80&width=80&text=🍰",
    ],
  },
];

export function StickerPicker({
  onStickerSelect,
  children,
}: StickerPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(stickerPacks[0].id);

  const handleStickerSelect = (stickerUrl: string) => {
    onStickerSelect(stickerUrl);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 border-primary/20 rounded-xl"
        side="top"
        align="end"
        sideOffset={5}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between border-b p-2">
            <h3 className="font-medium text-sm">Stickers</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setOpen(false)}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>

          <TabsList className="grid grid-cols-3 p-1 mx-2 mt-2 rounded-lg bg-muted/50">
            {stickerPacks.map((pack) => (
              <TabsTrigger
                key={pack.id}
                value={pack.id}
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs"
              >
                {pack.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {stickerPacks.map((pack) => (
            <TabsContent
              key={pack.id}
              value={pack.id}
              className="p-2 h-60 overflow-y-auto"
            >
              <div className="grid grid-cols-3 gap-2">
                {pack.stickers.map((sticker, index) => (
                  <button
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden hover:bg-muted/50 transition-colors p-1"
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={sticker || "/placeholder.svg"}
                        alt={`Sticker ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
