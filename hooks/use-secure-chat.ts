"use client";

import { useState, useEffect, useCallback } from "react";
import { SecureSignalRClient, type ChatMessage } from "@/lib/signalr-client";
import {
  generateKeyPair,
  exportPublicKey,
  importPublicKey,
} from "@/lib/encryption";

interface UseChatOptions {
  userId: string;
  recipientId: string;
}

export function useSecureChat({ userId, recipientId }: UseChatOptions) {
  const [client, setClient] = useState<SecureSignalRClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let fakeMessages : ChatMessage[]  = [
    {
      id: "msg1",
      content: "Hey there! How's your day going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      senderId: "user1",
      isRead: true,
      recipientId: "currentUser",
      isEncrypted: true,
    },
    {
      id: "msg2",
      content: "Hi Zakir! It's going well, thanks for asking. Just finished a big project at work.",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      senderId: "currentUser",
      isRead: true,
      recipientId: "user1",
      isEncrypted: true,
    },
    {
      id: "msg3",
      content: "That's awesome! Congrats on finishing the project. Was it the one you were telling me about last week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      senderId: "user1",
      isRead: true,
      recipientId: "currentUser",
      isEncrypted: true,
    },
    {
      id: "msg4",
      content: "Yes, exactly! It was quite challenging but I'm happy with the results.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      senderId: "currentUser",
      isRead: true,
      recipientId: "user1",
      isEncrypted: true,
    },
    {
      id: "msg5",
      content: "Do you want to grab coffee this weekend to celebrate?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      senderId: "user1",
      isRead: true,
      recipientId: "currentUser",
      isEncrypted: true,
    },
    {
      id: "msg6",
      content: "That sounds great! How about Saturday morning at that new café downtown?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      senderId: "currentUser",
      isRead: true,
      recipientId: "user1",
      isEncrypted: true,
      reactions: { "🎉": ["user1", "currentUser"] },
    },
    {
      id: "msg7",
      content: "Perfect! Let's meet at 10am. I've heard they have amazing pastries too.",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      senderId: "user1",
      isRead: true,
      recipientId: "currentUser",
      isEncrypted: true,
    },
    {
      id: "msg8",
      content: "Looking forward to it! 😊",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      senderId: "currentUser",
      isRead: true,
      recipientId: "user1",
      isEncrypted: true,
    },
  ];

  
  const [messages, setMessages] = useState<ChatMessage[]>(fakeMessages);

  // Initialize the chat client
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);

        // Create a new SignalR client
        const newClient = new SecureSignalRClient(userId);

        // Generate encryption keys
        const keyPair = await generateKeyPair();
        newClient.setPrivateKey(keyPair.privateKey);

        // Export public key to share with others
        const publicKeyString = await exportPublicKey(keyPair.publicKey);

        // Connect to the SignalR hub
        await newClient.connect();

        // Share public key with the hub
        // In a real app, you would store and share keys more securely
        // This is a simplified example
        await newClient.sendMessage(
          "system",
          JSON.stringify({
            type: "publicKey",
            userId,
            publicKey: publicKeyString,
          })
        );

        // Set up message handler
        newClient.onMessage((message) => {
          if (message.senderId === recipientId || message.senderId === userId) {
            setMessages((prev) => [...prev, message]);
          } else if (message.senderId === "system" && message.content) {
            try {
              const data = JSON.parse(message.content);
              if (data.type === "publicKey" && data.userId === recipientId) {
                // Import recipient's public key
                importPublicKey(data.publicKey).then((publicKey) => {
                  newClient.addUserPublicKey(recipientId, publicKey);
                });
              }
            } catch (e) {
              // Not a JSON message or not a public key message
            }
          }
        });

        // Set up message update handler
        newClient.onMessageUpdate((update) => {
          if (update.type === "edit") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === update.messageId
                  ? { ...msg, content: update.data.newContent, isEdited: true }
                  : msg
              )
            );
          } else if (update.type === "delete") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === update.messageId
                  ? { ...msg, deletedFor: update.data.deleteFor }
                  : msg
              )
            );
          } else if (update.type === "reaction") {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === update.messageId) {
                  const reactions = { ...msg.reactions } || {};
                  const emoji = update.data.emoji;
                  const userId = update.data.userId;

                  if (update.data.action === "add") {
                    if (!reactions[emoji]) {
                      reactions[emoji] = [];
                    }
                    if (!reactions[emoji].includes(userId)) {
                      reactions[emoji] = [...reactions[emoji], userId];
                    }
                  } else {
                    if (reactions[emoji]) {
                      reactions[emoji] = reactions[emoji].filter(
                        (id) => id !== userId
                      );
                      if (reactions[emoji].length === 0) {
                        delete reactions[emoji];
                      }
                    }
                  }

                  return { ...msg, reactions };
                }
                return msg;
              })
            );
          }
        });

        setClient(newClient);
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to connect to chat server. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    // Clean up on unmount
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [userId, recipientId]);

  // Send a message
  const sendMessage = useCallback(
    async (
      content: string,
      options?: {
        replyToId?: string;
        replyToContent?: string;
        type?: "text" | "sticker";
        stickerUrl?: string;
      }
    ) => {
      if (!client || !isConnected) {
        setError("Not connected to chat server");
        return false;
      }

      try {
        const messageId = await client.sendMessage(
          recipientId,
          content,
          options
        );
        return messageId;
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");
        return false;
      }
    },
    [client, isConnected, recipientId]
  );

  // Edit a message
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!client || !isConnected) {
        setError("Not connected to chat server");
        return false;
      }

      try {
        await client.editMessage(messageId, newContent);
        return true;
      } catch (err) {
        console.error("Failed to edit message:", err);
        setError("Failed to edit message. Please try again.");
        return false;
      }
    },
    [client, isConnected]
  );

  // Delete a message
  const deleteMessage = useCallback(
    async (messageId: string, deleteFor: "self" | "everyone") => {
      if (!client || !isConnected) {
        setError("Not connected to chat server");
        return false;
      }

      try {
        await client.deleteMessage(messageId, deleteFor);
        return true;
      } catch (err) {
        console.error("Failed to delete message:", err);
        setError("Failed to delete message. Please try again.");
        return false;
      }
    },
    [client, isConnected]
  );

  // React to a message
  const reactToMessage = useCallback(
    async (messageId: string, emoji: string, action: "add" | "remove") => {
      if (!client || !isConnected) {
        setError("Not connected to chat server");
        return false;
      }

      try {
        await client.reactToMessage(messageId, emoji, action);
        return true;
      } catch (err) {
        console.error("Failed to react to message:", err);
        setError("Failed to react to message. Please try again.");
        return false;
      }
    },
    [client, isConnected]
  );

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    isConnected,
    isLoading,
    error,
  };
}
