"use client";
import type { MosqueChatRoom } from "@/types/mosque-chat";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "@/lib/date-utils";

// Mock data for chats
const chats = [
  {
    id: "1",
    user: {
      name: "Sabbir Al Shafi",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: {
      text: "Mama, ppt slide ta ready rakhis",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: true,
      isUser: false,
    },
  },
  {
    id: "2",
    user: {
      name: "Mahfuzur Rahman Arnob",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "I have sent you the files",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      isUser: false,
    },
  },
  {
    id: "3",
    user: {
      name: "Khalid Sakib",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: {
      text: "I'll be there in 10 minutes",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      isUser: true,
    },
  },
  {
    id: "4",
    user: {
      name: "Ahnaf Shahriar",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "Thanks for the help!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      isUser: false,
    },
  },
  {
    id: "5",
    user: {
      name: "Jahangir Abbus",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: {
      text: "Let's meet tomorrow for coffee",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      isUser: false,
    },
  },
];

// Mock data for mosque chats
const mosqueChats: MosqueChatRoom[] = [
  {
    id: "mosque-chat-1",
    mosqueId: "mosque1",
    name: "Banani Central Mosque General",
    type: "general",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    lastMessage: {
      id: "msg1",
      senderId: "user5",
      recipientId: "mosque",
      content: "Does anyone know what time is Isha prayer today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isEncrypted: false,
      mosqueId: "mosque1",
      chatRoomId: "mosque-chat-1",
    },
    unreadCount: 3,
    participantCount: 156,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "mosque-chat-2",
    mosqueId: "mosque1",
    name: "Banani Central Mosque Announcements",
    type: "announcements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    lastMessage: {
      id: "msg2",
      senderId: "imam1",
      recipientId: "mosque",
      content:
        "Important: Jummah prayer time changed to 1:30 PM this week due to special circumstances.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isEncrypted: false,
      mosqueId: "mosque1",
      chatRoomId: "mosque-chat-2",
    },
    unreadCount: 1,
    participantCount: 245,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "mosque-chat-3",
    mosqueId: "mosque2",
    name: "Gulshan Central Mosque General",
    type: "general",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    lastMessage: {
      id: "msg3",
      senderId: "user8",
      recipientId: "mosque",
      content: "Is anyone attending the Quran study circle tonight?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isEncrypted: false,
      mosqueId: "mosque2",
      chatRoomId: "mosque-chat-3",
    },
    unreadCount: 0,
    participantCount: 128,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "mosque-chat-4",
    mosqueId: "mosque2",
    name: "Volunteers",
    type: "volunteers",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    lastMessage: {
      id: "msg4",
      senderId: "user12",
      recipientId: "mosque",
      content:
        "We need 5 more volunteers for the community iftar next week. Please sign up if you can help.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      isEncrypted: false,
      mosqueId: "mosque2",
      chatRoomId: "mosque-chat-4",
    },
    unreadCount: 2,
    participantCount: 42,
    image: "/placeholder.svg?height=40&width=40",
  },
];

export function ChatList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  const filteredPersonalChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMosqueChats = mosqueChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search chats"
          className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="personal"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="mosque"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Mosque Chats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <div className="space-y-1 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {filteredPersonalChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10 hover:shadow-sm"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                    <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.user.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{chat.user.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.isUser && "You: "}
                      {chat.lastMessage.text}
                    </p>
                    {!chat.lastMessage.isRead && !chat.lastMessage.isUser && (
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mosque" className="mt-4">
          <div className="space-y-1 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {filteredMosqueChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/mosque/${chat.mosqueId}/${chat.id}`}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10 hover:shadow-sm"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.image} alt={chat.name} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-background"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {chat.lastMessage
                        ? formatDistanceToNow(chat.lastMessage.timestamp)
                        : "No messages"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage
                        ? chat.lastMessage.content
                        : "Start a conversation"}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
