"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "@/lib/date-utils";
import { StickerPicker } from "@/components/chat/sticker-picker";
import { MessageReactions } from "@/components/chat/message-reactions";
import { MessageActions } from "@/components/chat/message-actions";
import type { ChatMessage } from "@/lib/signalr-client";
import type { MosqueChatRoom as MosqueChatRoomType } from "@/types/mosque-chat";

interface MosqueChatRoomProps {
  mosqueId: string;
  chatId: string;
}

// Mock data for mosque chat
const mockMosqueChat: MosqueChatRoomType = {
  id: "mosque-chat-1",
  mosqueId: "mosque1",
  name: "Gulshan Central Mosque General",
  description: "General discussion for all mosque members",
  type: "general",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  updatedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  unreadCount: 0,
  participantCount: 156,
  image: "/placeholder.svg?height=40&width=40",
};

// Mock data for messages
const mockMessages: ChatMessage[] = [
  {
    id: "msg1",
    senderId: "imam1",
    recipientId: "mosque",
    content:
      "Assalamu alaikum everyone! Welcome to our mosque chat. This is a place for our community to connect, share, and support each other.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isEncrypted: false,
    mosqueId: "mosque1",
    chatRoomId: "mosque-chat-1",
    reactions: { "👍": ["user2", "user3"], "❤️": ["user4"] },
  },
  {
    id: "msg2",
    senderId: "user2",
    recipientId: "mosque",
    content:
      "Wa alaikum assalam! Thank you for creating this space. I'm looking forward to connecting with everyone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
    isEncrypted: false,
    mosqueId: "mosque1",
    chatRoomId: "mosque-chat-1",
    reactions: {},
  },
  {
    id: "msg3",
    senderId: "user3",
    recipientId: "mosque",
    content: "Does anyone know what time is Isha prayer today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    isEncrypted: false,
    mosqueId: "mosque1",
    chatRoomId: "mosque-chat-1",
    reactions: {},
  },
  {
    id: "msg4",
    senderId: "imam1",
    recipientId: "mosque",
    content:
      "Isha prayer today is at 8:30 PM. We also have a special Quran study circle after Isha at 9:15 PM. Everyone is welcome to join!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isEncrypted: false,
    mosqueId: "mosque1",
    chatRoomId: "mosque-chat-1",
    replyToId: "msg3",
    replyToContent: "Does anyone know what time is Isha prayer today?",
    reactions: { "👍": ["user2", "user3", "user5"], "🙏": ["user4", "user6"] },
  },
  {
    id: "msg5",
    senderId: "user5",
    recipientId: "mosque",
    content:
      "JazakAllah khair for the information! I'll try to attend the study circle as well.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isEncrypted: false,
    mosqueId: "mosque1",
    chatRoomId: "mosque-chat-1",
    reactions: { "❤️": ["imam1"] },
  },
];

// Mock data for users
const mockUsers = {
  imam1: {
    id: "imam1",
    name: "Imam Abdullah",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "imam",
  },
  user2: {
    id: "user2",
    name: "Ahmed Khan",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
  user3: {
    id: "user3",
    name: "Fatima Ali",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
  user4: {
    id: "user4",
    name: "Omar Farooq",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
  user5: {
    id: "user5",
    name: "Aisha Rahman",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
  user6: {
    id: "user6",
    name: "Yusuf Ibrahim",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
};

export function MosqueChatRoom({ mosqueId, chatId }: MosqueChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [chatRoom, setChatRoom] = useState<MosqueChatRoomType>(mockMosqueChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "user5"; // Mock current user ID

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: currentUserId,
      recipientId: "mosque",
      content: inputValue,
      timestamp: new Date(),
      isEncrypted: false,
      mosqueId,
      chatRoomId: chatId,
      replyToId: replyTo?.id,
      replyToContent: replyTo?.content,
      reactions: {},
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setReplyTo(null);
  };

  const handleSendSticker = (stickerUrl: string) => {
    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: currentUserId,
      recipientId: "mosque",
      content: "",
      timestamp: new Date(),
      isEncrypted: false,
      mosqueId,
      chatRoomId: chatId,
      type: "sticker",
      stickerUrl,
      reactions: {},
    };

    setMessages([...messages, newMessage]);
    setShowStickerPicker(false);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((message) => {
        if (message.id === messageId) {
          const reactions = { ...message.reactions } || {};

          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }

          // Toggle reaction
          if (reactions[emoji].includes(currentUserId)) {
            reactions[emoji] = reactions[emoji].filter(
              (id) => id !== currentUserId
            );
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji].push(currentUserId);
          }

          return { ...message, reactions };
        }
        return message;
      })
    );
  };

  const handleDeleteMessage = (
    messageId: string,
    deleteFor: "self" | "everyone"
  ) => {
    if (deleteFor === "everyone") {
      setMessages(messages.filter((message) => message.id !== messageId));
    } else {
      setMessages(
        messages.map((message) => {
          if (message.id === messageId) {
            return { ...message, deletedFor: "self" };
          }
          return message;
        })
      );
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(
      messages.map((message) => {
        if (message.id === messageId) {
          return { ...message, content: newContent, isEdited: true };
        }
        return message;
      })
    );
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.deletedFor === "self") return null;

    const isCurrentUser = message.senderId === currentUserId;
    const user = mockUsers[message.senderId as keyof typeof mockUsers];

    return (
      <div
        key={message.id}
        className={`flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`flex ${
            isCurrentUser ? "flex-row-reverse" : "flex-row"
          } max-w-[80%]`}
        >
          {!isCurrentUser && (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          )}

          <div
            className={`flex flex-col ${
              isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            {!isCurrentUser && (
              <div className="flex items-center mb-1">
                <Link
                  href={`/profile/${user?.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {user?.name}
                </Link>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDistanceToNow(message.timestamp)}
                </span>
              </div>
            )}

            <div className="group relative">
              {message.replyToId && (
                <div
                  className={`text-xs p-2 rounded-lg mb-1 max-w-xs ${
                    isCurrentUser
                      ? "bg-muted/50 text-muted-foreground mr-2"
                      : "bg-muted/50 text-muted-foreground ml-2"
                  }`}
                >
                  <div className="font-medium mb-0.5">Replying to message:</div>
                  <div className="truncate">{message.replyToContent}</div>
                </div>
              )}

              <div
                className={`p-3 rounded-xl ${
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/80 backdrop-blur-sm"
                }`}
              >
                {message.type === "sticker" ? (
                  <div className="w-32 h-32 relative">
                    <Image
                      src={
                        message.stickerUrl ||
                        "/placeholder.svg?height=128&width=128"
                      }
                      alt="Sticker"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                )}

                {message.isEdited && (
                  <span className="text-xs opacity-70 ml-1">(edited)</span>
                )}
              </div>

              <MessageActions
                message={message}
                isCurrentUser={isCurrentUser}
                onReply={() => setReplyTo(message)}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            </div>

            {Object.keys(message.reactions || {}).length > 0 && (
              <MessageReactions
                reactions={message.reactions || {}}
                messageId={message.id}
                currentUserId={currentUserId}
                onReact={handleReactToMessage}
              />
            )}

            {isCurrentUser && (
              <div className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(message.timestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/60 backdrop-blur-sm rounded-xl border border-primary/10">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chatRoom.image} alt={chatRoom.name} />
            <AvatarFallback>{chatRoom.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chatRoom.name}</h2>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
              {chatRoom.participantCount} members
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icons.info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat Information</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icons.search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icons.users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Members</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 border-t border-primary/10 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.reply className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Replying to{" "}
              <span className="font-medium">
                {mockUsers[replyTo.senderId as keyof typeof mockUsers]?.name}
              </span>
            </span>
            <div className="ml-2 text-sm max-w-md truncate">
              {replyTo.content}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => setReplyTo(null)}
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sticker picker */}
      {showStickerPicker && (
        <div className="p-2 border-t border-primary/10">
          <StickerPicker
            onSelectSticker={handleSendSticker}
            onClose={() => setShowStickerPicker(false)}
          />
        </div>
      )}

      {/* Chat input */}
      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setShowStickerPicker(!showStickerPicker)}
          >
            <Icons.smile className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="pr-10 bg-muted/50 border-primary/20 rounded-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
              onClick={() => setInputValue("")}
              disabled={inputValue === ""}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
          >
            <Icons.send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
