"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { formatDistanceToNow } from "@/lib/date-utils"
import { motion } from "framer-motion"

// Mock data for posts
const posts = [
  {
    id: "1",
    user: {
      name: "Ahmadullah",
      username: "@ahmadullah",
      avatar: "/ahmadullah.jpg?height=40&width=40",
    },
    content:
      "গ্রামীণ বাজারে দা-বঁটি বানিয়ে বিক্রি করে মাসে ৪০/৫০ হাজার টাকা উপার্জন করার পরিকল্পনা শুরুতে আমাদের কাছে স্বপ্নের মতো লেগেছিল।\nকিন্তু সেই অবিশ্বাস্য কাজটিই বাস্তব করে দেখাচ্ছেন জামালপুর সদরের ছোনটিয়া গ্রামের হুমায়ুন।\nকামার পেশায় দীর্ঘ ২০ বছরের অভিজ্ঞতা হুমায়ুনের মূল শক্তি। ২০ বছর যাবৎ তিনি অন্যের কারখানায় লোহার জিনিসপত্র তৈরির কাজ করেছেন। সেই সময় থেকেই তিনি স্বপ্ন দেখতেন, নিজের মতো করে একটি প্রতিষ্ঠান দাঁড় করাবেন, যেখানে তার অধীনে আরো অনেক কর্মচারী কাজ করবে।",
    image: "/post1.jpg?height=400&width=600",
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    user: {
      name: "Alex Johnson",
      username: "alex_johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Working on a new project that I'm really excited about! Can't wait to share more details soon. Stay tuned!",
    image: null,
    likes: 24,
    comments: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    user: {
      name: "Sarah Parker",
      username: "sarah_parker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just tried that new restaurant downtown. The food was amazing! Definitely recommend checking it out if you're in the area. #FoodieLife",
    image: "/placeholder.svg?height=400&width=600",
    likes: 56,
    comments: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
]

export function PostList() {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  )
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [comment, setComment] = useState("")

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      // In a real app, this would submit the comment to the server
      setComment("")
    }
  }

  return (
    <Card className="overflow-hidden rounded-xl border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 max-w-3xl mx-auto">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.user.name}</div>
              <div className="text-xs text-muted-foreground">{formatDistanceToNow(post.createdAt)}</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icons.ellipsis className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-primary/20">
              <DropdownMenuItem>
                <Icons.bookmark className="mr-2 h-4 w-4" />
                Save post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.user className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Icons.trash className="mr-2 h-4 w-4" />
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-3 relative rounded-lg overflow-hidden">
            <div className="aspect-[4/3] relative">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Post image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex items-center justify-between w-full text-muted-foreground text-sm">
          <div>{likeCount} likes</div>
          <div>{post.comments} comments</div>
        </div>
        <div className="flex justify-between w-full border-y my-3 py-1">
          <Button variant="ghost" size="sm" className={`flex-1 ${liked ? "text-primary" : ""}`} onClick={handleLike}>
            {liked ? (
              <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.3 }}>
                <Icons.heart className="mr-2 h-4 w-4 fill-primary text-primary" />
              </motion.div>
            ) : (
              <Icons.heart className="mr-2 h-4 w-4" />
            )}
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Icons.chat className="mr-2 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Icons.send className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        <form onSubmit={handleComment} className="flex w-full space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 rounded-full border-primary/20"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!comment.trim()}
              className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <Icons.send className="h-4 w-4" />
              <span className="sr-only">Send comment</span>
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}

