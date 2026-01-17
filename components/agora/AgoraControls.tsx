"use client"

import {
  HelpCircle,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react"

type AgoraControlsProps = {
  isMuted: boolean
  isVideoOff: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onEndCall: () => void
  isJoined: boolean
  permissions?: {
    camera: "granted" | "denied" | "prompt" | "unknown"
    microphone: "granted" | "denied" | "prompt" | "unknown"
  }
}

export function AgoraControls({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  isJoined,
  permissions,
}: AgoraControlsProps) {
  if (!isJoined) {
    return null
  }

  const micPermissionDenied = permissions?.microphone === "denied"
  const cameraPermissionDenied = permissions?.camera === "denied"

  const buttonBase =
    "flex items-center justify-center rounded-lg w-14 h-14 transition-colors duration-200 relative"

  return (
    <div className="flex items-center justify-center space-x-4 p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        type="button"
        className={`${buttonBase} ${
          micPermissionDenied || isMuted
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
        }`}
        title={
          micPermissionDenied
            ? "Microphone permission denied. Click to retry."
            : isMuted
              ? "Unmute"
              : "Mute"
        }
      >
        {micPermissionDenied ? (
          <>
            <MicOff className="w-6 h-6" />
            <HelpCircle className="w-3.5 h-3.5 absolute -top-1 -right-1 text-white bg-red-600 rounded-full" />
          </>
        ) : isMuted ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Video Button */}
      <button
        onClick={onToggleVideo}
        type="button"
        className={`${buttonBase} ${
          cameraPermissionDenied || isVideoOff
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
        }`}
        title={
          cameraPermissionDenied
            ? "Camera permission denied. Click to retry."
            : isVideoOff
              ? "Turn on camera"
              : "Turn off camera"
        }
      >
        {cameraPermissionDenied ? (
          <>
            <VideoOff className="w-6 h-6" />
            <HelpCircle className="w-3.5 h-3.5 absolute -top-1 -right-1 text-white bg-red-600 rounded-full" />
          </>
        ) : isVideoOff ? (
          <VideoOff className="w-6 h-6" />
        ) : (
          <Video className="w-6 h-6" />
        )}
      </button>

      {/* End Call Button */}
      <button
        type="button"
        onClick={onEndCall}
        className={`${buttonBase} bg-red-600 hover:bg-red-700 text-white`}
        title="End Call"
      >
        <PhoneOff className="w-6 h-6" />
      </button>
    </div>
  )
}
