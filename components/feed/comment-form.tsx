"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useAuth } from "@/contexts/auth-context"

interface CommentFormProps {
    placeholder?: string
    onSubmit: (content: string) => void
    autoFocus?: boolean
    buttonText?: string
}

export function CommentForm({
                                placeholder = "Add a comment...",
                                onSubmit,
                                autoFocus = false,
                                buttonText = "Post",
                            }: CommentFormProps) {
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { user } = useAuth()

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [autoFocus])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await onSubmit(content)
            setContent("")
        } catch (error) {
            console.error("Error submitting comment:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={user?.profilePictureUrl}
                    alt={user?.name || "User"}
                />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex space-x-2">
                <Textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[60px] flex-1 resize-none text-sm"
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || isSubmitting}
                    className="self-end rounded-full h-8"
                >
                    {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : buttonText}
                </Button>
            </div>
        </form>
    )
}
