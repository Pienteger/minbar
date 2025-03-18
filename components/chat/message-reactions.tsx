"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageReactionsProps {
  reactions: Record<string, string[]> | undefined;
  messageId: string;
  onReact: (messageId: string, emoji: string, action: "add" | "remove") => void;
  currentUserId: string;
}

// Common emoji reactions
const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥", "🎉"];

export function MessageReactions({
  reactions = {},
  messageId,
  onReact,
  currentUserId,
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReaction = (emoji: string) => {
    const hasReacted = reactions[emoji]?.includes(currentUserId);
    onReact(messageId, emoji, hasReacted ? "remove" : "add");
    setIsOpen(false);
  };

  // Count total reactions
  const totalReactions = Object.values(reactions).reduce(
    (sum, users) => sum + users.length,
    0
  );

  return (
    <div className="flex items-center">
      {/* Display existing reactions */}
      {Object.entries(reactions).length > 0 && (
        <div className="flex items-center mr-2 bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-primary/10">
          {Object.entries(reactions).map(([emoji, users]) => (
            <button
              key={emoji}
              className={cn(
                "text-xs px-1 rounded hover:bg-muted/50 transition-colors",
                users.includes(currentUserId) ? "text-primary font-medium" : ""
              )}
              onClick={() => handleReaction(emoji)}
            >
              {emoji} {users.length > 1 ? users.length : ""}
            </button>
          ))}
        </div>
      )}

      {/* Add reaction button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <span className="text-xs">😊</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 border-primary/20 rounded-xl"
          side="top"
          align="start"
        >
          <div className="flex space-x-1">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                className={cn(
                  "text-lg p-1.5 rounded-full hover:bg-muted/50 transition-colors",
                  reactions[emoji]?.includes(currentUserId)
                    ? "bg-primary/10 text-primary"
                    : ""
                )}
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
