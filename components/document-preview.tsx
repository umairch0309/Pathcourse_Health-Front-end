"use client"

import { X } from "lucide-react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type DocumentPreviewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileUrl: string
  fileName: string
  label: string
}

export default function DocumentPreview({
  open,
  onOpenChange,
  fileUrl,
  fileName,
  label,
}: DocumentPreviewProps) {
  const getFileType = (url: string): "pdf" | "image" | "video" | "unknown" => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes(".pdf") || lowerUrl.includes("application/pdf")) {
      return "pdf"
    }
    if (
      lowerUrl.includes(".jpg") ||
      lowerUrl.includes(".jpeg") ||
      lowerUrl.includes(".png") ||
      lowerUrl.includes(".gif") ||
      lowerUrl.includes(".webp") ||
      lowerUrl.includes("image/")
    ) {
      return "image"
    }
    if (
      lowerUrl.includes(".mp4") ||
      lowerUrl.includes(".mov") ||
      lowerUrl.includes(".avi") ||
      lowerUrl.includes(".webm") ||
      lowerUrl.includes("video/")
    ) {
      return "video"
    }
    return "unknown"
  }

  const fileType = getFileType(fileUrl)

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-none w-screen h-screen p-0 flex flex-col",
          "inset-0 border-0 rounded-none",
          "translate-x-0 translate-y-0"
        )}
      >
        <div className="flex-1 overflow-auto p-10">
          {fileType === "pdf" && (
            <iframe
              src={fileUrl}
              className="w-full h-full min-h-[600px] border rounded-lg"
              title={fileName}
            />
          )}
          {fileType === "image" && (
            <div className="flex items-center justify-center h-full min-h-[600px] relative w-full">
              <NextImage
                src={fileUrl}
                alt={fileName}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
          )}
          {fileType === "video" && (
            <div className="flex items-center justify-center h-full min-h-[600px]">
              <video
                src={fileUrl}
                controls
                className="max-w-full max-h-full rounded-lg"
              >
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {fileType === "unknown" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] space-y-4">
              <p className="text-muted-foreground">
                Preview not available for this file type.
              </p>
              <Button
                variant="outline"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
