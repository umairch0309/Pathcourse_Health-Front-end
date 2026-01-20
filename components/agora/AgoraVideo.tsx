"use client"

import { useQueryClient } from "@tanstack/react-query"
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
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"
import { buildRequestUrl } from "@/lib/utils"

import { AgoraControls } from "./AgoraControls"
import { AgoraErrorState } from "./AgoraErrorState"
import { AgoraHeader } from "./AgoraHeader"
import { AgoraLoadingState } from "./AgoraLoadingState"
import { AgoraMedicalSidebar } from "./AgoraMedicalSidebar"
import { AgoraPermissionModal } from "./AgoraPermissionModal"
import { AgoraVideoGrid } from "./AgoraVideoGrid"
import { SessionReasonModal } from "./SessionReasonModal"

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
  const [showSessionReasonModal, setShowSessionReasonModal] = useState(false)
  const showSessionReasonModalRef = useRef(false)
  const hasShownSessionReasonModalRef = useRef(false)
  const hasTriggeredModalRef = useRef(false)
  const [hasCompletedAppointment, setHasCompletedAppointment] = useState(false)
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
  const timerSecondsRef = useRef<number | undefined>(undefined)
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const TIMER_DURATION = 900 // 15 minutes in seconds

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

  const queryClient = useQueryClient()
  const aggressivePollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasDetectedStartedAtRef = useRef(false)

  // Fetch appointment data to get startedAt timestamp (works across browsers/devices)
  const { data: appointmentData, refetch: refetchAppointment } = useFetch<{
    id?: string
    startedAt: string | null
    status: string
  }>({
    path: appointmentId ? `/api/appointment/${appointmentId}` : "",
    queryKey: ["appointment-timer", appointmentId],
    config: {
      enabled: !!appointmentId && !isLoadingSession,
      refetchOnWindowFocus: false,
      // Refetch every 2 seconds normally, but we'll add aggressive polling for patients waiting
      refetchInterval: 2000,
    },
  })

  // Aggressive polling for patients waiting for doctor to join
  // This polls every 300ms when patient is waiting for startedAt
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser || !isJoined) {
      return
    }

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    // Only for patients who are waiting (no startedAt yet)
    if (isDoctor || appointmentData?.startedAt) {
      // Clear aggressive polling if doctor or startedAt exists
      if (aggressivePollIntervalRef.current) {
        clearInterval(aggressivePollIntervalRef.current)
        aggressivePollIntervalRef.current = null
      }
      hasDetectedStartedAtRef.current = true
      return
    }

    // If we already detected startedAt, don't start polling again
    if (hasDetectedStartedAtRef.current) {
      return
    }

    // Patient is waiting - start aggressive polling
    console.log(
      "[Patient] Starting aggressive polling for startedAt (every 300ms)"
    )

    const pollForStartedAt = async () => {
      try {
        const API_URL = env.NEXT_PUBLIC_APP_URL
        const REQUEST_PATH = buildRequestUrl(
          API_URL,
          `/api/appointment/${appointmentId}`
        )

        const response = await axios.get(REQUEST_PATH, {
          withCredentials: true,
        })

        const data = response.data?.data || response.data
        if (data?.startedAt && !hasDetectedStartedAtRef.current) {
          console.log(
            "[Patient] ⚡ Got startedAt from aggressive polling:",
            data.startedAt
          )
          // Mark as detected to prevent multiple refetches
          hasDetectedStartedAtRef.current = true

          // Clear aggressive polling immediately to stop further requests
          if (aggressivePollIntervalRef.current) {
            clearInterval(aggressivePollIntervalRef.current)
            aggressivePollIntervalRef.current = null
          }

          // Invalidate query to trigger React Query refetch (only once)
          queryClient.invalidateQueries({
            queryKey: ["appointment-timer", appointmentId],
          })

          // Single refetch - React Query will handle the rest
          await refetchAppointment()
        }
      } catch (error) {
        console.error("[Patient] Error in aggressive polling:", error)
      }
    }

    // Start polling immediately, then every 500ms (reduced frequency to avoid too many requests)
    pollForStartedAt()
    aggressivePollIntervalRef.current = setInterval(pollForStartedAt, 500)

    return () => {
      if (aggressivePollIntervalRef.current) {
        clearInterval(aggressivePollIntervalRef.current)
        aggressivePollIntervalRef.current = null
      }
    }
  }, [
    appointmentId,
    isLoadingSession,
    currentUser,
    isJoined,
    appointmentData?.startedAt,
    queryClient,
    refetchAppointment,
  ])

  // Initialize timer when patient joins - show fixed 15 minutes but don't start counting
  // Timer only starts counting when doctor joins and startedAt is set
  useEffect(() => {
    if (!appointmentId || !isJoined || isLoadingSession || !currentUser) {
      return
    }

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    // For patients: Show fixed 15-minute timer immediately when they join (but paused)
    if (!isDoctor && timerSecondsRef.current === undefined) {
      console.log(
        "[Timer] Patient joined - showing fixed 15-minute timer (paused)"
      )
      setTimerSeconds(TIMER_DURATION)
      timerSecondsRef.current = TIMER_DURATION
      // Don't set timerStartTimeRef yet - timer is paused until doctor joins
      timerStartTimeRef.current = null
      return
    }

    // When startedAt becomes available (doctor joins), start the timer from actual start time
    if (appointmentData?.startedAt) {
      const startTime = new Date(appointmentData.startedAt).getTime()

      // If timer is already synced with this start time, don't re-sync
      // BUT: Always allow sync if timerStartTimeRef was null (patient was waiting for doctor)
      const wasWaitingForDoctor = timerStartTimeRef.current === null
      if (
        !wasWaitingForDoctor &&
        timerStartTimeRef.current === startTime &&
        timerSecondsRef.current !== undefined
      ) {
        console.log("[Timer] Already synced with this start time, skipping")
        return
      }

      // Special case: Patient was waiting (timerStartTimeRef is null) and startedAt just became available
      // This is when doctor joins and patient needs to sync - FORCE SYNC
      if (wasWaitingForDoctor && !isDoctor) {
        console.log(
          "[Timer] ⚡ Patient was waiting, now syncing with doctor's startedAt - timer will start!"
        )
      }

      // Start timer from actual startedAt (this happens when doctor joins)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = TIMER_DURATION - elapsed

      console.log("[Timer] Doctor joined - starting timer from startedAt:", {
        startedAt: appointmentData.startedAt,
        elapsed,
        remaining,
        isDoctor,
        currentTimerSeconds: timerSecondsRef.current,
        previousStartTime: timerStartTimeRef.current,
        newStartTime: startTime,
      })

      if (remaining > 0) {
        // Timer is still valid - start counting from actual start time
        setTimerSeconds(remaining)
        timerSecondsRef.current = remaining
        timerStartTimeRef.current = startTime
        console.log("[Timer] Timer started successfully:", remaining)
      } else {
        // Timer has expired
        setTimerSeconds(0)
        timerSecondsRef.current = 0
        timerStartTimeRef.current = startTime
        console.log("[Timer] Timer expired, setting to 0")
      }
    }
  }, [
    appointmentData?.startedAt,
    appointmentId,
    isJoined,
    currentUser,
    isLoadingSession,
  ])

  // Start timer when doctor joins the call (only doctor can start timer)
  // Updates appointment startedAt via API so patient can sync across browsers/devices
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser || !isJoined) return

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    if (!isDoctor) {
      // Patients don't start timer - they will sync from appointment startedAt via API
      return
    }

    // Only start timer if appointment doesn't have startedAt yet
    // Check both appointmentData (from API) and local timer state
    const shouldStartTimer =
      !appointmentData?.startedAt &&
      timerStartTimeRef.current === null &&
      timerSeconds === undefined

    if (shouldStartTimer) {
      const startAppointment = async () => {
        try {
          const API_URL = env.NEXT_PUBLIC_APP_URL
          const startedAtISO = new Date().toISOString()
          const REQUEST_PATH = buildRequestUrl(
            API_URL,
            `/api/appointment/${appointmentId}`
          )

          console.log(
            `[Doctor] Starting appointment ${appointmentId}, setting startedAt:`,
            startedAtISO
          )

          // Update appointment with startedAt timestamp
          const response = await axios.patch(
            REQUEST_PATH,
            {
              startedAt: startedAtISO,
            },
            {
              withCredentials: true,
            }
          )

          console.log(
            "[Doctor] Appointment startedAt updated successfully:",
            response.data
          )

          // Set timer locally using the same timestamp
          const startTime = new Date(startedAtISO).getTime()
          timerStartTimeRef.current = startTime
          timerSecondsRef.current = TIMER_DURATION
          setTimerSeconds(TIMER_DURATION)

          // Invalidate and refetch appointment data to trigger sync on patient side
          // This ensures patient picks up startedAt immediately
          console.log("[Doctor] Invalidating query cache for appointment-timer")
          queryClient.invalidateQueries({
            queryKey: ["appointment-timer", appointmentId],
          })

          // Also manually refetch to ensure immediate update
          await refetchAppointment()
          console.log(
            "[Doctor] Query invalidated and refetched, patient should sync timer now"
          )
        } catch (error) {
          const errorDetails =
            error instanceof Error
              ? {
                  message: error.message,
                  response: (
                    error as { response?: { data?: unknown; status?: number } }
                  )?.response?.data,
                  status: (error as { response?: { status?: number } })
                    ?.response?.status,
                }
              : { message: String(error) }
          console.error("Failed to start appointment:", error)
          console.error("Error details:", errorDetails)
          // Fallback: still start timer locally even if API fails
          const startTime = Date.now()
          timerStartTimeRef.current = startTime
          timerSecondsRef.current = TIMER_DURATION
          setTimerSeconds(TIMER_DURATION)
          console.log(
            "[Doctor] Using fallback timer (local only, patient won't see it)"
          )
        }
      }

      startAppointment()
    }
  }, [
    isJoined,
    appointmentId,
    isLoadingSession,
    currentUser,
    appointmentData?.startedAt,
    timerSeconds,
    refetchAppointment,
    queryClient,
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

  // Timer countdown effect - syncs timer for both doctor and patient
  // This effect runs the countdown interval once timerSeconds is set AND startedAt is available
  useEffect(() => {
    // If timer is not set, don't run interval
    if (timerSeconds === undefined) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      return
    }

    // If timerStartTimeRef is null but startedAt is available, sync it first
    // This handles the case when patient was waiting and doctor just joined
    if (!timerStartTimeRef.current && appointmentData?.startedAt) {
      const startTime = new Date(appointmentData.startedAt).getTime()
      timerStartTimeRef.current = startTime
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = TIMER_DURATION - elapsed
      if (remaining > 0) {
        setTimerSeconds(remaining)
        timerSecondsRef.current = remaining
        console.log(
          "[Timer] ⚡ Countdown effect: Synced timerStartTimeRef from startedAt, starting countdown:",
          remaining
        )
      } else {
        setTimerSeconds(0)
        timerSecondsRef.current = 0
        console.log("[Timer] Countdown effect: Timer expired")
      }
      // Continue to set up interval below - timer will now count down
    }

    // If timerStartTimeRef is still null and no startedAt, timer is paused (patient waiting for doctor)
    if (!timerStartTimeRef.current && !appointmentData?.startedAt) {
      console.log("[Timer] Timer paused - waiting for doctor to join")
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      return
    }

    // Sync with timerStartTimeRef or appointment startedAt periodically
    // This ensures both doctor and patient stay in sync, and handles page reloads
    const syncTimer = () => {
      // First, try to get startTime from ref (primary source)
      let startTime = timerStartTimeRef.current

      // If ref is not set, try to get from appointment startedAt (for cross-browser sync)
      if (!startTime && appointmentData?.startedAt) {
        startTime = new Date(appointmentData.startedAt).getTime()
        timerStartTimeRef.current = startTime
      }

      if (appointmentId && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = TIMER_DURATION - elapsed

        if (remaining > 0) {
          timerSecondsRef.current = remaining
          setTimerSeconds(remaining)
        } else {
          timerSecondsRef.current = 0
          setTimerSeconds(0)
        }
      }
    }

    // Clear any existing interval before creating a new one
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Initial sync immediately
    syncTimer()

    // Set up interval for countdown
    timerIntervalRef.current = setInterval(() => {
      syncTimer()
    }, 1000)

    console.log(
      "[Timer] Countdown interval started, timerSeconds:",
      timerSeconds,
      "startTime:",
      timerStartTimeRef.current
    )

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [timerSeconds, appointmentId, appointmentData?.startedAt])

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
    // If doctor is manually ending the call, mark appointment as completed if not already done
    const isDoctor =
      currentUser?.role === "doctor" || currentUser?.role === "specialist"

    if (
      isDoctor &&
      appointmentId &&
      isJoined &&
      !hasCompletedAppointmentRef.current &&
      appointmentData?.status !== "COMPLETED"
    ) {
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

        console.log(
          "Appointment marked as completed (manual end call by doctor)"
        )
        hasCompletedAppointmentRef.current = true
        setHasCompletedAppointment(true)

        // Refetch appointment data to get updated status
        await refetchAppointment()

        // Set flag to show session reason modal after call ends
        if (!hasShownSessionReasonModalRef.current) {
          hasShownSessionReasonModalRef.current = true
          console.log(
            "[SessionReasonModal] Flag set to show modal after cleanup"
          )
        }
      } catch (error) {
        console.error("Failed to complete appointment:", error)
      }
    }

    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Reset timer ref
    timerStartTimeRef.current = null
    timerSecondsRef.current = undefined
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

    // If doctor manually ended the call and completed the appointment, ensure modal shows
    // The useEffect will handle it, but we also trigger a direct check after a delay
    console.log(
      "[SessionReasonModal] endCall cleanup complete, useEffect will handle modal display"
    )

    // Additional direct trigger after cleanup to ensure modal shows
    if (
      isDoctor &&
      hasCompletedAppointmentRef.current &&
      hasShownSessionReasonModalRef.current &&
      !hasTriggeredModalRef.current
    ) {
      console.log(
        "[SessionReasonModal] Direct trigger from endCall - setting modal immediately"
      )
      hasTriggeredModalRef.current = true
      showSessionReasonModalRef.current = true
      // Use setTimeout to ensure state update happens after cleanup
      setTimeout(() => {
        console.log(
          "[SessionReasonModal] Actually setting modal state from endCall"
        )
        setShowSessionReasonModal(true)
      }, 100)
    }

    // Only trigger external onEndCall immediately when:
    // - there's no appointment flow, or
    // - the user is not a doctor/specialist (patients should navigate away right after call end)
    //
    // For doctors with an appointment, navigation is deferred until the
    // SessionReasonModal is submitted or skipped.
    if (
      !appointmentId ||
      !isDoctor ||
      !hasCompletedAppointmentRef.current ||
      !hasShownSessionReasonModalRef.current
    ) {
      onEndCall?.()
    }
  }, [
    client,
    isJoined,
    localVideoTrack,
    localAudioTrack,
    onEndCall,
    currentUser,
    appointmentId,
    appointmentData?.status,
    refetchAppointment,
    // Don't include showSessionReasonModal - it causes unnecessary re-renders
  ])

  // Complete appointment when timer reaches 0 (works for both doctor and patient)
  useEffect(() => {
    if (
      timerSeconds === 0 &&
      appointmentId &&
      isJoined &&
      !hasCompletedAppointmentRef.current
    ) {
      hasCompletedAppointmentRef.current = true
      setHasCompletedAppointment(true)

      // Reset timer ref
      timerStartTimeRef.current = null

      const completeAppointment = async () => {
        const isDoctor =
          currentUser?.role === "doctor" || currentUser?.role === "specialist"

        // Only doctor can mark appointment as completed via API
        if (isDoctor) {
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

            // Refetch appointment data to get updated status
            await refetchAppointment()

            // Show session reason modal for doctor after appointment completion
            // Set flag to show modal after call ends
            if (!hasShownSessionReasonModalRef.current) {
              hasShownSessionReasonModalRef.current = true
              console.log(
                "[SessionReasonModal] Flag set to show modal after timer expiry"
              )
            }
          } catch (error) {
            console.error("Failed to complete appointment:", error)
          }
        }

        // End the call for both doctor and patient when timer reaches 0
        endCall()
      }

      completeAppointment()
    }
  }, [
    timerSeconds,
    appointmentId,
    isJoined,
    endCall,
    currentUser,
    refetchAppointment,
  ])

  // Show session reason modal for doctor after appointment completion and call ends
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser) return

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    if (!isDoctor) return

    // Show modal when:
    // 1. We've completed the appointment (flag is set)
    // 2. Call has ended (not joined)
    // 3. Appointment status is COMPLETED (or we just completed it)
    // 4. Modal is not already open and we haven't already triggered it
    if (
      hasShownSessionReasonModalRef.current &&
      !isJoined &&
      (appointmentData?.status === "COMPLETED" ||
        hasCompletedAppointmentRef.current) &&
      !showSessionReasonModalRef.current &&
      !hasTriggeredModalRef.current
    ) {
      console.log("[SessionReasonModal] Conditions met, showing modal:", {
        hasShownSessionReasonModalRef: hasShownSessionReasonModalRef.current,
        isJoined,
        appointmentStatus: appointmentData?.status,
        hasCompletedAppointmentRef: hasCompletedAppointmentRef.current,
        showSessionReasonModalRef: showSessionReasonModalRef.current,
      })

      // Clear any existing timeout
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current)
        modalTimeoutRef.current = null
      }

      // Mark that we've triggered the modal to prevent multiple triggers
      hasTriggeredModalRef.current = true
      showSessionReasonModalRef.current = true

      // Set modal immediately
      console.log(
        "[SessionReasonModal] Setting modal to open (primary) - immediate"
      )

      // Set state directly - no cleanup function to interfere
      setShowSessionReasonModal(true)

      // Also update ref to match
      showSessionReasonModalRef.current = true
    }
  }, [
    appointmentData?.status,
    isJoined,
    appointmentId,
    isLoadingSession,
    currentUser,
    // Don't include showSessionReasonModal or refs in deps - refs don't trigger re-renders
  ])

  // Force check when appointment is completed via manual end call
  // This ensures the modal shows even if appointmentData?.status hasn't updated yet
  // Use a state variable to track completion so the effect re-runs when it changes
  useEffect(() => {
    if (!appointmentId || isLoadingSession || !currentUser) return

    const isDoctor =
      currentUser.role === "doctor" || currentUser.role === "specialist"

    if (!isDoctor) return

    // If we completed the appointment and call has ended, show modal
    // This is a secondary check to catch cases where appointmentData?.status might not be updated yet
    if (
      hasCompletedAppointment &&
      hasShownSessionReasonModalRef.current &&
      !isJoined &&
      !showSessionReasonModalRef.current &&
      !hasTriggeredModalRef.current
    ) {
      console.log(
        "[SessionReasonModal] Secondary check triggered, showing modal",
        {
          hasCompletedAppointment,
          hasShownSessionReasonModalRef: hasShownSessionReasonModalRef.current,
          isJoined,
          showSessionReasonModalRef: showSessionReasonModalRef.current,
        }
      )

      // Clear any existing timeout
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current)
        modalTimeoutRef.current = null
      }

      // Mark that we've triggered the modal to prevent multiple triggers
      hasTriggeredModalRef.current = true
      showSessionReasonModalRef.current = true

      // Set modal immediately
      console.log(
        "[SessionReasonModal] Setting modal to open (secondary) - immediate"
      )

      // Set state directly - no cleanup function to interfere
      setShowSessionReasonModal(true)

      // Also update ref to match
      showSessionReasonModalRef.current = true
    }
  }, [
    hasCompletedAppointment,
    isJoined,
    appointmentId,
    isLoadingSession,
    currentUser,
    // Don't include showSessionReasonModal in deps - it causes the effect to re-run
  ])

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

      {/* Session Reason Modal - Show for doctors after appointment completion */}
      {appointmentId && (
        <SessionReasonModal
          open={showSessionReasonModal}
          onOpenChange={(open) => {
            console.log("[SessionReasonModal] onOpenChange called:", open)
            setShowSessionReasonModal(open)
            showSessionReasonModalRef.current = open
            if (!open) {
              console.log("[SessionReasonModal] Modal closed, resetting flags")
              hasShownSessionReasonModalRef.current = false
              hasTriggeredModalRef.current = false
            }
          }}
          appointmentId={appointmentId}
          onSubmitted={() => {
            console.log("[SessionReasonModal] Submitted, closing modal")
            setShowSessionReasonModal(false)
            showSessionReasonModalRef.current = false
            hasShownSessionReasonModalRef.current = false
            hasTriggeredModalRef.current = false

            // After the doctor has submitted or skipped the reason,
            // trigger the external onEndCall to allow navigation.
            onEndCall?.()
          }}
        />
      )}
    </div>
  )
}
