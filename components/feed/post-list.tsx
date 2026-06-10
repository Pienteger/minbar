"use client";

import type React from "react";

import {useState} from "react";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {CommentSection} from "./comment-section"
import type {CommentData} from "./comment-item"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Icons} from "@/components/icons";
import {formatDistanceToNow} from "@/lib/date-utils";
import {motion} from "framer-motion";
import Link from "next/link";
import {MosqueMembershipBadge} from "@/components/mosque/mosque-membership-badge";
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {MosqueCardItemQueryResult} from "@/graphql/models/mosques/MosqueCardItemQueryResult";
import ReactMarkdown from "react-markdown";
import {SocialPostType} from "@/types/display-image-type";
import {PhotoGallery} from "./photo-gallery";
import {feedApi} from "@/lib/apis/feed-api";

const GET_SOCIAL_POSTS_QUERY = gql`
    query SocialPosts(
        $first: Int
        $after: String
    )  {
        socialPosts(first: $first, after: $after) {
            nodes {
                content
                postVisibility
                originalPostId
                modifiedAt
                postType
                id
                images
                createdAt
                applicationUser {
                    displayImages(types: PROFILE) {
                        imageUrl
                    }
                    name
                    id
                    userName
                }
                likeCount
                commentCount
                shareCount
                socialPostComments(first: 2) {
                    nodes {
                        id
                        content
                        author {
                            id
                            displayImages(types: PROFILE) {
                                displayImageType
                                imageUrl
                            }
                            name
                        }
                        createdAt
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

const GET_MORE_COMMENTS_QUERY = gql`
    query MoreComments($postId: String!, $after: String) {
        socialPost(id: $postId) {
            comments(first: 5, after: $after) {
                nodes {
                    id
                    content
                    createdAt
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

const useLoadMoreComments = (postId: string, existingComments: CommentData[], endCursor: string | null) => {
    const [comments, setComments] = useState(existingComments);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState(endCursor);

    const [fetchMoreComments, { loading }] = useLazyQuery(GET_MORE_COMMENTS_QUERY);

    const loadMore = async () => {
        if (!hasMore || !postId) return;

        const { data } = await fetchMoreComments({
            variables: {
                postId,
                after: cursor,
            },
        });

        const newComments = data?.socialPost?.comments?.nodes ?? [];
        const pageInfo = data?.socialPost?.comments?.pageInfo;

        setComments((prev) => [...prev, ...newComments]);
        setCursor(pageInfo?.endCursor ?? null);
        setHasMore(pageInfo?.hasNextPage ?? false);
    };

    return {
        comments,
        loadMore,
        loading,
        hasMore,
    };
};


interface PostNode {
    content: string;
    postType: SocialPostType;
    postVisibility: string;
    originalPostId: string | null;
    modifiedAt: string;
    id: string;
    images: string[]; // assuming it's an array of image URLs or IDs
    createdAt: string;
    applicationUser: {
        displayImages: {
            imageUrl: string;
        }[];
        name: string;
        userName: string;
        id: string;
    };
    likeCount: number;
    commentCount: number;
    shareCount: number;
    socialPostComments: {
        nodes: CommentData[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
    };
}


export function PostList() {
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
        "2": true,
    });
    const [galleryOpen, setGalleryOpen] = useState(false)
    const [activePostIndex, setActivePostIndex] = useState(0)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

    const pageSize = 10;

    const {loading, error, data, fetchMore} = useQuery(GET_SOCIAL_POSTS_QUERY, {
        variables: {first: pageSize},
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-first", // cache-first is the default
    });

    const posts = (data?.socialPosts?.nodes as PostNode[]) || [];
    const postPaginationInfo = data?.socialPosts?.pageInfo;

    const loadMorePosts = async () => {
        if (!postPaginationInfo?.hasNextPage) return;

        await fetchMore({
            variables: {
                after: postPaginationInfo.endCursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;

                return {
                    socialPosts: {
                        ...fetchMoreResult.socialPosts,
                        nodes: [
                            ...prev.socialPosts.nodes,
                            ...fetchMoreResult.socialPosts.nodes,
                        ],
                    },
                };
            },
        });
    };


    const handleLike = async (postId: string) => {
        setLikedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
        await feedApi.likeASocialPost(postId);
    };

    const openGallery = (postIndex: number, imageIndex = 0) => {
        setActivePostIndex(postIndex)
        setActiveImageIndex(imageIndex)
        setGalleryOpen(true)
    }

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }))
    }

    return (
        <div className="space-y-4">
            {posts.map((post, postIndex) => (

                <Card key={post.id} className="overflow-hidden border-primary/20">
                    <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                                <Avatar>
                                    <AvatarImage src={post.applicationUser.displayImages[0]?.imageUrl}
                                                 alt={post.applicationUser.name}/>
                                    <AvatarFallback>{post.applicationUser.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center">
                                        <Link
                                            href={`/profile/${post.applicationUser.userName}`}
                                            className="font-medium hover:underline"
                                        >
                                            {post.applicationUser.name}
                                        </Link>
                                        <span className="text-muted-foreground text-sm ml-1.5">

                                            {
                                                post.postType === SocialPostType.ActiveProfilePicture ?
                                                    "Updated his profile picture" : post.postType === SocialPostType.ActiveCoverPhoto ? "Updated his cover photo" : ""
                                            }
                    </span>
                                    </div>

                                    {/* Mosque membership badge */}
                                    {/*{post.user.mosqueMembership && (*/}
                                    {/*  <div className="mt-1">*/}
                                    {/*    <MosqueMembershipBadge*/}
                                    {/*      mosqueName={post.user.mosqueMembership.name}*/}
                                    {/*      membershipType={post.user.mosqueMembership.type}*/}
                                    {/*      role={post.user.mosqueMembership.role}*/}
                                    {/*      size="sm"*/}
                                    {/*    />*/}
                                    {/*  </div>*/}
                                    {/*)}*/}

                                    <div className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(post.createdAt))}
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
                                        <Icons.ellipsis className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="rounded-xl border-primary/20"
                                >
                                    <DropdownMenuItem>
                                        <Icons.bookmark className="mr-2 h-4 w-4"/>
                                        Save Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Icons.flag className="mr-2 h-4 w-4"/>
                                        Report
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Icons.eyeOff className="mr-2 h-4 w-4"/>
                                        Hide
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ReactMarkdown
                            components={{
                                u: ({node, ...props}) => <u {...props} />,
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                        {post.images && post.images.length > 0 && (
                            <div
                                className={`mt-3 grid gap-2 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                {post.images.slice(0, 4).map((image, imageIndex) => (
                                    <div
                                        key={imageIndex}
                                        className="relative rounded-xl overflow-hidden aspect-video bg-muted cursor-pointer"
                                        onClick={() => openGallery(postIndex, imageIndex)}
                                    >
                                        <Image
                                            src={image || "/placeholder.svg"}
                                            alt={`Post image ${imageIndex + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {post.images.length > 4 && imageIndex === 3 && (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-medium">
                                                +{post.images.length - 4} more
                                            </div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-col space-y-4">
                        <div className="flex justify-between w-full">
                            <div className="flex space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleLike(post.id)}
                                >
                                    {likedPosts[post.id] ? (
                                        <motion.div
                                            initial={{scale: 0.8, opacity: 0}}
                                            animate={{scale: [1.2, 1], opacity: 1}}
                                            transition={{duration: 0.4, ease: "easeOut"}}
                                        >
                                            <Icons.FilledHeart className="mr-1.5 h-4 w-4 text-red-500"/>
                                        </motion.div>
                                    ) : (
                                        <Icons.heart className="mr-1.5 h-4 w-4"/>
                                    )}
                                    {post.likeCount + (likedPosts[post.id] ? 1 : 0)}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
                                    onClick={() => toggleComments(post.id)}
                                >
                                    <Icons.messageCircle className="mr-1.5 h-4 w-4"/>
                                    {post.commentCount}
                                </Button>
                                <Button variant="ghost" size="sm"
                                        className="h-9 px-2.5 text-muted-foreground hover:text-foreground">
                                    <Icons.repeat className="mr-1.5 h-4 w-4"/>
                                    {post.shareCount}
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm"
                                    className="h-9 px-2.5 text-muted-foreground hover:text-foreground">
                                <Icons.share className="mr-1.5 h-4 w-4"/>
                                Share
                            </Button>
                        </div>

                        {/* Comments Section */}
                        {expandedComments[post.id] && (
                            <div className="w-full border-t border-primary/10 pt-4">
                                <CommentSection postId={post.id} initialComments={post.socialPostComments.nodes as CommentData[]}/>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            ))}

            {/* Photo Gallery */}
            {galleryOpen && posts[activePostIndex]?.images && (
                <PhotoGallery
                    images={posts[activePostIndex].images}
                    initialIndex={activeImageIndex}
                    isOpen={galleryOpen}
                    onClose={() => setGalleryOpen(false)}
                />
            )}
        </div>
    );
}
