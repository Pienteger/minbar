"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { formatTime } from "@/lib/date-utils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useSecureChat } from "@/hooks/use-secure-chat";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { MessageReactions } from "@/components/chat/message-reactions";
import { MessageActions } from "@/components/chat/message-actions";
import { StickerPicker } from "@/components/chat/sticker-picker";
import type { ChatMessage } from "@/lib/signalr-client";

// Mock data for a chat
const chatData = {
  id: "1",
  user: {
    id: "user1",
    name: "Zahid Sarmon",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
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
};

interface ChatRoomProps {
  chatId: string;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [nickName, setNickName] = useState("");
  const [chatColor, setChatColor] = useState("pink-to-orange");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = "currentUser";

  // Use the secure chat hook
  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    isConnected,
    isLoading,
    error,
  } = useSecureChat({
    userId: currentUserId,
    recipientId: chatData.user.id,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMessage) {
      // Handle editing message
      const success = await editMessage(editingMessage.id, message);
      if (success) {
        setMessage("");
        setEditingMessage(null);
      }
      return;
    }

    if (!message.trim() && !replyTo) return;

    // Send the message via SignalR with end-to-end encryption
    const options = replyTo
      ? {
          replyToId: replyTo.id,
          replyToContent: replyTo.content,
          type: "text",
        }
      : undefined;

    const success = await sendMessage(message, options);

    if (success) {
      setMessage("");
      setReplyTo(null);
    }
  };

  const handleSendSticker = async (stickerUrl: string) => {
    const options = {
      type: "sticker",
      stickerUrl,
      ...(replyTo
        ? {
            replyToId: replyTo.id,
            replyToContent: replyTo.content,
          }
        : {}),
    };

    const success = await sendMessage("", options);

    if (success) {
      setReplyTo(null);
    }
  };

  const handleReplyToMessage = (msg: ChatMessage) => {
    setReplyTo(msg);
    setEditingMessage(null);
  };

  const handleEditMessage = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setMessage(msg.content);
    setReplyTo(null);
  };

  const handleDeleteMessage = async (
    messageId: string,
    deleteFor: "self" | "everyone"
  ) => {
    await deleteMessage(messageId, deleteFor);
  };

  const handleReaction = async (
    messageId: string,
    emoji: string,
    action: "add" | "remove"
  ) => {
    await reactToMessage(messageId, emoji, action);
  };

  const colorOptions = [
    {
      id: "pink-to-orange",
      name: "Sunset",
      from: "from-pink-500",
      to: "to-orange-500",
    },
    {
      id: "blue-to-purple",
      name: "Ocean",
      from: "from-blue-500",
      to: "to-purple-500",
    },
    {
      id: "green-to-teal",
      name: "Forest",
      from: "from-green-500",
      to: "to-teal-500",
    },
    {
      id: "yellow-to-red",
      name: "Autumn",
      from: "from-yellow-500",
      to: "to-red-500",
    },
    {
      id: "indigo-to-cyan",
      name: "Sky",
      from: "from-indigo-500",
      to: "to-cyan-500",
    },
  ];

  const getGradientClasses = (colorId: string) => {
    const color = colorOptions.find((c) => c.id === colorId);
    return color ? `${color.from} ${color.to}` : "from-pink-500 to-orange-500";
  };

  // Render a message bubble
  const renderMessage = (msg: ChatMessage) => {
    if (
      msg.deletedFor === "everyone" ||
      (msg.deletedFor === "self" && msg.senderId !== currentUserId)
    ) {
      return (
        <div className="px-4 py-2 rounded-2xl bg-muted/30 italic text-muted-foreground text-sm">
          This message was deleted
        </div>
      );
    }

    if (msg.type === "sticker" && msg.stickerUrl) {
      return (
        <div className="p-1">
          <div className="relative w-32 h-32">
            <Image
              src={msg.stickerUrl || "/placeholder.svg"}
              alt="Sticker"
              fill
              className="object-contain"
            />
          </div>
        </div>
      );
    }

    const isCurrentUser = msg.senderId === currentUserId;

    return (
      <div
        className={`px-4 py-2 rounded-2xl ${
          isCurrentUser
            ? `bg-gradient-to-r ${getGradientClasses(chatColor)} text-white`
            : "bg-background/80 backdrop-blur-sm border border-primary/10"
        }`}
      >
        {/* Reply preview if this is a reply */}
        {msg.replyToId && msg.replyToContent && (
          <div
            className={`text-xs mb-1 pb-1 border-b ${
              isCurrentUser
                ? "border-white/20 text-white/70"
                : "border-primary/10 text-muted-foreground"
            }`}
          >
            <div className="flex items-center">
              <Icons.messageCircle className="h-3 w-3 mr-1" />
              <span className="font-medium">
                Replying to{" "}
                {msg.replyToId.startsWith("currentUser")
                  ? "yourself"
                  : chatData.user.name}
              </span>
            </div>
            <p className="truncate">{msg.replyToContent}</p>
          </div>
        )}

        <p>{msg.content}</p>
        <div
          className={`text-xs mt-1 flex items-center justify-between ${
            isCurrentUser ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          <div className="flex items-center">
            {formatTime(new Date(msg.timestamp))}
            {isCurrentUser && <Lock className="h-3 w-3 ml-1" />}
            {msg.isEdited && <span className="ml-1">(edited)</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)]">
      {/* Main Chat Area */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300",
          isSidebarOpen && isDesktop ? "mr-80" : ""
        )}
      >
        {/* Chat Header */}
        <Card className="border-b rounded-none lg:rounded-t-xl border-primary/10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={chatData.user.avatar}
                alt={chatData.user.name}
              />
              <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center">
                {nickName || chatData.user.name}
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-500/10 text-green-500 border-green-500/20 flex items-center"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  <span className="text-xs">End-to-End Encrypted</span>
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {chatData.user.online ? "Online" : "Offline"}
              </div>
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
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Establishing secure connection...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && isConnected && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg text-center text-sm mb-4">
              <Lock className="h-4 w-4 inline mr-1" />
              Secure connection established. Your messages are end-to-end
              encrypted.
            </div>
          )}

          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[80%] lg:max-w-[60%] group">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={chatData.user.avatar}
                        alt={chatData.user.name}
                      />
                      <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="relative">
                    {renderMessage(msg)}

                    {/* Message actions - only show on hover or for mobile */}
                    <div
                      className={`absolute ${
                        isCurrentUser
                          ? "left-0 -translate-x-full"
                          : "right-0 translate-x-full"
                      } top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2`}
                    >
                      <MessageActions
                        messageId={msg.id}
                        isSender={isCurrentUser}
                        onReply={() => handleReplyToMessage(msg)}
                        onEdit={() => handleEditMessage(msg)}
                        onDelete={(deleteFor) =>
                          handleDeleteMessage(msg.id, deleteFor)
                        }
                      />
                    </div>

                    {/* Message reactions */}
                    <div className="mt-1">
                      <MessageReactions
                        reactions={msg.reactions}
                        messageId={msg.id}
                        onReact={handleReaction}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply preview */}
        {replyTo && (
          <div className="px-4 py-2 bg-muted/20 border-t border-primary/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Icons.messageCircle className="h-4 w-4 text-primary" />
              <div>
                <span className="font-medium">
                  Replying to{" "}
                  {replyTo.senderId === currentUserId
                    ? "yourself"
                    : chatData.user.name}
                </span>
                <p className="text-muted-foreground truncate">
                  {replyTo.content}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => setReplyTo(null)}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Editing indicator */}
        {editingMessage && (
          <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Icons.edit className="h-4 w-4 text-amber-500" />
              <div>
                <span className="font-medium">Editing message</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => {
                setEditingMessage(null);
                setMessage("");
              }}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Message Input */}
        <Card className="border-t rounded-none lg:rounded-b-xl border-primary/10 p-4 bg-background/80 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <StickerPicker onStickerSelect={handleSendSticker}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Icons.smile className="h-4 w-4" />
                <span className="sr-only">Send sticker</span>
              </Button>
            </StickerPicker>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Icons.paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Input
              placeholder={
                editingMessage
                  ? "Edit your message..."
                  : isConnected
                  ? "Type a message..."
                  : "Connecting to secure chat..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full border-primary/20"
              disabled={!isConnected}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Icons.mic className="h-4 w-4" />
              <span className="sr-only">Voice message</span>
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={(!message.trim() && !replyTo) || !isConnected}
              className={`rounded-full bg-gradient-to-r ${getGradientClasses(
                chatColor
              )} hover:opacity-90`}
            >
              <Icons.send className="h-4 w-4" />
              <span className="sr-only">
                {editingMessage ? "Save changes" : "Send message"}
              </span>
            </Button>
          </form>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-primary/10 z-40 transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
          isDesktop ? "lg:relative" : ""
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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
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
                    <AvatarImage
                      src={chatData.user.avatar}
                      alt={chatData.user.name}
                    />
                    <AvatarFallback>{chatData.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {nickName || chatData.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chatData.user.online
                        ? "Active now"
                        : "Last active 2h ago"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-primary/20 mr-2"
                    >
                      <Icons.bell className="mr-2 h-4 w-4" />
                      Mute
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-primary/20"
                    >
                      <Icons.search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">About</h4>
                    <p className="text-sm text-muted-foreground">
                      Photographer, traveler, and coffee enthusiast. Always
                      looking for the next adventure!
                    </p>
                  </div>

                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center text-green-600 dark:text-green-400 font-medium mb-1">
                      <Lock className="h-4 w-4 mr-2" />
                      End-to-End Encrypted
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Messages sent to this chat are secured with end-to-end
                      encryption. Only you and {chatData.user.name} can read
                      them.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-4 h-full">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Shared Media</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {chatData.sharedMedia
                      .filter(
                        (media) =>
                          media.type === "image" || media.type === "video"
                      )
                      .map((media) => (
                        <div
                          key={media.id}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
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
                      .filter(
                        (media) =>
                          media.type === "file" || media.type === "link"
                      )
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
                            <p className="text-sm font-medium truncate">
                              {media.name}
                            </p>
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
                            chatColor === color.id
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
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
                        <Label htmlFor="encryption">
                          End-to-End Encryption
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Messages are encrypted and can only be read by you and
                          the recipient
                        </p>
                      </div>
                      <Switch id="encryption" defaultChecked disabled />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="read-receipts">Read Receipts</Label>
                        <p className="text-xs text-muted-foreground">
                          Let others know when you've read their messages
                        </p>
                      </div>
                      <Switch id="read-receipts" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">
                          Message Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications for new messages
                        </p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-destructive/30 text-destructive"
                  >
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-destructive/30 text-destructive"
                  >
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
  );
}
