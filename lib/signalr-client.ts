import * as signalR from "@microsoft/signalr";
import { encryptMessage, decryptMessage } from "./encryption";

// Define message types
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isEncrypted: boolean;
  replyToId?: string;
  replyToContent?: string;
  isEdited?: boolean;
  deletedFor?: "self" | "everyone" | null;
  type?: "text" | "sticker";
  stickerUrl?: string;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  mosqueId?: string; // For mosque chat messages
  chatRoomId?: string; // For mosque chat rooms
  isRead?: boolean;
}

export interface MessageReaction {
  messageId: string;
  emoji: string;
  userId: string;
  action: "add" | "remove";
}

export interface MessageEdit {
  messageId: string;
  newContent: string;
}

export interface MessageDelete {
  messageId: string;
  deleteFor: "self" | "everyone";
}

export interface UserConnection {
  userId: string;
  connectionId: string;
  publicKey: string;
}

// SignalR chat client with end-to-end encryption
export class SecureSignalRClient {
  private connection: signalR.HubConnection;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private messageUpdateHandlers: ((update: {
    type: "edit" | "delete" | "reaction";
    messageId: string;
    data: any;
  }) => void)[] = [];
  private userConnectedHandlers: ((user: UserConnection) => void)[] = [];
  private userDisconnectedHandlers: ((userId: string) => void)[] = [];
  private mosqueChatHandlers: ((message: ChatMessage) => void)[] = [];
  private myUserId: string;
  private myPrivateKey: CryptoKey | null = null;
  private userPublicKeys: Map<string, CryptoKey> = new Map();

  constructor(userId: string) {
    this.myUserId = userId;

    // Create SignalR connection
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("wss://minber.com/realtime/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up message handler
    this.connection.on("ReceiveMessage", async (message: ChatMessage) => {
      if (message.isEncrypted && this.myPrivateKey) {
        try {
          // Decrypt the message content
          message.content = await decryptMessage(
            message.content,
            this.myPrivateKey
          );

          // Decrypt reply content if present
          if (message.replyToContent && message.isEncrypted) {
            message.replyToContent = await decryptMessage(
              message.replyToContent,
              this.myPrivateKey
            );
          }
        } catch (error) {
          console.error("Failed to decrypt message:", error);
          message.content = "[Encrypted message - cannot decrypt]";
        }
      }

      // Notify all handlers
      this.messageHandlers.forEach((handler) => handler(message));
    });

    // Set up mosque chat message handler
    this.connection.on("ReceiveMosqueMessage", async (message: ChatMessage) => {
      // Mosque messages are not end-to-end encrypted, but may use server-side encryption
      this.mosqueChatHandlers.forEach((handler) => handler(message));
    });

    // Set up message update handlers
    this.connection.on("MessageEdited", (update: MessageEdit) => {
      this.messageUpdateHandlers.forEach((handler) =>
        handler({ type: "edit", messageId: update.messageId, data: update })
      );
    });

    this.connection.on("MessageDeleted", (update: MessageDelete) => {
      this.messageUpdateHandlers.forEach((handler) =>
        handler({ type: "delete", messageId: update.messageId, data: update })
      );
    });

    this.connection.on("MessageReaction", (update: MessageReaction) => {
      this.messageUpdateHandlers.forEach((handler) =>
        handler({ type: "reaction", messageId: update.messageId, data: update })
      );
    });

    // Set up user connected handler
    this.connection.on("UserConnected", (user: UserConnection) => {
      this.userConnectedHandlers.forEach((handler) => handler(user));
    });

    // Set up user disconnected handler
    this.connection.on("UserDisconnected", (userId: string) => {
      this.userDisconnectedHandlers.forEach((handler) => handler(userId));
    });
  }

  // Connect to the SignalR hub
  async connect(): Promise<void> {
    try {
      // await this.connection.start();
      // Fake connection

      console.log("Connected to SignalR hub");

      // Register user with the hub
      // await this.connection.invoke("Register", this.myUserId);
    } catch (error) {
      console.error("Failed to connect to SignalR hub:", error);
      throw error;
    }
  }

  // Disconnect from the SignalR hub
  async disconnect(): Promise<void> {
    try {
      // await this.connection.stop();
      console.log("Disconnected from SignalR hub");
    } catch (error) {
      console.error("Failed to disconnect from SignalR hub:", error);
    }
  }

  // Set the private key for decryption
  setPrivateKey(privateKey: CryptoKey): void {
    this.myPrivateKey = privateKey;
  }

  // Add a public key for a user
  addUserPublicKey(userId: string, publicKey: CryptoKey): void {
    this.userPublicKeys.set(userId, publicKey);
  }

  // Send a message to another user
  async sendMessage(
    recipientId: string,
    content: string,
    options: {
      replyToId?: string;
      replyToContent?: string;
      type?: "text" | "sticker";
      stickerUrl?: string;
    } = {}
  ): Promise<string> {
    try {
      let encryptedContent = content;
      let encryptedReplyContent = options.replyToContent;
      let isEncrypted = false;

      // Encrypt the message if we have the recipient's public key
      const recipientPublicKey = this.userPublicKeys.get(recipientId);
      if (recipientPublicKey) {
        encryptedContent = await encryptMessage(content, recipientPublicKey);

        // Encrypt reply content if present
        if (options.replyToContent) {
          encryptedReplyContent = await encryptMessage(
            options.replyToContent,
            recipientPublicKey
          );
        }

        isEncrypted = true;
      }

      const messageId = generateId();

      const message: ChatMessage = {
        id: messageId,
        senderId: this.myUserId,
        recipientId,
        content: encryptedContent,
        timestamp: new Date(),
        isEncrypted,
        replyToId: options.replyToId,
        replyToContent: encryptedReplyContent,
        type: options.type || "text",
        stickerUrl: options.stickerUrl,
        reactions: {},
      };

      // await this.connection.invoke("SendMessage", message);
      return messageId;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  // Send a message to a mosque chat room
  async sendMosqueMessage(
    mosqueId: string,
    chatRoomId: string,
    content: string,
    options: {
      replyToId?: string;
      replyToContent?: string;
      type?: "text" | "sticker";
      stickerUrl?: string;
    } = {}
  ): Promise<string> {
    try {
      const messageId = generateId();

      const message: ChatMessage = {
        id: messageId,
        senderId: this.myUserId,
        recipientId: "mosque", // Special recipient ID for mosque chats
        content,
        timestamp: new Date(),
        isEncrypted: false, // Mosque chats are not end-to-end encrypted
        replyToId: options.replyToId,
        replyToContent: options.replyToContent,
        type: options.type || "text",
        stickerUrl: options.stickerUrl,
        reactions: {},
        mosqueId,
        chatRoomId,
      };

      //await this.connection.invoke("SendMosqueMessage", message);
      return messageId;
    } catch (error) {
      console.error("Failed to send mosque message:", error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    try {
      let encryptedContent = newContent;

      // Get the original message recipient
      // In a real app, you would need to retrieve the original message
      // For now, we'll assume we know the recipientId
      const recipientId = "user1"; // This should be dynamically determined

      // Encrypt the new content if we have the recipient's public key
      const recipientPublicKey = this.userPublicKeys.get(recipientId);
      if (recipientPublicKey) {
        encryptedContent = await encryptMessage(newContent, recipientPublicKey);
      }

      const edit: MessageEdit = {
        messageId,
        newContent: encryptedContent,
      };

      //await this.connection.invoke("EditMessage", edit);
    } catch (error) {
      console.error("Failed to edit message:", error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(
    messageId: string,
    deleteFor: "self" | "everyone"
  ): Promise<void> {
    try {
      const deleteRequest: MessageDelete = {
        messageId,
        deleteFor,
      };

      //await this.connection.invoke("DeleteMessage", deleteRequest);
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }

  // Add or remove a reaction to a message
  async reactToMessage(
    messageId: string,
    emoji: string,
    action: "add" | "remove"
  ): Promise<void> {
    try {
      const reaction: MessageReaction = {
        messageId,
        emoji,
        userId: this.myUserId,
        action,
      };

      //await this.connection.invoke("ReactToMessage", reaction);
    } catch (error) {
      console.error("Failed to react to message:", error);
      throw error;
    }
  }

  // Join a mosque chat room
  async joinMosqueChatRoom(
    mosqueId: string,
    chatRoomId: string
  ): Promise<void> {
    try {
      //await this.connection.invoke("JoinMosqueChatRoom", mosqueId, chatRoomId);
    } catch (error) {
      console.error("Failed to join mosque chat room:", error);
      throw error;
    }
  }

  // Leave a mosque chat room
  async leaveMosqueChatRoom(
    mosqueId: string,
    chatRoomId: string
  ): Promise<void> {
    try {
      //await this.connection.invoke("LeaveMosqueChatRoom", mosqueId, chatRoomId);
    } catch (error) {
      console.error("Failed to leave mosque chat room:", error);
      throw error;
    }
  }

  // Register a handler for incoming messages
  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  // Register a handler for mosque chat messages
  onMosqueMessage(handler: (message: ChatMessage) => void): void {
    this.mosqueChatHandlers.push(handler);
  }

  // Register a handler for message updates (edits, deletes, reactions)
  onMessageUpdate(
    handler: (update: {
      type: "edit" | "delete" | "reaction";
      messageId: string;
      data: any;
    }) => void
  ): void {
    this.messageUpdateHandlers.push(handler);
  }

  // Register a handler for user connections
  onUserConnected(handler: (user: UserConnection) => void): void {
    this.userConnectedHandlers.push(handler);
  }

  // Register a handler for user disconnections
  onUserDisconnected(handler: (userId: string) => void): void {
    this.userDisconnectedHandlers.push(handler);
  }
}

// Helper function to generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
