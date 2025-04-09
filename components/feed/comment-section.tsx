"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Icons} from "@/components/icons"
import {CommentForm} from "./comment-form"
import {CommentItem, type CommentData} from "./comment-item"
import {useAuth} from "@/contexts/auth-context"

interface CommentSectionProps {
    postId: string
    initialComments?: CommentData[]
}

export function CommentSection({postId, initialComments = []}: CommentSectionProps) {
    const [comments, setComments] = useState<CommentData[]>(initialComments)
    const [visibleComments, setVisibleComments] = useState<number>(3)
    const [isLoading, setIsLoading] = useState(false)
    const {user} = useAuth()
    const currentUserId = user?.id?.toString() || "currentUser"
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

    const handleAddComment = async (content: string) => {
        // In a real app, this would be an API call
        const newComment: CommentData = {
            id: `comment-${Date.now()}`,
            content,
            author: {
                id: currentUserId,
                name: user?.name || "Current User",
                username: user?.name?.toLowerCase().replace(/\s+/g, "") || "currentuser",
                avatar: user?.profilePictureUrl || "/placeholder.svg?height=40&width=40",
            },
            timestamp: new Date(),
            likes: 0,
            isLiked: false,
            replies: [],
        }

        setComments([newComment, ...comments])
        return Promise.resolve()
    }

    const handleLikeComment = (commentId: string) => {
        const updateComment = (comment: CommentData): CommentData => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked,
                }
            }

            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(updateComment),
                }
            }

            return comment
        }

        setComments(comments.map(updateComment))
    }

    const handleReplyComment = (commentId: string, content: string) => {
        const addReply = (comment: CommentData): CommentData => {
            if (comment.id === commentId) {
                const newReply: CommentData = {
                    id: `reply-${Date.now()}`,
                    content,
                    author: {
                        id: currentUserId,
                        name: user?.name || "Current User",
                        username: user?.name?.toLowerCase().replace(/\s+/g, "") || "currentuser",
                        avatar: user?.profilePictureUrl || "/placeholder.svg?height=40&width=40",
                    },
                    timestamp: new Date(),
                    likes: 0,
                    isLiked: false,
                }

                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                }
            }

            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(addReply),
                }
            }

            return comment
        }

        setComments(comments.map(addReply))
    }

    const handleEditComment = (commentId: string, content: string) => {
        const editComment = (comment: CommentData): CommentData => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    content,
                    isEdited: true,
                }
            }

            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(editComment),
                }
            }

            return comment
        }

        setComments(comments.map(editComment))
    }

    const handleDeleteComment = (commentId: string) => {
        // For top-level comments
        const filteredComments = comments.filter((comment) => comment.id !== commentId)

        // For nested comments
        const removeNestedComment = (comment: CommentData): CommentData => {
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.filter((reply) => reply.id !== commentId).map(removeNestedComment),
                }
            }
            return comment
        }

        setComments(filteredComments.map(removeNestedComment))
    }

    const handleReportComment = (commentId: string) => {
        // In a real app, this would be an API call
        console.log(`Reported comment: ${commentId}`)
        // Show a toast or feedback to the user
    }

    const handleLoadMoreComments = async () => {
        setIsLoading(true)
        // In a real app, this would be an API call to fetch more comments
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setVisibleComments((prev) => prev + 5)
        setIsLoading(false)
    }

    const totalComments = comments.length
    const hasMoreComments = visibleComments < totalComments

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }))
    }
    return (
        <div className="space-y-4">
            <CommentForm onSubmit={handleAddComment}/>

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.slice(0, visibleComments).map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            onLike={handleLikeComment}
                            onReply={handleReplyComment}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                            onReport={handleReportComment}
                        />
                    ))}

                    {hasMoreComments && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLoadMoreComments}
                                disabled={isLoading}
                                className="rounded-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Icons.chevronsDown className="mr-2 h-4 w-4"/>
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
    )
}
