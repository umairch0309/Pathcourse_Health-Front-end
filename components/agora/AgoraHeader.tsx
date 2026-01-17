"use client"

import { Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"

type AgoraHeaderProps = {
  channel: string
  headerTitle?: string
  isConnecting: boolean

  isJoined: boolean
  totalParticipants: number
  uid: string
  theme?: {
    primary?: string
    background?: string
    text?: string
  }
  showMedicalSidebar?: boolean
  onToggleMedicalSidebar?: () => void
  timerSeconds?: number
}

export function AgoraHeader({
  channel,
  headerTitle,
  isConnecting,
  isJoined,
  totalParticipants,
  uid,
  theme = {
    primary: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    background: "bg-gray-800",
    text: "text-white",
  },
  showMedicalSidebar = false,
  onToggleMedicalSidebar,
  timerSeconds,
}: AgoraHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return (
    <div
      className={`flex items-center justify-between p-2 bg-black/20 backdrop-blur-sm border-b border-white/10 ${theme.text || "text-white"}`}
    >
      <div>
        <h2 className="text-xl font-semibold">
          {headerTitle || `Video Call - ${channel}`}
        </h2>
        <p className="text-sm text-gray-300">
          {isConnecting
            ? "Connecting..."
            : isJoined
              ? "Connected"
              : "Not connected"}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {timerSeconds !== undefined && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm text-white font-mono font-semibold">
              {formatTime(timerSeconds)}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full">
          <div
            className={`w-2 h-2 rounded-full ${isJoined ? "bg-green-400" : "bg-gray-400"}`}
          ></div>
          <span className="text-sm text-white">
            participants:
            {totalParticipants !== 1 ? "" : ""}
            {totalParticipants}
          </span>
        </div>
        <div className="text-xs text-gray-400 text-center">
          ID:
          {uid}
        </div>

        {showMedicalSidebar && onToggleMedicalSidebar && (
          <Button
            onClick={onToggleMedicalSidebar}
            variant="secondary"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Medical
          </Button>
        )}
      </div>
    </div>
  )
}
