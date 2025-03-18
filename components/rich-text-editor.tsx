"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { EmojiPicker } from "@/components/emoji-picker"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "What's on your mind?",
  minHeight = "120px",
  maxHeight = "300px",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle formatting commands
  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)

      // Focus back on the editor
      if (editorRef.current) {
        editorRef.current.focus()

        // Get the updated content and trigger onChange
        const newContent = editorRef.current.innerHTML
        onChange(newContent)
      }
    },
    [onChange],
  )

  // Handle link insertion
  const insertLink = () => {
    if (linkUrl && linkText) {
      execCommand("insertHTML", `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkUrl("")
      setLinkText("")
      setIsLinkPopoverOpen(false)
    }
  }

  // Handle emoji insertion
  const insertEmoji = (emoji: string) => {
    execCommand("insertText", emoji)
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setSelectedFiles((prev) => [...prev, ...newFiles])

    // Create previews for the files
    newFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFilePreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith("video/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFilePreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      }
    })

    // Clear the input
    e.target.value = ""
  }

  // Handle file removal
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle editor content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Handle pasting plain text
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  return (
    <div className="space-y-3">
      {/* Formatting toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-primary/10 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => execCommand("bold")}
        >
          <Icons.bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => execCommand("italic")}
        >
          <Icons.italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => execCommand("underline")}
        >
          <Icons.underline className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px bg-primary/10 mx-1" />

        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
              <Icons.link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 rounded-xl border-primary/20">
            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="link-text" className="text-xs font-medium">
                  Text
                </label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                  className="h-8 border-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="link-url" className="text-xs font-medium">
                  URL
                </label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-8 border-primary/20"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  onClick={insertLink}
                  disabled={!linkUrl || !linkText}
                >
                  Insert Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-4 w-px bg-primary/10 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
              <Icons.heading className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 rounded-xl border-primary/20">
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground"
                  onClick={() => execCommand("formatBlock", `<h${level}>`)}
                >
                  H{level}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <Icons.list className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => execCommand("insertOrderedList")}
        >
          <Icons.listOrdered className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px bg-primary/10 mx-1" />

        <EmojiPicker onEmojiSelect={insertEmoji}>
          <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
            <Icons.smile className="h-4 w-4" />
          </Button>
        </EmojiPicker>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icons.image className="h-4 w-4" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
          />
        </Button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        className={cn("outline-none border-none p-0 overflow-auto", "prose prose-sm dark:prose-invert max-w-none")}
        style={{ minHeight, maxHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleContentChange}
        onPaste={handlePaste}
        placeholder={placeholder}
      />

      {/* File previews */}
      {filePreviews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {filePreviews.map((preview, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden">
              {selectedFiles[index]?.type.startsWith("image/") ? (
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <video src={preview} className="w-full h-32 object-cover" controls />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => removeFile(index)}
              >
                <Icons.close className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

