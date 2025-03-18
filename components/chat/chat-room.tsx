"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { formatTime } from "@/lib/date-utils"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

// Mock data for a chat
const chatData = {
  id: "1",
  user: {
    id: "user1",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  messages: [
    {
      id: "msg1",
      text: "Hey there! How's your day going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: "user1",
      isRead: true,
    },
    {
      id: "msg2",
      text: "Hi Emma! It's going well, thanks for asking. Just finished a big project at work.",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      sender: "currentUser",
      isRead: true,
    },
    {
      id: "msg3",
      text: "That's awesome! Congrats on finishing the project. Was it the one you were telling me about last week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      sender: "user1",
      isRead: true,
    },
    {
      id: "msg4",
      text: "Yes, exactly! It was quite challenging but I'm happy with the results.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      sender: "currentUser",
      isRead: true,
    },
    {
      id: "msg5",
      text: "Do you want to grab coffee this weekend to celebrate?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: "user1",
      isRead: true,
    },
    {
      id: "msg6",
      text: "That sounds great! How about Saturday morning at that new café downtown?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      sender: "currentUser",
      isRead: true,
    },
    {
      id: "msg7",
      text: "Perfect! Let's meet at 10am. I've heard they have amazing pastries too.",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      sender: "user1",
      isRead: true,
    },
    {
      id: "msg8",
      text: "Looking forward to it! 😊",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      sender: "currentUser",
      isRead: true,
    },
  ],
  sharedMedia: [
    {
      id: "media1",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "media2",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
      id: "media3",
      type: "image",
      url: "/placeholder.svg?height=200&width=200",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
    {
      id: "media4",
      type: "video",
      url: "/placeholder.svg?height=200&width=200",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    {
      id: "media5",
      type: "file",
      name: "Project_Presentation.pdf",
      url: "#",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    },
    {
      id: "media6",
      type: "link",
      name: "Interesting Article",
      url: "https://example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
    },
  ],
}

interface ChatRoomProps {
  chatId: string
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(chatData.messages)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [nickName, setNickName] = useState("")
  const [chatColor, setChatColor] = useState("pink-to-orange")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }
  }, [isDesktop])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    const newMessage = {
      id: `msg${messages.length + 1}`,
      text: message,
      timestamp: new Date(),
      sender: "currentUser",
      isRead: false,
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const colorOptions = [
    { id: "pink-to-orange", name: "Sunset", from: "from-pink-500", to: "to-orange-500" },
    { id: "blue-to-purple", name: "Ocean", from: "from-blue-500", to: "to-purple-500" },
    { id: "green-to-teal", name: "Forest", from: "from-green-500", to: "to-teal-500" },
    { id: "yellow-to-red", name: "Autumn", from: "from-yellow-500", to: "to-red-500" },
    { id: "indigo-to-cyan", name: "Sky", from: "from-indigo-500", to: "to-cyan-500" },
  ]

  const getGradientClasses = (colorId: string) => {
    const color = colorOptions.find((c) => c.id === colorId)
    return color ? `${color.from} ${color.to}` : "from-pink-500 to-orange-500"
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)]">
      {/* Main Chat Area */}
      <div
        className={cn("flex flex-col flex-1 transition-all duration-300", isSidebarOpen && isDesktop ? "mr-80" : "")}
      >
        {/* Chat Header */}
        <Card className="border-b rounded-none lg:rounded-t-xl border-primary/10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={chatData.user.avatar} alt={chatData.user.name} />
              <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{nickName || chatData.user.name}</div>
              <div className="text-xs text-muted-foreground">{chatData.user.online ? "Online" : "Offline"}</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icons.phone className="h-4 w-4" />
              <span className="sr-only">Call</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icons.video className="h-4 w-4" />
              <span className="sr-only">Video call</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Icons.info className="h-4 w-4" />
              <span className="sr-only">Chat info</span>
            </Button>
          </div>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-pink-50/30 to-orange-50/30 dark:from-pink-950/10 dark:to-orange-950/10">
          {messages.map((msg) => {
            const isCurrentUser = msg.sender === "currentUser"

            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end space-x-2 max-w-[80%] lg:max-w-[60%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chatData.user.avatar} alt={chatData.user.name} />
                      <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? `bg-gradient-to-r ${getGradientClasses(chatColor)} text-white`
                        : "bg-background/80 backdrop-blur-sm border border-primary/10"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`text-xs mt-1 ${isCurrentUser ? "text-white/70" : "text-muted-foreground"}`}>
                      {formatTime(msg.timestamp)}
                      {isCurrentUser && msg.isRead && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <Card className="border-t rounded-none lg:rounded-b-xl border-primary/10 p-4 bg-background/80 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Icons.paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full border-primary/20"
            />
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Icons.mic className="h-4 w-4" />
              <span className="sr-only">Voice message</span>
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim()}
              className={`rounded-full bg-gradient-to-r ${getGradientClasses(chatColor)} hover:opacity-90`}
            >
              <Icons.send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-primary/10 z-40 transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
          isDesktop ? "lg:relative" : "",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-primary/10 flex justify-between items-center">
            <h3 className="font-semibold">Chat Info</h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 p-1 mx-4 mt-4 rounded-xl bg-muted/50">
              <TabsTrigger
                value="info"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Info
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="info" className="mt-4 space-y-6 h-full">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={chatData.user.avatar} alt={chatData.user.name} />
                    <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{nickName || chatData.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {chatData.user.online ? "Active now" : "Last active 2h ago"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button variant="outline" className="flex-1 rounded-full border-primary/20 mr-2">
                      <Icons.bell className="mr-2 h-4 w-4" />
                      Mute
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full border-primary/20">
                      <Icons.search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">About</h4>
                    <p className="text-sm text-muted-foreground">
                      Photographer, traveler, and coffee enthusiast. Always looking for the next adventure!
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-4 h-full">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Shared Media</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {chatData.sharedMedia
                      .filter((media) => media.type === "image" || media.type === "video")
                      .map((media) => (
                        <div key={media.id} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={media.url || "/placeholder.svg"}
                            alt="Shared media"
                            fill
                            className="object-cover"
                          />
                          {media.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Icons.play className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  <h4 className="text-sm font-medium mt-6">Files & Links</h4>
                  <div className="space-y-2">
                    {chatData.sharedMedia
                      .filter((media) => media.type === "file" || media.type === "link")
                      .map((media) => (
                        <div
                          key={media.id}
                          className="flex items-center p-2 rounded-lg border border-primary/10 hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mr-3">
                            {media.type === "file" ? (
                              <Icons.file className="h-5 w-5 text-primary" />
                            ) : (
                              <Icons.link className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{media.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(media.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-4 space-y-6 h-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="Add a nickname"
                      value={nickName}
                      onChange={(e) => setNickName(e.target.value)}
                      className="border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Chat Color</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.id}
                          className={cn(
                            "h-8 rounded-full bg-gradient-to-r",
                            color.from,
                            color.to,
                            chatColor === color.id ? "ring-2 ring-primary ring-offset-2" : "",
                          )}
                          onClick={() => setChatColor(color.id)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="read-receipts">Read Receipts</Label>
                        <p className="text-xs text-muted-foreground">Let others know when you've read their messages</p>
                      </div>
                      <Switch id="read-receipts" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Message Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications for new messages</p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full rounded-full border-destructive/30 text-destructive">
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete Chat
                  </Button>
                  <Button variant="outline" className="w-full rounded-full border-destructive/30 text-destructive">
                    <Icons.ban className="mr-2 h-4 w-4" />
                    Block User
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

