// --- CommentSection.tsx ---

import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { Icons } from "@/components/icons";
import {useAuth} from "@/contexts/auth-context";

const GET_MORE_COMMENTS = gql`
    query MoreComments($postId: Long!, $after: String) {
        socialPost(id: $postId) {
            comments(first: 5, after: $after) {
                nodes {
                    id
                    content
                    createdAt
                    parentCommentId
                    applicationUser {
                        id
                        name
                        userName
                        displayImages(types: PROFILE) {
                            imageUrl
                        }
                    }
                    replies(first: 5) {
                        nodes {
                            id
                            content
                            createdAt
                            parentCommentId
                            applicationUser {
                                id
                                name
                                userName
                                displayImages(types: PROFILE) {
                                    imageUrl
                                }
                            }
                        }
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

const GET_MORE_REPLIES = gql`
    query MoreReplies($commentId: Long!, $after: String) {
        socialPostComment(id: $commentId) {
            replies(first: 5, after: $after) {
                nodes {
                    id
                    content
                    createdAt
                    parentCommentId
                    applicationUser {
                        id
                        name
                        userName
                        displayImages(types: PROFILE) {
                            imageUrl
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

interface CommentSectionProps {
    postId: number;
    initialComments: any[];
    initialCursor: string | null;
    hasMoreInitial: boolean;
}

export function CommentSection({ postId, initialComments, initialCursor, hasMoreInitial }: CommentSectionProps) {
    const { user } = useAuth();
    const currentUserId = user?.id?.toString() || "currentUser";

    const [comments, setComments] = useState(initialComments || []);
    const [cursor, setCursor] = useState(initialCursor);
    const [hasMore, setHasMore] = useState(hasMoreInitial);
    const [loadingMore, setLoadingMore] = useState(false);

    const [fetchMore] = useLazyQuery(GET_MORE_COMMENTS);
    const [fetchReplies] = useLazyQuery(GET_MORE_REPLIES);

    const handleLoadMore = async () => {
        if (!hasMore) return;
        setLoadingMore(true);
        const { data } = await fetchMore({ variables: { postId, after: cursor } });
        const newComments = data?.socialPost?.comments?.nodes || [];
        const pageInfo = data?.socialPost?.comments?.pageInfo;

        setComments(prev => [...prev, ...newComments]);
        setCursor(pageInfo?.endCursor);
        setHasMore(pageInfo?.hasNextPage);
        setLoadingMore(false);
    };

    const handleLoadMoreReplies = async (commentId, replyCursor) => {
        const { data } = await fetchReplies({ variables: { commentId, after: replyCursor } });
        const newReplies = data?.socialPostComment?.replies?.nodes || [];
        const replyPageInfo = data?.socialPostComment?.replies?.pageInfo;

        const attachReplies = list =>
            list.map(c => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        replies: [...(c.replies || []), ...newReplies],
                        replyCursor: replyPageInfo.endCursor,
                        replyHasMore: replyPageInfo.hasNextPage,
                    };
                }
                return c;
            });
        setComments(attachReplies);
    };

    const optimisticLike = id => {
        const toggle = list =>
            list.map(c => {
                if (c.id === id) {
                    return { ...c, isLiked: !c.isLiked, likes: c.likes + (c.isLiked ? -1 : 1) };
                }
                if (c.replies) {
                    return { ...c, replies: toggle(c.replies) };
                }
                return c;
            });
        setComments(toggle(comments));
    };

    const optimisticReply = (parentId, content) => {
        const reply = {
            id: `reply-${Date.now()}`,
            content,
            timestamp: new Date(),
            parentCommentId: parentId,
            applicationUser: {
                id: currentUserId,
                name: user?.name || "Current User",
                userName: user?.name?.toLowerCase().replace(/\s+/g, "") || "currentuser",
                displayImages: [{ imageUrl: user?.profilePictureUrl || "/placeholder.svg" }],
            },
        };
        const attach = list =>
            list.map(c => {
                if (c.id === parentId) {
                    return { ...c, replies: [...(c.replies || []), reply] };
                }
                return c;
            });
        setComments(attach(comments));
    };

    const optimisticAdd = content => {
        const comment = {
            id: `comment-${Date.now()}`,
            content,
            timestamp: new Date(),
            parentCommentId: null,
            applicationUser: {
                id: currentUserId,
                name: user?.name || "Current User",
                userName: user?.name?.toLowerCase().replace(/\s+/g, "") || "currentuser",
                displayImages: [{ imageUrl: user?.profilePictureUrl || "/placeholder.svg" }],
            },
            replies: [],
            likes: 0,
            isLiked: false,
        };
        setComments(prev => [comment, ...prev]);
    };

    return (
        <div className="space-y-4">
            <CommentForm onSubmit={optimisticAdd} />

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map(c => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            currentUserId={currentUserId}
                            onLike={optimisticLike}
                            onReply={optimisticReply}
                            onLoadMoreReplies={handleLoadMoreReplies}
                        />
                    ))}

                    {hasMore && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="rounded-full"
                            >
                                {loadingMore ? (
                                    <>
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Icons.chevronsDown className="mr-2 h-4 w-4" />
                                        Load more comments
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 text-muted-foreground">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
}
