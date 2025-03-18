import type { ChatMessage } from "@/lib/signalr-client";

export interface MosqueChatRoom {
  id: string;
  mosqueId: string;
  name: string;
  description?: string;
  type: MosqueChatRoomType;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: ChatMessage;
  unreadCount: number;
  participantCount: number;
  image?: string;
}

export type MosqueChatRoomType =
  | "general" // General mosque chat for all members
  | "announcements" // Announcements channel (read-only for regular members)
  | "committee" // Committee members only
  | "scholars" // Scholars and imams only
  | "volunteers" // Volunteers coordination
  | "events" // Event-specific discussions
  | "private"; // Private chat rooms

export interface MosqueChatParticipant {
  userId: string;
  mosqueId: string;
  chatRoomId: string;
  role: MosqueChatRole;
  joinedAt: Date;
  lastReadMessageId?: string;
}

export type MosqueChatRole =
  | "admin" // Can manage the chat room
  | "moderator" // Can moderate messages
  | "member" // Regular member
  | "readonly"; // Can only read messages
