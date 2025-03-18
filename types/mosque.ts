// Types for mosque-related features

export type MosqueRole =
  | "imam" // Mosque leader, can manage all aspects
  | "muezzin" // Calls to prayer, manages prayer schedules
  | "khadem" // Mosque caretaker, manages logistics
  | "khatib" // Delivers sermons and lectures
  | "scholar" // Verified scholar, can answer religious questions
  | "member"; // Regular mosque member

export type MembershipType =
  | "home" // Home mosque (requires verification)
  | "office" // Office mosque (requires verification)
  | "roaming"; // Roaming mosque (shadow membership, no strict verification)

export type MembershipStatus =
  | "active" // Active membership
  | "pending" // Pending verification
  | "break" // On break (temporarily inactive)
  | "rejected"; // Verification rejected

export type QuestionCategory =
  | "fiqh" // Islamic jurisprudence
  | "aqeedah" // Islamic creed
  | "family" // Family matters
  | "business" // Business and finance
  | "worship" // Acts of worship
  | "general"; // General questions

export type QuestionVisibility =
  | "public" // Visible to all mosque members
  | "private"; // Only visible to the scholar and asker

export type EventType =
  | "khutbah" // Friday sermon
  | "lecture" // Educational lecture
  | "iftar" // Breaking fast gathering
  | "fundraiser" // Fundraising event
  | "community" // Community gathering
  | "other"; // Other events

export type FundraisingCategory =
  | "zakat" // Obligatory charity
  | "sadaqah" // Voluntary charity
  | "renovation" // Mosque renovation
  | "community" // Community aid
  | "other"; // Other fundraising

export type BusinessCategory =
  | "food" // Food and restaurants
  | "retail" // Retail stores
  | "services" // Professional services
  | "education" // Educational services
  | "other"; // Other businesses

export interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  description: string;
  profileImage: string;
  coverImage: string;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  memberCount: number;
  verificationRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MosqueMembership {
  id: string;
  userId: string;
  mosqueId: string;
  type: MembershipType;
  status: MembershipStatus;
  role: MosqueRole;
  joinedAt: Date;
  breakStartedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface MosquePost {
  id: string;
  mosqueId: string;
  authorId: string;
  content: string;
  images?: string[];
  isPinned: boolean;
  isAnnouncement: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: number;
}

export interface ScholarQuestion {
  id: string;
  mosqueId: string;
  askerId: string;
  scholarId?: string;
  title: string;
  content: string;
  category: QuestionCategory;
  visibility: QuestionVisibility;
  status: "pending" | "assigned" | "answered" | "closed";
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScholarAnswer {
  id: string;
  questionId: string;
  scholarId: string;
  content: string;
  references?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MosqueEvent {
  id: string;
  mosqueId: string;
  organizerId: string;
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location: string;
  image?: string;
  isOnline: boolean;
  onlineLink?: string;
  attendees: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundraisingCampaign {
  id: string;
  mosqueId: string;
  title: string;
  description: string;
  category: FundraisingCategory;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessListing {
  id: string;
  mosqueId: string;
  ownerId: string;
  name: string;
  description: string;
  category: BusinessCategory;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillOffering {
  id: string;
  mosqueId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  rate?: string; // Could be hourly rate or "Free"
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}
