/** biome-ignore-all lint/performance/noImgElement: Using img tag for signed URLs with query parameters */
"use client"

import { format } from "date-fns"
import { Download, FileText, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import DocumentPreview from "@/components/document-preview"
import EmptyCard from "@/components/empty-card"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type ChatMessage, useChat } from "@/hooks/use-chat"
import auth from "@/lib/auth"

function DateDivider({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-4">
      <div className="h-px flex-1 bg-muted" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-muted" />
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const time = format(new Date(message.createdAt), "hh:mm a")
  const [previewOpen, setPreviewOpen] = useState(false)

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getFileExtension = (fileName: string | null) => {
    if (!fileName) return "FILE"
    const ext = fileName.split(".").pop()?.toUpperCase() || "FILE"
    return ext
  }

  return (
    <>
      <div className="flex items-end gap-3">
        <Avatar className="lg:size-8 size-6 ring-1 ring-foreground/5 flex-shrink-0">
          <AvatarImage
            src={message.sender.image || undefined}
            alt={message.sender.name || "Sender"}
          />
          <AvatarFallback className="bg-muted">
            <User className="lg:size-4 size-3 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="max-w-[320px] md:max-w-[420px]">
          {message.content ? (
            <div className="rounded-2xl bg-muted px-4 py-2 text-sm break-words whitespace-pre-wrap">
              {message.content}
            </div>
          ) : message.messageType === "IMAGE" && message.fileUrl ? (
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
              <div className="relative w-[250px] h-[250px] md:w-[380px] md:h-[380px] bg-muted">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", message.fileUrl)
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", message.fileUrl)
                  }}
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 pointer-events-none">
                <span className="text-[10px] text-white">{time}</span>
              </div>
              <button
                type="button"
                className="absolute inset-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer"
                onClick={() => setPreviewOpen(true)}
                aria-label="Preview image"
              />
            </div>
          ) : message.messageType === "FILE" && message.fileUrl ? (
            <div className="rounded-2xl overflow-hidden bg-background border border-border shadow-sm">
              {/* File info section */}
              <div className="bg-muted px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="lg:size-10 size-8 rounded bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="lg:size-6 size-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {message.fileName || "Attachment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getFileExtension(message.fileName)} •{" "}
                      {formatFileSize(message.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setPreviewOpen(true)}
                  >
                    Open
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = message.fileUrl || "#"
                      link.download = message.fileName || "attachment"
                      link.target = "_blank"
                      link.click()
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Save as...
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-end p-2 bg-muted">
                <span className="text-[10px] text-muted-foreground">
                  {time}
                </span>
              </div>
            </div>
          ) : null}
          {message.content && (
            <div className="mt-1 text-[10px] text-muted-foreground">{time}</div>
          )}
        </div>
      </div>
      {message.fileUrl && (
        <DocumentPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          fileUrl={message.fileUrl}
          fileName={message.fileName || "Attachment"}
          label={message.fileName || "Attachment"}
        />
      )}
    </>
  )
}

export default function ChatWindow() {
  const params = useParams()
  const appointmentId = params.id as string
  const [user, setUser] = useState<{ id: string; role: string | null } | null>(
    null
  )
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const endRef = useRef<HTMLDivElement | null>(null)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user as { id: string; role: string | null })
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchSession()
  }, [])

  const { messages, isLoadingMessages, typingUsers, markAsRead } = useChat({
    appointmentId,
    userId: user?.id || "",
    role: "patient",
  })

  // Group messages by date
  const groupedMessages = messages.reduce(
    (acc, message) => {
      const date = format(new Date(message.createdAt), "MMM dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(message)
      return acc
    },
    {} as Record<string, ChatMessage[]>
  )

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      const unreadIds = messages.filter((m) => !m.isRead).map((m) => m.id)
      if (unreadIds.length > 0) {
        markAsRead(unreadIds)
      }
    }
  }, [messages, markAsRead])

  return (
    <div className="flex flex-col rounded-2xl border bg-background w-full">
      <div className="relative overflow-y-auto p-4 md:p-6">
        {isLoadingUser || isLoadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" variant="spinner" />
          </div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <EmptyCard message="No messages yet" />
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <DateDivider label={date} />
                <div className="space-y-8">
                  {dateMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </div>
            ))}
            {typingUsers.size > 0 && (
              <div className="mt-4 text-xs text-muted-foreground italic">
                Someone is typing...
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>
      <div className="p-3 md:p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          You can only view messages. Only doctors can send messages.
        </p>
      </div>
    </div>
  )
}
