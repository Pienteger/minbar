import { MosqueProfile } from "@/components/mosque/mosque-profile";
import type { Mosque } from "@/types/mosque";

// Mock data for a mosque
const mockMosque: Mosque = {
  id: "1",
  name: "Banani Central Mosque",
  address: "Plot 24-26, Block D Road No. 17, Dhaka 1213",
  city: "Dhaka",
  country: "Bangladesh",
  description:
    "A vibrant community mosque serving the Muslim community in downtown Dhaka with daily prayers, educational programs, and community events. Our mission is to provide a welcoming space for worship, learning, and community building based on Islamic principles of peace, compassion, and service.",
  profileImage: "/placeholder.svg?height=100&width=100&text=Banani+Central+Mosque",
  coverImage: "/placeholder.svg?height=300&width=800&text=Banani+Central+Mosque",
  website: "www.example.org",
  phone: "+880-123-456-7890",
  email: "info@example.org",
  socialLinks: {
    facebook: "facebook.com/example",
    twitter: "twitter.com/example",
    instagram: "instagram.com/example",
  },
  memberCount: 1250,
  verificationRequired: true,
  createdAt: new Date("2020-01-15"),
  updatedAt: new Date("2023-05-20"),
};

// Mock membership data
const mockMembership = {
  type: "home" as const,
  status: "active" as const,
  role: "member" as const,
};

export default function MosquePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the mosque data based on the ID
  return (
    <div className="py-4">
      <MosqueProfile mosque={mockMosque} membership={mockMembership} />
    </div>
  );
}
