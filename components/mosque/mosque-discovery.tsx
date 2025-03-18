"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { MosqueCard } from "@/components/mosque/mosque-card";
import type { Mosque, MembershipType } from "@/types/mosque";

// Mock data for mosques
const mockMosques: Mosque[] = [
  {
    id: "1",
    name: "Banani Central Jame Masjid",
    address: "Plot 24-26, Block D Road No. 17, Dhaka 1213",
    city: "Dhaka",
    country: "BD",
    description:
      "A vibrant community mosque serving the Muslim community in downtown Dhaka with daily prayers, educational programs, and community events.",
    profileImage: "/banani-central.webp?height=100&width=100",
    coverImage: "/banani-central.webp?height=200&width=400",
    memberCount: 1250,
    website: "https://bananicentraljamemasjid.com/",
    verificationRequired: true,
    createdAt: new Date("2020-01-15"),
    updatedAt: new Date("2023-05-20"),
  },
  {
    id: "2",
    name: "Gulshan Central Masjid",
    address: "3 Rd 36, Dhaka 1212",
    city: "Dhaka",
    country: "BD",
    description:
      "One of the oldest Islamic centers in Gulshan, providing a place of worship, education, and community gathering for Muslims in the greater Boston area.",
    profileImage: "/gulshan-mosque.jpg?height=100&width=100",
    coverImage: "/gulshan-mosque.jpg?height=200&width=400",
    website: "https://gcmisbd.org/",
    memberCount: 980,
    verificationRequired: true,
    createdAt: new Date("2018-03-10"),
    updatedAt: new Date("2023-04-15"),
  },
  {
    id: "3",
    name: "Mirpur DOHS Central Masjid",
    address: "413 Road No. 7, Dhaka 1230",
    city: "Dhaka",
    country: "BD",
    description:
      "A community-focused mosque providing spiritual guidance, educational programs, and social services to Muslims in Mirpur DOHS.",
    profileImage: "/mirpur-dohs-mosque.webp?height=100&width=100",
    coverImage: "/mirpur-dohs-mosque.webp?height=200&width=400",
    memberCount: 750,
    verificationRequired: false,
    createdAt: new Date("2019-07-22"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "4",
    name: "Sobhanbagh Masjid & Madrasah Complex",
    address: "R/A Mirpur Rd, Dhaka 1209",
    city: "Dhaka",
    country: "BD",
    description:
      "A diverse mosque serving the Muslim community in Sobhanbagh with daily prayers, Quran classes, and community outreach programs.",
    profileImage: "/sobhanbag-mosque.jpg?height=100&width=100&text=Al-Taqwa",
    coverImage: "/sobhanbag-mosque.jpg?height=200&width=400&text=Masjid+Al-Taqwa",
    website: "www.example.org",
    memberCount: 1100,
    verificationRequired: true,
    createdAt: new Date("2017-11-05"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "5",
    name: "Baitul Mukarram National Mosque",
    address: "Baitul Mukarram, Dhaka 1000",
    city: "Dhaka",
    country: "BD",
    description:
      "A welcoming mosque providing spiritual, educational, and social services to the Muslim community in Seattle and surrounding areas.",
    profileImage: "https://beautifulbangladesh.gov.bd/storage/backend/images/upload/slide/baitul-muk-slide_1-2020-07-15-5f0e7840b0ac0.jpg",
    coverImage:
      "https://beautifulbangladesh.gov.bd/storage/backend/images/upload/slide/baitul-muk-slide_1-2020-07-15-5f0e7840b0ac0.jpg",
    memberCount: 820,
    verificationRequired: false,
    createdAt: new Date("2019-02-18"),
    updatedAt: new Date("2023-03-25"),
  },
  {
    id: "6",
    name: "Ayasofya-i Kebir Cami-i Şerifi",
    address: "Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Türkiye",
    city: "Istanbul",
    country: "Turkey",
    description:
      "Iconic, storied mosque set within a vast, domed former Byzantine church with stained-glass windows.",
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg",
    website: "www.alrahmanhouston.org",
    memberCount: 930,
    verificationRequired: true,
    createdAt: new Date("2018-09-30"),
    updatedAt: new Date("2023-01-15"),
  },
];

// Mock data for user's mosque memberships
const mockMemberships = {
  "1": { type: "home" as MembershipType, status: "active" as const },
  "3": { type: "office" as MembershipType, status: "pending" as const },
  "5": { type: "roaming" as MembershipType, status: "break" as const },
};

interface MosqueDiscoveryProps {
  onJoinMosque?: (mosqueId: string, membershipType: MembershipType) => void;
}

export function MosqueDiscovery({ onJoinMosque }: MosqueDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("nearby");
  const [filteredMosques, setFilteredMosques] = useState<Mosque[]>(mockMosques);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call with delay
    const timer = setTimeout(() => {
      if (searchQuery) {
        const filtered = mockMosques.filter(
          (mosque) =>
            mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mosque.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mosque.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMosques(filtered);
      } else {
        // Different filtering based on active tab
        if (activeTab === "nearby") {
          // In a real app, this would use geolocation
          setFilteredMosques(mockMosques);
        } else if (activeTab === "popular") {
          // Sort by member count
          setFilteredMosques(
            [...mockMosques].sort((a, b) => b.memberCount - a.memberCount)
          );
        } else if (activeTab === "joined") {
          // Filter to only show joined mosques
          setFilteredMosques(
            mockMosques.filter((mosque) => mockMemberships[mosque.id])
          );
        }
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleJoinMosque = (
    mosqueId: string,
    membershipType: MembershipType
  ) => {
    if (onJoinMosque) {
      onJoinMosque(mosqueId, membershipType);
    }

    // In a real app, this would update the UI after the API call
    console.log(`Joining mosque ${mosqueId} as ${membershipType}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Discover Mosques</h2>

        <div className="relative w-full md:w-64">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mosques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 rounded-full border-primary/20"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="nearby"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Nearby
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="joined"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            My Mosques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMosques.length === 0 ? (
            <div className="text-center py-12">
              <Icons.mapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No mosques found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or location
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMosques.map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  membership={mockMemberships[mosque.id]}
                  onJoin={handleJoinMosque}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMosques.length === 0 ? (
            <div className="text-center py-12">
              <Icons.users className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">
                No popular mosques found
              </h3>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMosques.map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  membership={mockMemberships[mosque.id]}
                  onJoin={handleJoinMosque}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMosques.length === 0 ? (
            <div className="text-center py-12">
              <Icons.home className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">
                You haven't joined any mosques yet
              </h3>
              <p className="text-muted-foreground">
                Discover and join mosques to see them here
              </p>
              <Button
                className="mt-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={() => setActiveTab("nearby")}
              >
                Discover Mosques
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMosques.map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  membership={mockMemberships[mosque.id]}
                  onJoin={handleJoinMosque}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
