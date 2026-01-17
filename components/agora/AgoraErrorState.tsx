"use client"

import { Button } from "@/components/ui/button"

type AgoraErrorStateProps = {
  error: string
  onClose: () => void
  width?: string | number
  height?: string | number
  className?: string
  theme?: {
    primary?: string
    background?: string
    text?: string
  }
}

export function AgoraErrorState({
  error,
  onClose,
  width = "100%",
  height = "100vh",
  className = "",
}: AgoraErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center  ${className}`}
      style={{ width, height }}
    >
      <div className="p-8  border border-red-200 rounded-xl  text-center max-w-md w-full space-y-4 shadow-2xl">
        <p className="text-red-600 text-lg font-medium ">{error}</p>
        <Button onClick={onClose} variant="destructive">
          Close
        </Button>
      </div>
    </div>
  )
}
