"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { MosqueRoleBadge } from "@/components/mosque/mosque-role-badge";
import type { MosqueRole } from "@/types/mosque";
import { formatDistanceToNow } from "@/lib/date-utils";

interface MosqueFeedProps {
  mosqueId: string;
  userRole?: MosqueRole;
}

// Mock data for mosque posts
const mockPosts = [
  {
    id: "1",
    content:
      "Reminder: Friday prayer this week will start at 1:30 PM due to daylight saving time change. Please plan accordingly.",
    authorName: "Imam Abdullah",
    authorUsername: "imam_abdullah",
    authorAvatar: "/placeholder.svg?height=40&width=40&text=IA",
    authorRole: "imam" as MosqueRole,
    isPinned: true,
    isAnnouncement: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    content:
      "The monthly community dinner will be held this Saturday after Maghrib prayer. All families are welcome! Please bring a dish to share if possible.",
    authorName: "Sarah Ahmed",
    authorUsername: "sarah_ahmed",
    authorAvatar: "/placeholder.svg?height=40&width=40&text=SA",
    authorRole: "member" as MosqueRole,
    isPinned: false,
    isAnnouncement: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 42,
    comments: 12,
  },
  {
    id: "3",
    content:
      "Today's Quran class for children will focus on Surah Al-Fatiha. Parents, please ensure your children bring their Quran and notebooks.",
    authorName: "Yusuf Khan",
    authorUsername: "yusuf_khan",
    authorAvatar: "/placeholder.svg?height=40&width=40&text=YK",
    authorRole: "khatib" as MosqueRole,
    isPinned: false,
    isAnnouncement: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 18,
    comments: 3,
  },
  {
    id: "4",
    content:
      "We're looking for volunteers to help with the mosque cleaning this Sunday morning. If you can spare a few hours, please sign up at the reception desk or comment below.",
    authorName: "Ahmed Hassan",
    authorUsername: "ahmed_hassan",
    authorAvatar: "/placeholder.svg?height=40&width=40&text=AH",
    authorRole: "khadem" as MosqueRole,
    isPinned: false,
    isAnnouncement: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    likes: 31,
    comments: 8,
  },
];

export function MosqueFeed({ mosqueId, userRole }: MosqueFeedProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const canCreateAnnouncement =
    userRole === "imam" || userRole === "muezzin" || userRole === "khatib";

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        content: newPostContent,
        authorName: "Current User",
        authorUsername: "current_user",
        authorAvatar: "/placeholder.svg?height=40&width=40&text=CU",
        authorRole: userRole || "member",
        isPinned: false,
        isAnnouncement: false,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
      };

      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLikedPosts = { ...prev };
      newLikedPosts[postId] = !newLikedPosts[postId];
      return newLikedPosts;
    });

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: likedPosts[postId] ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handlePinPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isPinned: !post.isPinned,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="rounded-xl border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40&text=CU"
                alt="Current User"
              />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share something with the mosque community..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="resize-none border-primary/20 min-h-[100px]"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/20"
                  >
                    <Icons.image className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  {canCreateAnnouncement && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-primary/20"
                    >
                      <Icons.bell className="h-4 w-4 mr-2" />
                      Announcement
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isSubmitting}
                  className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts
          .sort((a, b) => {
            // Sort pinned posts first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Then sort by date
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
          .map((post) => (
            <Card
              key={post.id}
              className={`rounded-xl ${
                post.isPinned
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20"
                  : "border-primary/20"
              }`}
            >
              {post.isPinned && (
                <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-1 flex items-center text-amber-800 dark:text-amber-300 text-sm">
                  <Icons.pin className="h-4 w-4 mr-2" />
                  Pinned Post
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={post.authorAvatar}
                      alt={post.authorName}
                    />
                    <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{post.authorName}</span>
                      {post.authorRole !== "member" && (
                        <MosqueRoleBadge role={post.authorRole} size="sm" />
                      )}
                      {post.isAnnouncement && (
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        >
                          Announcement
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(post.createdAt)}
                    </div>
                    <div className="mt-3 whitespace-pre-wrap">
                      {post.content}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-primary/10 flex justify-between">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full ${
                      likedPosts[post.id] ? "text-red-500" : ""
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    {likedPosts[post.id] ? (
                      <Icons.heart className="h-4 w-4 mr-2 fill-red-500" />
                    ) : (
                      <Icons.heart className="h-4 w-4 mr-2" />
                    )}
                    {post.likes + (likedPosts[post.id] ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Icons.messageCircle className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Icons.share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {(userRole === "imam" ||
                  post.authorUsername === "current_user") && (
                  <div className="flex space-x-2">
                    {userRole === "imam" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full ${
                          post.isPinned ? "text-amber-500" : ""
                        }`}
                        onClick={() => handlePinPost(post.id)}
                      >
                        <Icons.pin className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-muted-foreground"
                    >
                      <Icons.ellipsis className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
