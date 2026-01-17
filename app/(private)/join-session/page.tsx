"use client"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/app/(public)/header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

type UserInfo = {
  isAnonymous?: boolean | null
  employeeCode?: string | null
  role?: string | null
}

export default function JoinSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")
  const [user, setUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [stayAnonymous, setStayAnonymous] = useState(false)
  const queryClient = useQueryClient()

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  // Fetch user info to get current anonymous status
  const { data: userInfoData } = useFetch<{ user: UserInfo }>({
    path: "/api/user/info",
    queryKey: ["user-info", "current"],
    config: {
      enabled: !isLoadingSession && !!user,
      retry: false,
    },
  })

  // Set initial anonymous state from user info
  useEffect(() => {
    if (userInfoData?.user?.isAnonymous !== undefined) {
      setStayAnonymous(userInfoData.user.isAnonymous || false)
    }
  }, [userInfoData])

  // API hook for toggling anonymous mode
  const { onRequest, isPending: isTogglingAnonymous } = useApi<
    Record<string, never>
  >({
    key: "toggle-anonymous",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleToggleAnonymous = (checked: boolean) => {
    setStayAnonymous(checked)
    onRequest({
      path: "/api/user/anonymous",
      data: {},
      onSuccess: () => {
        // Invalidate and refetch user info
        queryClient.invalidateQueries({ queryKey: ["user-info", "current"] })
      },
    })
  }

  const handleJoinSession = () => {
    if (appointmentId) {
      router.push(`/join-session/video-call?appointmentId=${appointmentId}`)
    } else {
      router.push("/join-session/video-call")
    }
  }

  // Only show anonymous option for patients
  const isPatient = user?.role === "patient"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <Typography variant="h4" className="text-foreground font-bold mb-8">
            Join Individual Session
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Info Card */}
            <div className="lg:col-span-2">
              <div className="bg-muted rounded-2xl p-8">
                <Typography
                  variant="h5"
                  className="text-foreground font-bold mb-4"
                >
                  Session Information
                </Typography>
                <Typography variant="p" className="text-foreground mb-6">
                  You are about to join your individual session with your
                  therapist. Make sure you are in a quiet and private location.
                </Typography>
                {isPatient && (
                  <div className="mt-6 p-4 border rounded-lg bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <Typography
                        variant="p"
                        className="font-medium text-foreground"
                      >
                        Stay Anonymous
                      </Typography>
                      <Switch
                        checked={stayAnonymous}
                        onCheckedChange={handleToggleAnonymous}
                        disabled={isTogglingAnonymous}
                      />
                    </div>
                    <Typography
                      variant="p"
                      className="text-sm text-muted-foreground"
                    >
                      {stayAnonymous
                        ? "Your name, email, and image will be hidden. Only your employee ID will be visible to the doctor."
                        : "Your full information will be visible to the doctor."}
                    </Typography>
                    {stayAnonymous && userInfoData?.user?.employeeCode && (
                      <Typography
                        variant="p"
                        className="text-sm text-muted-foreground mt-2"
                      >
                        Employee ID:{" "}
                        <span className="font-medium">
                          {userInfoData.user.employeeCode}
                        </span>
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Ready To Join */}
            <div className="space-y-6 lg:mt-30 mt-10">
              <div>
                <Typography variant="h5" className="text-foreground font-bold">
                  Ready To Join?
                </Typography>
                <Typography variant="p" className="text-foreground mb-6">
                  Are you ready to join your individual session with therapist?
                </Typography>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleJoinSession}
                >
                  Join Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
