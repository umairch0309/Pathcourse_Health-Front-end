"use client"

import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Loader } from "@/components/loader"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { env } from "@/env"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { buildRequestUrl } from "@/lib/utils"

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
  const isPageVisibleRef = useRef(true) // Track page visibility

  
  const {
    data: doctorData,
    isLoading,
    refetch,
  } = useFetch<DoctorData>({
    path: "/api/doctor",
    queryKey: ["doctor", "current"],
  })

  const isAvailable = doctorData?.isAvailable ?? false

  
  const { onRequest: toggleAvailability } = useApi<Record<string, never>>({
    key: "toggle-availability",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  
  const generateConnectionId = useCallback(() => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    connectionIdRef.current = null
  }, [])

  
  const sendHeartbeat = useCallback(async () => {
    if (!isAvailable) return

    try {
      const connectionId = connectionIdRef.current || generateConnectionId()
      connectionIdRef.current = connectionId

      const heartbeatPath = `/api/doctor/connection/heartbeat?connectionId=${connectionId}`
      const REQUEST_URL = buildRequestUrl(
        env.NEXT_PUBLIC_APP_URL,
        heartbeatPath
      )

      await axios.post(
        REQUEST_URL,
        {},
        {
          withCredentials: true,
        }
      )

      console.log(`Heartbeat sent at ${new Date().toISOString()}`)
    } catch (error) {
      console.error("Heartbeat failed:", error)
      stopHeartbeat()
      refetch()
    }
  }, [isAvailable, generateConnectionId, stopHeartbeat, refetch])

  
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      return // Already running
    }

    sendHeartbeat()
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat()
    }, 5000)
    console.log("Heartbeat started - sending every 5 seconds")
  }, [sendHeartbeat])

  
  const handleToggle = (checked: boolean) => {
    setIsToggling(true)
    toggleAvailability({
      path: "/api/doctor/availability/toggle",
      data: {} as Record<string, never>,
      onSuccess: () => {
        setIsToggling(false)
        refetch()
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

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden

      if (document.hidden) {
        console.log("Page hidden - heartbeat continues in background")
      } else {
        console.log("Page visible - ensuring heartbeat is active")
        if (isAvailable && !isLoading && !heartbeatIntervalRef.current) {
          startHeartbeat()
        }
        if (isAvailable && !isLoading) {
          sendHeartbeat()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAvailable, isLoading, startHeartbeat, sendHeartbeat])

  
  useEffect(() => {
    const handleBeforeUnload = () => {
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
          <CardTitle className="text-lg font-bold text-foreground mb-3">
            Set your Availability
          </CardTitle>
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
                Turn it On/Off for your availability to start receiving
                appointments
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
