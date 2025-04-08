"use client"

import {useRef, useState} from "react"
import ReactMarkdown from "react-markdown"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {EmojiPicker} from "@/components/emoji-picker"
import {Icons} from "@/components/icons"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: string
    maxHeight?: string
    onFilesChange?: (files: File[]) => void
}

export function RichTextEditor({
                                   value,
                                   onChange,
                                   placeholder = "What's on your mind?",
                                   onFilesChange
                               }: RichTextEditorProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [filePreviews, setFilePreviews] = useState<string[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Emoji insertion
    const insertEmoji = (emoji: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newText = value.slice(0, start) + emoji + value.slice(end)
        onChange(newText)

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length
            textarea.focus()
        }, 0)
    }

    // Formatting functions
    const wrapSelection = (before: string, after: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.slice(start, end)
        const newText = value.slice(0, start) + before + selected + after + value.slice(end)

        onChange(newText)

        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = start + before.length
            textarea.selectionEnd = end + before.length
        }, 0)
    }

    const insertListItem = () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const before = value.lastIndexOf("\n", start - 1) + 1
        const after = value.indexOf("\n", end)
        const line = value.slice(before, after === -1 ? undefined : after)

        const newLine = line.startsWith("- ") ? line : `- ${line}`
        const newText = value.slice(0, before) + newLine + value.slice(before + line.length)

        onChange(newText)

        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = textarea.selectionEnd = end + 2
        }, 0)
    }

    // File selection and preview
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newFiles = Array.from(files)
        const updatedFiles = [...selectedFiles, ...newFiles]
        setSelectedFiles(updatedFiles)

        // Preview logic
        newFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFilePreviews((prev) => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })

        // 🔄 Notify parent
        onFilesChange?.(updatedFiles)

        e.target.value = ""
    }

    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(updatedFiles)
        setFilePreviews((prev) => prev.filter((_, i) => i !== index))

        // 🔄 Notify parent
        onFilesChange?.(updatedFiles)
    }

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-primary/10 pb-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => wrapSelection("**", "**")}
                >
                    <Icons.bold className="h-4 w-4"/>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => wrapSelection("_", "_")}
                >
                    <Icons.italic className="h-4 w-4"/>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => wrapSelection("<u>", "</u>")}
                >
                    <Icons.underline className="h-4 w-4"/>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={insertListItem}
                >
                    <Icons.list className="h-4 w-4"/>
                </Button>

                <EmojiPicker onEmojiSelect={insertEmoji}>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                        <Icons.smile className="h-4 w-4"/>
                    </Button>
                </EmojiPicker>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Icons.image className="h-4 w-4"/>
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                />
            </div>

            {/* Text area */}
            <textarea
                ref={textareaRef}
                value={value}
                maxLength={5000} // optional HTML safeguard
                onChange={(e) => {
                    if (e.target.value.length <= 5000) {
                        onChange(e.target.value)
                    }
                }}
                placeholder={placeholder}
                className="w-full text-xl resize-none rounded-md border border-primary/20 p-3 focus:outline-none focus:ring focus:ring-primary/30 min-h-[120px] h-[30vh] overflow-auto"
            />
            <div className="text-xs text-muted-foreground text-right">
                {value.length} / 5000
            </div>

            {/* File previews */}
            {filePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {filePreviews.map((preview, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden">
                            {selectedFiles[index]?.type.startsWith("image/") ? (
                                <img src={preview} className="w-full h-32 object-cover" alt={`Preview ${index}`}/>
                            ) : (
                                <video src={preview} className="w-full h-32 object-cover" controls/>
                            )}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                onClick={() => removeFile(index)}
                            >
                                <Icons.close className="h-3 w-3"/>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

