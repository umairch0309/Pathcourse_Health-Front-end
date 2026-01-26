/** biome-ignore-all lint/performance/noImgElement: Using img tag for signed URLs with query parameters */
"use client"

import { format } from "date-fns"
import {
  CheckCheck,
  Download,
  FileText,
  Paperclip,
  Send,
  User,
  X,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import DocumentPreview from "@/components/document-preview"
import EmptyCard from "@/components/empty-card"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useApi from "@/hooks/use-api"
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

function LeftBubble({ message }: { message: ChatMessage }) {
  const time = format(new Date(message.createdAt), "hh:mm a")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(message.fileUrl)

  useEffect(() => {
    if (message.messageType === "IMAGE" && message.fileUrl) {
      if (
        message.fileUrl.startsWith("http://") ||
        message.fileUrl.startsWith("https://")
      ) {
        setImageUrl(message.fileUrl)
      } else {
        console.log("Image fileUrl appears to be an S3 key:", message.fileUrl)
        setImageUrl(message.fileUrl)
      }
    } else {
      setImageUrl(null)
    }
  }, [message.fileUrl, message.messageType])

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
            <User className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="max-w-[320px] md:max-w-[420px]">
          {message.content ? (
            <div className="rounded-2xl bg-muted px-4 py-2 text-sm break-words whitespace-pre-wrap">
              {message.content}
            </div>
          ) : message.messageType === "IMAGE" && imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-muted">
                <img
                  src={imageUrl}
                  alt={message.fileName || "Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Failed to load image:",
                      imageUrl,
                      "Original fileUrl:",
                      message.fileUrl
                    )
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", imageUrl)
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
              <div className="bg-muted px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-destructive" />
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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground">
                      {time}
                    </span>
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

function RightBubble({ message }: { message: ChatMessage }) {
  const time = format(new Date(message.createdAt), "hh:mm a")
  const isRead = message.isRead
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(message.fileUrl)

  useEffect(() => {
    if (message.messageType === "IMAGE" && message.fileUrl) {
      if (
        message.fileUrl.startsWith("http://") ||
        message.fileUrl.startsWith("https://")
      ) {
        setImageUrl(message.fileUrl)
      } else {
        console.log("Image fileUrl appears to be an S3 key:", message.fileUrl)
        setImageUrl(message.fileUrl)
      }
    } else {
      setImageUrl(null)
    }
  }, [message.fileUrl, message.messageType])

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
      <div className="flex items-end justify-end gap-3">
        <div className="max-w-[320px] md:max-w-[420px] text-right">
          {message.content ? (
            <div className="rounded-2xl bg-muted px-4 py-2 text-sm break-words whitespace-pre-wrap">
              {message.content}
            </div>
          ) : message.messageType === "IMAGE" && imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group ml-auto">
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-muted">
                <img
                  src={imageUrl}
                  alt={message.fileName || "Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Failed to load image:",
                      imageUrl,
                      "Original fileUrl:",
                      message.fileUrl
                    )
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", imageUrl)
                  }}
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 pointer-events-none">
                <span className="text-[10px] text-white">{time}</span>
                {isRead ? (
                  <CheckCheck className="h-3 w-3 text-white" />
                ) : (
                  <CheckCheck className="h-3 w-3 text-white/70" />
                )}
              </div>
              <button
                type="button"
                className="absolute inset-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer"
                onClick={() => setPreviewOpen(true)}
                aria-label="Preview image"
              />
            </div>
          ) : message.messageType === "FILE" && message.fileUrl ? (
            <div className="rounded-2xl overflow-hidden bg-background border border-border shadow-sm ml-auto">
              <div className="bg-muted px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-destructive" />
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
              <div className="flex items-center gap-1 justify-end p-2 bg-muted">
                <span className="text-[10px] text-muted-foreground">
                  {time}
                </span>
                {isRead ? (
                  <CheckCheck className="h-3 w-3 text-primary" />
                ) : (
                  <CheckCheck className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
          ) : null}
          {message.content && (
            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="text-[10px] text-foreground">{time}</span>
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-primary" />
              ) : (
                <CheckCheck className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
        <Avatar className="lg:size-8 size-5 ring-1 ring-foreground/5 flex-shrink-0">
          <AvatarImage src={undefined} alt="You" />
          <AvatarFallback className="bg-muted">
            <User className="lg:size-4 size-3 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
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

type AgoraChatProps = {
  appointmentId: string
  userId: string
  role: "doctor" | "patient"
}

export function AgoraChat({
  appointmentId,
  userId,
  role,
}: AgoraChatProps) {
  const [value, setValue] = useState("")
  const [filePreview, setFilePreview] = useState<{
    file: File
    preview: string
    messageType: "IMAGE" | "FILE"
  } | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isSendingRef = useRef(false)

  const {
    messages,
    isConnected,
    isLoadingMessages,
    typingUsers,
    sendMessage,
    sendFile,
    startTyping,
    stopTyping,
    markAsRead,
    isSending,
  } = useChat({
    appointmentId,
    userId,
    role,
  })

  const { onRequest: getSignedUrl, isPending: isUploadingFile } = useApi<{
    fileName: string
    fileType: string
    directory?: string
  }>({
    showSuccessToast: false,
    showErrorToast: true,
    method: "post",
  })

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

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  useEffect(() => {
    return () => {
      if (filePreview?.preview) {
        URL.revokeObjectURL(filePreview.preview)
      }
    }
  }, [filePreview])

  useEffect(() => {
    if (messages.length > 0 && role !== "doctor") {
      const unreadIds = messages.filter((m) => !m.isRead).map((m) => m.id)
      if (unreadIds.length > 0) {
        markAsRead(unreadIds)
      }
    }
  }, [messages, role, markAsRead])

  function handleSend() {
    const v = value.trim()
    if (!v || isSending || isSendingRef.current) {
      return
    }

    isSendingRef.current = true
    sendMessage(v, "TEXT")
    setValue("")
    stopTyping()

    setTimeout(() => {
      isSendingRef.current = false
    }, 1000)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const uploadToS3 = async (file: File, uploadUrl: string): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      console.error("File size exceeds 10MB limit")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    const messageType = isImage ? "IMAGE" : "FILE"

    let preview = ""
    if (
      isImage ||
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      preview = URL.createObjectURL(file)
    }

    setFilePreview({
      file,
      preview,
      messageType,
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleSendFile() {
    if (!filePreview) return

    const { file, messageType } = filePreview

    getSignedUrl({
      path: "/api/upload-url",
      data: {
        fileName: file.name,
        fileType: file.type,
        directory: "chat-uploads",
      },
      onSuccess: async (response: {
        uploadUrl: string
        key: string
        fileUrl: string
        expiresAt: string
      }) => {
        try {
          await uploadToS3(file, response.uploadUrl)
          sendFile(response.fileUrl, file.name, file.size, messageType)
          setFilePreview(null)
          if (filePreview.preview) {
            URL.revokeObjectURL(filePreview.preview)
          }
        } catch (error) {
          console.error("Failed to upload file:", error)
        }
      },
      onError: (error: unknown) => {
        console.error("Failed to get signed URL:", error)
      },
    })
  }

  function handleCancelFilePreview() {
    if (filePreview?.preview) {
      URL.revokeObjectURL(filePreview.preview)
    }
    setFilePreview(null)
  }

  const isDoctor = role === "doctor"

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
        {isLoadingMessages ? (
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
                  {dateMessages.map((message) => {
                    const isRight = message.sender.id === userId
                    return isRight ? (
                      <RightBubble key={message.id} message={message} />
                    ) : (
                      <LeftBubble key={message.id} message={message} />
                    )
                  })}
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
      {isDoctor && (
        <div className="p-3 md:p-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Patient can only view the chat or attachments
          </p>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Attach"
              disabled={!isConnected || isUploadingFile || isSending}
            >
              {isUploadingFile ? (
                <Loader size="sm" variant="spinner" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </button>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (e.target.value.trim()) {
                  startTyping()
                } else {
                  stopTyping()
                }
              }}
              onBlur={stopTyping}
              placeholder="Enter your message"
              className="h-10 flex-1 border border-border p-2 rounded-md"
              onKeyDown={handleKeyDown}
              disabled={!isConnected}
            />
            <Button
              type="button"
              variant="default"
              onClick={handleSend}
              aria-label="Send"
              className="bg-foreground text-background h-10 w-10"
              disabled={!isConnected || !value.trim() || isSending}
            >
              {isConnected ? (
                <Send className="h-4 w-4" />
              ) : (
                <Loader size="sm" variant="spinner" />
              )}
            </Button>
          </div>
        </div>
      )}
      {!isDoctor && (
        <div className="p-3 md:p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            You can only view messages. Only doctors can send messages.
          </p>
        </div>
      )}

      <Dialog
        open={!!filePreview}
        onOpenChange={(open) => !open && handleCancelFilePreview()}
      >
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Preview File</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancelFilePreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {filePreview && (
            <>
              <div className="flex-1 overflow-auto min-h-[400px] max-h-[60vh] border rounded-lg bg-muted p-4">
                {filePreview.messageType === "IMAGE" && filePreview.preview ? (
                  <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 90vw, 800px"
                    />
                  </div>
                ) : filePreview.messageType === "FILE" ? (
                  <div className="w-full h-full min-h-[400px]">
                    {filePreview.file.type === "application/pdf" ||
                    filePreview.file.name.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={
                          filePreview.preview ||
                          URL.createObjectURL(filePreview.file)
                        }
                        className="w-full h-full min-h-[400px] border rounded-lg"
                        title={filePreview.file.name}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {filePreview.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(filePreview.file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Preview not available. File will be sent as
                            attachment.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelFilePreview}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSendFile}
                  disabled={isUploadingFile || isSending}
                >
                  {isUploadingFile ? (
                    <>
                      <Loader size="sm" variant="spinner" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

