"use client"

import type { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng"
import { MicOff, Users, VideoOff } from "lucide-react"

type RemoteUser = {
  uid: string
  videoTrack?: IRemoteVideoTrack
  audioTrack?: IRemoteAudioTrack
  hasVideo: boolean
  hasAudio: boolean
}

type AgoraVideoGridProps = {
  isJoined: boolean
  isVideoOff: boolean
  isMuted: boolean
  remoteUsers: RemoteUser[]
  localVideoRef: React.RefObject<HTMLDivElement | null>
  onRemoteVideoRef: (uid: string, element: HTMLDivElement | null) => void
}

export function AgoraVideoGrid({
  isJoined,
  isVideoOff,
  isMuted,
  remoteUsers,
  localVideoRef,
  onRemoteVideoRef,
}: AgoraVideoGridProps) {
  return (
    <div className="flex-1 p-2 overflow-hidden w-full h-full">
      <div className="flex flex-col md:flex-row gap-4 w-full h-full">
        {/* Local Video */}
        {isJoined && (
          <div className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 rounded-xl overflow-hidden border border-[var(--primary-foreground)]/10 shadow-2xl flex-1 min-w-0 h-[300px] md:h-auto">
            <div
              ref={localVideoRef}
              className="w-full h-full"
              style={{ minHeight: "250px" }}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--primary)]/90">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-2" />
                  <p className="text-[var(--primary-foreground)] font-medium">
                    Camera is off
                  </p>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-[var(--primary)]/70 rounded-lg px-2 py-1">
              <span className="text-[var(--primary-foreground)] text-sm font-medium">
                You
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex space-x-1">
              {isMuted && (
                <div className="bg-[var(--destructive)]/80 rounded-full p-1">
                  <MicOff className="w-3 h-3 text-[var(--primary-foreground)]" />
                </div>
              )}
              {isVideoOff && (
                <div className="bg-[var(--destructive)]/80 rounded-full p-1">
                  <VideoOff className="w-3 h-3 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remote Videos */}
        {remoteUsers.map((user) => (
          <div
            key={user.uid}
            className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 rounded-xl overflow-hidden border border-[var(--primary-foreground)]/10 shadow-2xl flex-1 min-w-0 h-[300px] md:h-auto"
          >
            <div
              ref={(el) => {
                onRemoteVideoRef(user.uid, el)
                if (el && user.videoTrack && user.hasVideo) {
                  setTimeout(() => {
                    if (user.videoTrack) {
                      user.videoTrack.play(el)
                    }
                  }, 100)
                }
              }}
              className="w-full h-full"
              style={{ minHeight: "250px" }}
            />

            {!user.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/80 to-[var(--primary)]">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-2" />
                  <p className="text-[var(--primary-foreground)] font-medium">
                    Camera is off
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-[var(--primary)]/70 rounded-lg px-2 py-1">
              <span className="text-[var(--primary-foreground)] text-sm font-medium">
                User {user.uid}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 flex space-x-1">
              {!user.hasAudio && (
                <div className="bg-[var(--destructive)]/80 rounded-full p-1">
                  <MicOff className="w-3 h-3 text-[var(--primary-foreground)]" />
                </div>
              )}
              {!user.hasVideo && (
                <div className="bg-[var(--destructive)]/80 rounded-full p-1">
                  <VideoOff className="w-3 h-3 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {remoteUsers.length === 0 && isJoined && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-[var(--border)] rounded-xl flex-1 min-w-0 h-[300px] md:h-auto">
            <div className="text-center">
              <Users className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-2" />
              <p className="text-[var(--muted-foreground)]">
                Waiting for others to join...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
