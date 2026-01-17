"use client"

import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng"
import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { env } from "@/env"
import auth from "@/lib/auth"
import { buildRequestUrl } from "@/lib/utils"

import { AgoraControls } from "./AgoraControls"
import { AgoraErrorState } from "./AgoraErrorState"
import { AgoraHeader } from "./AgoraHeader"
import { AgoraLoadingState } from "./AgoraLoadingState"
import { AgoraMedicalSidebar } from "./AgoraMedicalSidebar"
import { AgoraPermissionModal } from "./AgoraPermissionModal"
import { AgoraVideoGrid } from "./AgoraVideoGrid"

type RemoteUser = {
  uid: string
  videoTrack?: IRemoteVideoTrack
  audioTrack?: IRemoteAudioTrack
  hasVideo: boolean
  hasAudio: boolean
}

type PermissionState = {
  camera: "granted" | "denied" | "prompt" | "unknown"
  microphone: "granted" | "denied" | "prompt" | "unknown"
}

type AgoraVideoProps = {
  /** Agora App ID for the project */
  appId: string
  /** Agora token for authentication */
  token: string
  /** Channel name to join */
  channel: string
  /** User ID for this participant */
  uid: string
  /** Callback when call is ended */
  onEndCall?: () => void
  /** Show header with channel name (default: true) */
  showHeader?: boolean
  /** Show control buttons (default: true) */
  showControls?: boolean
  /** Custom width for the video container */
  width?: string | number
  /** Custom height for the video container */
  height?: string | number
  /** Additional CSS classes */
  className?: string
  /** Custom header title */
  headerTitle?: string
  /** Custom theme colors */
  theme?: {
    primary?: string
    background?: string
    text?: string
  }
  /** Show medical sidebar (default: false) */
  showMedicalSidebar?: boolean
  /** Appointment ID for medical sidebar */
  appointmentId?: string | null
}

export function AgoraVideo({
  appId,
  token,
  channel,
  uid,
  onEndCall,
  showHeader = true,
  showControls = true,
  width = "100%",
  height = "100vh",
  className = "",
  headerTitle,
  theme = {
    primary: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    background: "bg-gray-800",
    text: "text-white",
  },
  showMedicalSidebar = false,
  appointmentId,
}: AgoraVideoProps) {
  // Element refs
  const localVideoRef = useRef<HTMLDivElement | null>(null)
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // State
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: "unknown",
    microphone: "unknown",
  })
  const [isMedicalSidebarOpen, setIsMedicalSidebarOpen] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true) // Show on first load
  const [hasRequestedInitialPermissions, setHasRequestedInitialPermissions] =
    useState(false)
  const [timerSeconds, setTimerSeconds] = useState<number | undefined>(
    undefined
  )
  const [currentUser, setCurrentUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCompletedAppointmentRef = useRef(false)
  const timerStartTimeRef = useRef<number | null>(null)
  const TIMER_DURATION = 900 // 15 minutes in seconds
  const STORAGE_KEY = `appointment_timer_${appointmentId}`

  // Fetch current user session to determine role
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setCurrentUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  // Initialize timer from localStorage (for both doctor and patient)
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser) return

    // Check if timer exists in localStorage (shared between doctor and patient)
    const storedTimerData = localStorage.getItem(STORAGE_KEY)

    if (storedTimerData) {
      try {
        const { startTime } = JSON.parse(storedTimerData)
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = TIMER_DURATION - elapsed

        if (remaining > 0) {
          // Timer is still valid, continue from remaining time
          setTimerSeconds(remaining)
          timerStartTimeRef.current = startTime
        } else {
          // Timer has expired, clear storage and don't start
          localStorage.removeItem(STORAGE_KEY)
          setTimerSeconds(0)
        }
      } catch (error) {
        console.error("Failed to parse stored timer data:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [appointmentId, isLoadingSession, currentUser, STORAGE_KEY])

  // Start timer when doctor joins the call (only doctor can start timer)
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser || !isJoined) return

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    if (!isDoctor) {
      // Patients don't start timer, but will read from localStorage when doctor starts it
      return
    }

    // Only start timer if it hasn't been started yet
    if (timerStartTimeRef.current === null && timerSeconds === undefined) {
      const startTime = Date.now()
      timerStartTimeRef.current = startTime

      // Store timer start time in localStorage (shared with patient)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime }))

      // Start timer from full duration
      setTimerSeconds(TIMER_DURATION)
    }
  }, [
    isJoined,
    appointmentId,
    isLoadingSession,
    currentUser,
    timerSeconds,
    STORAGE_KEY,
  ])

  // Patient side: Check localStorage periodically for timer started by doctor
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser || !isJoined) return

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    if (isDoctor) {
      // Doctor handles timer start in the effect above
      return
    }

    // Patient: Check if doctor has started the timer
    if (timerStartTimeRef.current === null && timerSeconds === undefined) {
      const checkTimer = () => {
        const storedTimerData = localStorage.getItem(STORAGE_KEY)
        if (storedTimerData) {
          try {
            const { startTime } = JSON.parse(storedTimerData)
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            const remaining = TIMER_DURATION - elapsed

            if (remaining > 0) {
              // Timer exists and is valid, sync with it
              setTimerSeconds(remaining)
              timerStartTimeRef.current = startTime
            } else {
              // Timer expired
              setTimerSeconds(0)
            }
          } catch (error) {
            console.error("Failed to parse stored timer data:", error)
          }
        }
      }

      // Check immediately
      checkTimer()

      // Check periodically in case doctor starts timer after patient joins
      const interval = setInterval(checkTimer, 1000)

      return () => clearInterval(interval)
    }
  }, [
    isJoined,
    appointmentId,
    isLoadingSession,
    currentUser,
    timerSeconds,
    STORAGE_KEY,
  ])

  // Initialize Agora client and set up event listeners
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return
    }

    const initializeAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

      // Set up event listeners
      agoraClient.on("user-published", async (user, mediaType) => {
        console.log("User published:", user.uid, mediaType)

        try {
          await agoraClient.subscribe(user, mediaType)
          console.log("Successfully subscribed to user:", user.uid, mediaType)

          setRemoteUsers((prev) => {
            const existingUser = prev.find((u) => u.uid === user.uid.toString())
            if (existingUser) {
              return prev.map((u) =>
                u.uid === user.uid.toString()
                  ? {
                      ...u,
                      [mediaType === "video" ? "videoTrack" : "audioTrack"]:
                        mediaType === "video"
                          ? user.videoTrack
                          : user.audioTrack,
                      [mediaType === "video" ? "hasVideo" : "hasAudio"]: true,
                    }
                  : u
              )
            } else {
              return [
                ...prev,
                {
                  uid: user.uid.toString(),
                  videoTrack:
                    mediaType === "video" ? user.videoTrack : undefined,
                  audioTrack:
                    mediaType === "audio" ? user.audioTrack : undefined,
                  hasVideo: mediaType === "video",
                  hasAudio: mediaType === "audio",
                },
              ]
            }
          })

          // Play video/audio
          if (mediaType === "video" && user.videoTrack) {
            setTimeout(() => {
              const remoteVideoDiv =
                remoteVideoRefs.current[user.uid.toString()]
              if (remoteVideoDiv && user.videoTrack) {
                console.log("Playing remote video for user:", user.uid)
                user.videoTrack.play(remoteVideoDiv)
              }
            }, 100)
          }

          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play()
          }
        } catch (error) {
          console.error("Error subscribing to user:", user.uid, error)
        }
      })

      agoraClient.on("user-unpublished", (user, mediaType) => {
        console.log("User unpublished:", user.uid, mediaType)
        setRemoteUsers((prev) =>
          prev.map((u) =>
            u.uid === user.uid.toString()
              ? {
                  ...u,
                  [mediaType === "video" ? "hasVideo" : "hasAudio"]: false,
                  [mediaType === "video" ? "videoTrack" : "audioTrack"]:
                    undefined,
                }
              : u
          )
        )
      })

      agoraClient.on("user-left", (user) => {
        console.log("User left:", user.uid)
        setRemoteUsers((prev) =>
          prev.filter((u) => u.uid !== user.uid.toString())
        )
        delete remoteVideoRefs.current[user.uid.toString()]
      })

      setClient(agoraClient)

      return () => {
        agoraClient.removeAllListeners()
        agoraClient.leave().catch(console.error)
      }
    }

    initializeAgora()
  }, [])

  // Timer countdown effect
  useEffect(() => {
    if (timerSeconds === undefined || timerSeconds <= 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      return
    }

    // Sync with localStorage periodically to handle page visibility changes
    const syncTimer = () => {
      if (appointmentId && timerStartTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - timerStartTimeRef.current) / 1000
        )
        const remaining = TIMER_DURATION - elapsed

        if (remaining > 0) {
          setTimerSeconds(remaining)
        } else {
          setTimerSeconds(0)
        }
      }
    }

    timerIntervalRef.current = setInterval(() => {
      syncTimer()
    }, 1000)

    // Initial sync
    syncTimer()

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [timerSeconds, appointmentId])

  // Join channel and setup tracks - only after permissions are handled
  useEffect(() => {
    if (
      !client ||
      !appId ||
      !token ||
      !channel ||
      !uid ||
      !hasRequestedInitialPermissions
    ) {
      return
    }

    const joinChannel = async () => {
      try {
        setIsConnecting(true)
        setConnectionError(null)

        console.log("Attempting to join channel:", channel, "with UID:", uid)

        // Create local tracks with permission handling
        const newPermissions: PermissionState = {
          camera: "unknown",
          microphone: "unknown",
        }
        let localVideo: ICameraVideoTrack | null = null
        let localAudio: IMicrophoneAudioTrack | null = null

        // Import AgoraRTC dynamically
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default

        // Try to create video track
        try {
          localVideo = await AgoraRTC.createCameraVideoTrack()
          newPermissions.camera = "granted"
          console.log("Camera track created successfully")
        } catch (error) {
          console.warn("Failed to create camera track:", error)
          newPermissions.camera = "denied"
          setIsVideoOff(true)
        }

        // Try to create audio track
        try {
          localAudio = await AgoraRTC.createMicrophoneAudioTrack()
          newPermissions.microphone = "granted"
          console.log("Microphone track created successfully")
        } catch (error) {
          console.warn("Failed to create microphone track:", error)
          newPermissions.microphone = "denied"
          setIsMuted(true)
        }

        setPermissions(newPermissions)
        setLocalVideoTrack(localVideo)
        setLocalAudioTrack(localAudio)

        // Join the channel
        // Log all parameters for debugging
        console.log("🔵 Agora Join Parameters (before processing):", {
          appId,
          channel,
          uid,
          uidType: typeof uid,
          tokenLength: token?.length || 0,
          tokenFirstChars: token ? `${token.substring(0, 30)}...` : "null",
          tokenLastChars: token
            ? `...${token.substring(token.length - 30)}`
            : "null",
          fullToken: token, // Log full token for debugging (remove in production)
        })

        // Ensure token is not empty
        if (!token || token.trim() === "") {
          throw new Error("Invalid token: token is empty")
        }

        // Validate token format (Agora tokens typically start with the appId)
        const trimmedToken = token.trim()
        if (
          !trimmedToken.startsWith("006") &&
          !trimmedToken.startsWith(appId.substring(0, 3))
        ) {
          console.warn(
            "⚠️ Token format warning: Token doesn't start with expected prefix. This might indicate a token generation issue."
          )
        }

        // IMPORTANT: UID must match exactly what was used to generate the token
        // Since UID is a MongoDB ObjectId (hex string like "6960b72906135b08078bca4f"),
        // we MUST keep it as a string - it cannot be converted to a number
        // The backend must generate the token with UID as a string
        const uidToUse = String(uid).trim()

        console.log("🟢 Final join parameters (being sent to Agora):", {
          appId,
          channel,
          uid: uidToUse,
          uidType: typeof uidToUse,
          tokenLength: trimmedToken.length,
          tokenStartsWith: trimmedToken.substring(0, 10),
          tokenEndsWith: trimmedToken.substring(trimmedToken.length - 10),
          fullToken: trimmedToken, // Full token for debugging
        })

        try {
          // Use the trimmed token
          await client.join(appId, channel, trimmedToken, uidToUse)
          console.log("✅ Successfully joined Agora channel")
        } catch (joinError: unknown) {
          const errorDetails = {
            message:
              joinError instanceof Error
                ? joinError.message
                : String(joinError),
            code: (joinError as { code?: string })?.code,
            appId,
            channel,
            uid: uidToUse,
            tokenLength: token.length,
            tokenPreview: token.substring(0, 50),
          }
          console.error("Agora join error details:", errorDetails)

          // Provide specific guidance for token errors
          if (
            errorDetails.message.includes("invalid token") ||
            errorDetails.code === "CAN_NOT_GET_GATEWAY_SERVER"
          ) {
            console.error(
              "⚠️ Token validation failed. This is a BACKEND issue.\n" +
                "The backend must generate the token with EXACTLY these parameters:\n" +
                `  - appId: "${appId}"\n` +
                `  - channel: "${channel}"\n` +
                `  - uid: "${uidToUse}" (as string)\n` +
                "Possible causes:\n" +
                "  1. Token expired (check token expiration time)\n" +
                "  2. Token generated with different parameters\n" +
                "  3. Backend token generation logic is incorrect\n" +
                "  4. Agora App ID mismatch"
            )
          }

          throw joinError
        }

        // Publish available tracks
        const tracksToPublish = [localVideo, localAudio].filter(
          (track): track is ICameraVideoTrack | IMicrophoneAudioTrack =>
            track !== null
        )
        if (tracksToPublish.length > 0) {
          await client.publish(tracksToPublish)
          console.log("Successfully published local tracks")
        }

        setIsJoined(true)
        setIsConnecting(false)

        // Play local video
        setTimeout(() => {
          if (localVideo && localVideoRef.current) {
            localVideo.play(localVideoRef.current)
            console.log("Local video started playing")
          }
        }, 100)
      } catch (error) {
        console.error("Error joining channel:", error)
        setConnectionError(
          error instanceof Error ? error.message : "Failed to join call"
        )
        setIsConnecting(false)
      }
    }

    joinChannel()
  }, [client, appId, token, channel, uid, hasRequestedInitialPermissions])

  // Handle toggling the mute state with permission handling
  const toggleMute = async () => {
    // If permission denied or not available, show permission modal
    if (permissions.microphone !== "granted") {
      console.log("Microphone permission needed, showing modal")
      setShowPermissionModal(true)
      return
    }

    // If we have a track, toggle its state
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(isMuted)
      setIsMuted(!isMuted)
    } else if (permissions.microphone === "granted") {
      // If permission is granted but we don't have a track, try to create one
      try {
        console.log("Creating new microphone track")
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        setLocalAudioTrack(audioTrack)
        setIsMuted(false)

        // Publish the new track if connected
        if (client && isJoined) {
          await client.publish(audioTrack)
          console.log("Published new microphone track")
        }
      } catch (error) {
        console.error("Failed to create microphone track:", error)
        setIsMuted(true)
        // If creation fails, we might need to update permission state
        setPermissions((prev) => ({ ...prev, microphone: "denied" }))
        setShowPermissionModal(true)
      }
    }
  }

  // Handle toggling the video state with permission handling
  const toggleVideo = async () => {
    // If permission denied or not available, show permission modal
    if (permissions.camera !== "granted") {
      console.log("Camera permission needed, showing modal")
      setShowPermissionModal(true)
      return
    }

    // If we have a track, toggle its state
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(isVideoOff)
      setIsVideoOff(!isVideoOff)
    } else if (permissions.camera === "granted") {
      // If permission is granted but we don't have a track, try to create one
      try {
        console.log("Creating new camera track")
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default
        const videoTrack = await AgoraRTC.createCameraVideoTrack()
        setLocalVideoTrack(videoTrack)
        setIsVideoOff(false)

        // Publish the new track if connected
        if (client && isJoined) {
          await client.publish(videoTrack)
          console.log("Published new camera track")

          // Play local video
          if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current)
          }
        }
      } catch (error) {
        console.error("Failed to create camera track:", error)
        setIsVideoOff(true)
        // If creation fails, we might need to update permission state
        setPermissions((prev) => ({ ...prev, camera: "denied" }))
        setShowPermissionModal(true)
      }
    }
  }

  const endCall = useCallback(async () => {
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Clear stored timer data
    if (appointmentId) {
      localStorage.removeItem(STORAGE_KEY)
    }

    timerStartTimeRef.current = null
    setTimerSeconds(undefined)

    try {
      if (client && isJoined) {
        await client.leave()
        console.log("Left channel successfully")
      }

      // Close tracks
      if (localVideoTrack) {
        localVideoTrack.close()
        setLocalVideoTrack(null)
      }

      if (localAudioTrack) {
        localAudioTrack.close()
        setLocalAudioTrack(null)
      }

      // Reset state
      setIsJoined(false)
      setRemoteUsers([])
    } catch (error) {
      console.error("Error during cleanup:", error)
    }

    onEndCall?.()
  }, [
    client,
    isJoined,
    localVideoTrack,
    localAudioTrack,
    onEndCall,
    appointmentId,
    STORAGE_KEY,
  ])

  // Complete appointment when timer reaches 0
  useEffect(() => {
    if (
      timerSeconds === 0 &&
      appointmentId &&
      isJoined &&
      !hasCompletedAppointmentRef.current
    ) {
      hasCompletedAppointmentRef.current = true

      // Clear stored timer data
      localStorage.removeItem(STORAGE_KEY)
      timerStartTimeRef.current = null

      const completeAppointment = async () => {
        try {
          const API_URL = env.NEXT_PUBLIC_APP_URL
          const REQUEST_PATH = buildRequestUrl(
            API_URL,
            `/api/appointment/${appointmentId}/complete`
          )

          await axios.patch(
            REQUEST_PATH,
            {},
            {
              withCredentials: true,
            }
          )

          console.log("Appointment marked as completed successfully")
        } catch (error) {
          console.error("Failed to complete appointment:", error)
        }

        // End the call after attempting to complete appointment
        endCall()
      }

      completeAppointment()
    }
  }, [timerSeconds, appointmentId, isJoined, endCall, STORAGE_KEY])

  const handleRemoteVideoRef = (
    uid: string,
    element: HTMLDivElement | null
  ) => {
    remoteVideoRefs.current[uid] = element
  }

  const toggleMedicalSidebar = () => {
    setIsMedicalSidebarOpen(!isMedicalSidebarOpen)
  }

  // Permission handlers
  const handlePermissionModalClose = () => {
    setShowPermissionModal(false)
    setHasRequestedInitialPermissions(true)
  }

  const handlePermissionsGranted = async (newPermissions: PermissionState) => {
    setPermissions(newPermissions)
    setHasRequestedInitialPermissions(true)

    // Update mute/video states based on permissions
    if (newPermissions.camera === "denied") {
      setIsVideoOff(true)
    }
    if (newPermissions.microphone === "denied") {
      setIsMuted(true)
    }

    // If we're already connected and permissions have changed, create and publish new tracks
    if (client && isJoined) {
      console.log("Updating tracks based on new permissions")

      // Import AgoraRTC once for both operations
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default

      // Handle camera permission changes
      if (newPermissions.camera === "granted" && !localVideoTrack) {
        try {
          console.log("Creating new camera track")
          const videoTrack = await AgoraRTC.createCameraVideoTrack()
          setLocalVideoTrack(videoTrack)
          setIsVideoOff(false)

          // Publish the new track
          if (client) {
            await client.publish(videoTrack)
            console.log("Published new camera track")

            // Play local video
            if (localVideoRef.current) {
              videoTrack.play(localVideoRef.current)
            }
          }
        } catch (error) {
          console.error(
            "Failed to create camera track after permission granted:",
            error
          )
          setIsVideoOff(true)
        }
      }

      // Handle microphone permission changes
      if (newPermissions.microphone === "granted" && !localAudioTrack) {
        try {
          console.log("Creating new microphone track")
          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
          setLocalAudioTrack(audioTrack)
          setIsMuted(false)

          // Publish the new track
          if (client) {
            await client.publish(audioTrack)
            console.log("Published new microphone track")
          }
        } catch (error) {
          console.error(
            "Failed to create microphone track after permission granted:",
            error
          )
          setIsMuted(true)
        }
      }
    }
  }

  const totalParticipants = remoteUsers.length + (isJoined ? 1 : 0)

  // Error state
  if (connectionError) {
    return (
      <AgoraErrorState
        error={connectionError}
        onClose={endCall}
        width={width}
        height={height}
        className={className}
        theme={theme}
      />
    )
  }

  // Loading state
  if (isConnecting) {
    return (
      <AgoraLoadingState
        width={width}
        height={height}
        className={className}
        theme={theme}
      />
    )
  }

  return (
    <div
      className="relative flex w-full bg-[var(--primary)] text-[var(--primary-foreground)] overflow-hidden"
      style={{ width, height }}
    >
      {/* Main video container */}
      <div className="flex-1 flex flex-col w-full h-full">
        {/* Header */}
        {showHeader && (
          <AgoraHeader
            channel={channel}
            headerTitle={headerTitle}
            isConnecting={isConnecting}
            isJoined={isJoined}
            totalParticipants={totalParticipants}
            uid={uid}
            theme={theme}
            showMedicalSidebar={showMedicalSidebar}
            onToggleMedicalSidebar={toggleMedicalSidebar}
            timerSeconds={timerSeconds}
          />
        )}

        {/* Video Grid */}
        <AgoraVideoGrid
          isJoined={isJoined}
          isVideoOff={isVideoOff}
          isMuted={isMuted}
          remoteUsers={remoteUsers}
          localVideoRef={localVideoRef}
          onRemoteVideoRef={handleRemoteVideoRef}
        />

        {/* Controls */}
        {showControls && (
          <AgoraControls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onEndCall={endCall}
            isJoined={isJoined}
            permissions={permissions}
          />
        )}
      </div>

      {/* Medical Sidebar */}
      {showMedicalSidebar && (
        <AgoraMedicalSidebar
          isOpen={isMedicalSidebarOpen}
          onClose={() => setIsMedicalSidebarOpen(false)}
          appointmentId={appointmentId}
        />
      )}

      {/* Overlay when sidebar is open on mobile */}
      {showMedicalSidebar && isMedicalSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-[var(--primary)]/50 z-30 md:hidden"
          onClick={() => setIsMedicalSidebarOpen(false)}
        />
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <AgoraPermissionModal
          isOpen={showPermissionModal}
          onClose={handlePermissionModalClose}
          onPermissionsGranted={handlePermissionsGranted}
          currentPermissions={permissions}
        />
      )}
    </div>
  )
}
