"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader } from "@/components/loader"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { env } from "@/env"
import { buildRequestUrl } from "@/lib/utils"
import axios from "axios"

type DoctorData = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
  }
}

export default function Availability() {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const connectionIdRef = useRef<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  // Fetch current doctor data
  const { data: doctorData, isLoading, refetch } = useFetch<DoctorData>({
    path: "/api/doctor",
    queryKey: ["doctor", "current"],
  })

  const isAvailable = doctorData?.isAvailable ?? false

  // Toggle availability API
  const { onRequest: toggleAvailability } = useApi<Record<string, never>>({
    key: "toggle-availability",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  // Generate a unique connection ID
  const generateConnectionId = useCallback(() => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    connectionIdRef.current = null
  }, [])

  // Send heartbeat to backend
  const sendHeartbeat = useCallback(async () => {
    if (!isAvailable) return

    try {
      const connectionId = connectionIdRef.current || generateConnectionId()
      connectionIdRef.current = connectionId

      const heartbeatPath = `/api/doctor/connection/heartbeat?connectionId=${connectionId}`
      const REQUEST_URL = buildRequestUrl(env.NEXT_PUBLIC_APP_URL, heartbeatPath)

      await axios.post(
        REQUEST_URL,
        {},
        {
          withCredentials: true,
        }
      )
    } catch (error) {
      console.error("Heartbeat failed:", error)
      // Stop heartbeat on failure
      stopHeartbeat()
      // Notify parent that availability should be set to false by refetching
      // The backend should have already set isAvailable to false
      refetch()
    }
  }, [isAvailable, generateConnectionId, stopHeartbeat, refetch])

  // Start heartbeat when available
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      return // Already running
    }

    // Send initial heartbeat immediately
    sendHeartbeat()

    // Then send every 10 seconds
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat()
    }, 10000) // 10 seconds
  }, [sendHeartbeat])

  // Handle disconnection
  const handleDisconnect = useCallback(async () => {
    stopHeartbeat()

    try {
      const disconnectPath = "/api/doctor/connection/disconnect"
      const REQUEST_URL = buildRequestUrl(env.NEXT_PUBLIC_APP_URL, disconnectPath)

      // Use sendBeacon for reliability during page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({})], {
          type: "application/json",
        })
        navigator.sendBeacon(REQUEST_URL, blob)
      } else {
        // Fallback for browsers that don't support sendBeacon
        await fetch(REQUEST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          keepalive: true, // Keep request alive even after page unload
          credentials: "include", // Include cookies for authentication
        })
      }
    } catch (error) {
      console.error("Disconnect signal failed:", error)
    }
  }, [stopHeartbeat])

  // Handle availability toggle
  const handleToggle = (checked: boolean) => {
    setIsToggling(true)
    toggleAvailability({
      path: "/api/doctor/availability/toggle",
      data: {} as Record<string, never>,
      onSuccess: () => {
        setIsToggling(false)
        // Refetch doctor data to sync UI with server state
        refetch()
        // Start heartbeat if becoming available
        if (checked) {
          startHeartbeat()
        } else {
          stopHeartbeat()
        }
      },
      onError: () => {
        setIsToggling(false)
      },
    })
  }

  // Start heartbeat when component mounts and doctor is available
  useEffect(() => {
    if (isAvailable && !isLoading) {
      startHeartbeat()
    } else {
      stopHeartbeat()
    }

    return () => {
      stopHeartbeat()
    }
  }, [isAvailable, isLoading, startHeartbeat, stopHeartbeat])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, but keep heartbeat running
        // Connection will be detected as stale if heartbeat stops
      } else {
        // Page is visible again, ensure heartbeat is running if available
        if (isAvailable && !isLoading && !heartbeatIntervalRef.current) {
          startHeartbeat()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAvailable, isLoading, startHeartbeat])

  // Handle page unload
  // Note: We don't send disconnect on page unload (reload or close)
  // The backend's 30-second heartbeat timeout will automatically handle disconnections
  // This provides better UX: quick reloads maintain availability
  // If user wants to explicitly disconnect, they can toggle availability off
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Just stop the heartbeat
      // Don't send disconnect - backend will handle it via timeout
      stopHeartbeat()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      stopHeartbeat()
    }
  }, [stopHeartbeat])

  if (isLoading) {
    return (
      <Card className="bg-background rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[100px]">
            <Loader size="sm" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background rounded-lg">
      <CardContent className="p-6 space-y-6">
        {/* Available Now Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground mb-3">
                Set your Availability
              </CardTitle>
              <p className="text-sm text-muted-foreground">
               Turn it On/Off for your availability to start receiving appointments
              </p>
            </div>
          
          </div>
          <div className="flex items-center justify-center gap-2 lg:mt-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Your availability is currently {isAvailable ? "On" : "Off"}
              </p>
            </div>
              {isToggling && <Loader size="sm" />}
              <Switch
                checked={isAvailable}
                onCheckedChange={handleToggle}
                disabled={isToggling}
              />
            </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
