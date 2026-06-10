"use client"

import {useState} from "react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Textarea} from "@/components/ui/textarea"
import {Icons} from "@/components/icons"
import {formatDistanceToNow} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import Link from "next/link"
import {CommentForm} from "./comment-form"
import {DisplayImageType} from "@/types/display-image-type";
import {humanize} from "@/lib/humanize";

export interface CommentData {
    id: string
    content: string
    author: {
        id: string
        name: string
        userName: string
        displayImages: {
            displayImageType: DisplayImageType,
            imageUrl: string
        }[]
    }
    createdAt: Date
    likes: number
    isLiked: boolean
    replies?: CommentData[]
    isEdited?: boolean
}

interface CommentItemProps {
    comment: CommentData
    currentUserId: string
    level?: number
    maxLevel?: number
    onLike: (commentId: string) => void
    onReply: (commentId: string, content: string) => void
    onEdit: (commentId: string, content: string) => void
    onDelete: (commentId: string) => void
    onReport: (commentId: string) => void
}

export function CommentItem({
                                comment,
                                currentUserId,
                                level = 0,
                                maxLevel = 3,
                                onLike,
                                onReply,
                                onEdit,
                                onDelete,
                                onReport,
                            }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [showReplies, setShowReplies] = useState(level < 1)
    const isAuthor = comment.author.id === currentUserId

    const handleReplySubmit = (content: string) => {
        onReply(comment.id, content)
        setIsReplying(false)
    }

    const handleEditSubmit = () => {
        if (editContent.trim() !== comment.content) {
            onEdit(comment.id, editContent)
        }
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditContent(comment.content)
        setIsEditing(false)
    }

    const replyCount = comment.replies?.length || 0

    return (
        <div className={cn("group", level > 0 && "ml-6 mt-2")}>
            <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.displayImages[0]?.imageUrl} alt={comment.author.name}/>
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link href={`/profile/${comment.author.id}`}
                                      className="font-medium text-sm hover:underline">
                                    {comment.author.name}
                                </Link>
                                <span
                                    className="text-xs text-muted-foreground ml-2">{humanize(comment.createdAt)}</span>
                                {comment.isEdited &&
                                    <span className="text-xs text-muted-foreground ml-1">(edited)</span>}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                        <Icons.ellipsis className="h-3.5 w-3.5"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-primary/20 w-40">
                                    {isAuthor ? (
                                        <>
                                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                                <Icons.edit className="mr-2 h-4 w-4"/>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(comment.id)}
                                                              className="text-destructive">
                                                <Icons.trash className="mr-2 h-4 w-4"/>
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem onClick={() => onReport(comment.id)}>
                                            <Icons.flag className="mr-2 h-4 w-4"/>
                                            Report
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {isEditing ? (
                            <div className="mt-2">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[60px] text-sm"
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <Button variant="outline" size="sm" onClick={handleCancelEdit}
                                            className="h-7 text-xs rounded-full">
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleEditSubmit} className="h-7 text-xs rounded-full">
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 mt-1 ml-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => onLike(comment.id)}
                        >
                            {comment.isLiked ? (
                                <Icons.heart className="mr-1 h-3.5 w-3.5 text-red-500"/>
                            ) : (
                                <Icons.heart className="mr-1 h-3.5 w-3.5"/>
                            )}
                            {comment.likes > 0 && comment.likes}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            <Icons.reply className="mr-1 h-3.5 w-3.5"/>
                            Reply
                        </Button>
                    </div>

                    {isReplying && (
                        <div className="mt-2">
                            <CommentForm
                                placeholder={`Reply to ${comment.author.name}...`}
                                onSubmit={handleReplySubmit}
                                autoFocus
                                buttonText="Reply"
                            />
                        </div>
                    )}

                    {replyCount > 0 && (
                        <div className="mt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs flex items-center text-primary"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? (
                                    <>
                                        <Icons.chevronUp className="mr-1 h-3.5 w-3.5"/>
                                        Hide {replyCount} {replyCount === 1 ? "reply" : "replies"}
                                    </>
                                ) : (
                                    <>
                                        <Icons.chevronDown className="mr-1 h-3.5 w-3.5"/>
                                        View {replyCount} {replyCount === 1 ? "reply" : "replies"}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {showReplies && comment.replies && level < maxLevel && (
                        <div className="mt-2 space-y-2">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    currentUserId={currentUserId}
                                    level={level + 1}
                                    maxLevel={maxLevel}
                                    onLike={onLike}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReport={onReport}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
