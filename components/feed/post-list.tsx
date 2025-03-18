"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { formatDistanceToNow } from "@/lib/date-utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { MosqueMembershipBadge } from "@/components/mosque/mosque-membership-badge";

// Mock data for posts
const posts = [
  {
    id: "1",
    user: {
      name: "Ashiqur Rahman Alif",
      username: "@aratheunseen",
      avatar: "/alif.jpg?height=40&width=40",
      mosqueMembership: {
        id: "mosque1",
        name: "Gulshan Central Mosque",
        type: "home",
        role: "member",
      },
    },
    content: "Longest Railway Bridge in Bangladesh. 🌉 #Bangladesh #JamunaBridge",
    images: ["/jamuna.jpg?height=400&width=600"],
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: 24,
    comments: 5,
    shares: 2,
    liked: false,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Arfizur Rahman",
      username: "@arfiz",
      avatar: "/arfiz.jpg?height=40&width=40",
      mosqueMembership: {
        id: "mosque2",
        name: "Banani Central Mosque",
        type: "office",
        role: "khadem",
      },
    },
    content:
      "Beautiful sunset view from my window today. Alhamdulillah for these moments of peace and reflection. 🌅 #Sunset #Alhamdulillah",
    images: [
      "https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_960_720.jpg",
      "https://cdn.pixabay.com/photo/2020/12/12/16/48/arch-5826002_1280.jpg",
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    likes: 56,
    comments: 12,
    shares: 4,
    liked: true,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Ahmed Khan",
      username: "@ahmedk",
      avatar: "/placeholder.svg?height=40&width=40",
      mosqueMembership: {
        id: "mosque3",
        name: "Mirpur DOHS Central Mosque",
        type: "roaming",
        role: "imam",
      },
    },
    content:
      "Attended an amazing lecture at the mosque today about the importance of kindness in Islam. The speaker emphasized how small acts of kindness can have a big impact. Let's all try to be a bit kinder today! #Islam #Kindness",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 89,
    comments: 15,
    shares: 10,
    liked: false,
  },
];

export function PostList() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    "2": true,
  });

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden border-primary/20">
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <Link
                      href={`/profile/${post.user.username}`}
                      className="font-medium hover:underline"
                    >
                      {post.user.name}
                    </Link>
                    <span className="text-muted-foreground text-sm ml-1.5">
                      {post.user.username}
                    </span>
                  </div>

                  {/* Mosque membership badge */}
                  {post.user.mosqueMembership && (
                    <div className="mt-1">
                      <MosqueMembershipBadge
                        mosqueName={post.user.mosqueMembership.name}
                        membershipType={post.user.mosqueMembership.type}
                        role={post.user.mosqueMembership.role}
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(post.timestamp)}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <Icons.ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border-primary/20"
                >
                  <DropdownMenuItem>
                    <Icons.bookmark className="mr-2 h-4 w-4" />
                    Save Post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.eyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="whitespace-pre-line">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div
                className={`mt-3 grid gap-2 ${
                  post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden aspect-video bg-muted"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => handleLike(post.id)}
              >
                {likedPosts[post.id] ? (
                  <Icons.heart className="mr-1.5 h-4 w-4 text-red-500" />
                ) : (
                  <Icons.heart className="mr-1.5 h-4 w-4" />
                )}
                {post.likes + (likedPosts[post.id] ? 1 : 0)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icons.messageCircle className="mr-1.5 h-4 w-4" />
                {post.comments}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icons.repeat className="mr-1.5 h-4 w-4" />
                {post.shares}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Icons.share className="mr-1.5 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
