"use client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

type UserInfo = {
  name: string | null
  email: string | null
  isAnonymous?: boolean | null
  employeeCode?: string | null
}

export default function PrivacySettings() {
  const [user, setUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
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

  // Fetch user info
  const { data: userInfoData, refetch } = useFetch<{ user: UserInfo }>({
    path: "/api/user/info",
    queryKey: ["user-info", "current"],
    config: {
      enabled: !isLoadingSession && !!user,
      retry: false,
    },
  })

  const userInfo = userInfoData?.user || {
    name: null,
    email: null,
    isAnonymous: false,
    employeeCode: null,
  }

  // API hook for toggling anonymous mode
  const { onRequest, isPending: isTogglingAnonymous } = useApi<
    Record<string, never>
  >({
    key: "toggle-anonymous",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleToggleAnonymous = () => {
    onRequest({
      path: "/api/user/anonymous",
      data: {},
      onSuccess: (response: UserInfo & { id?: string; role?: string }) => {
        // The response is the user data object from response.data.data
        // Update the query cache with the new data from the response
        if (
          response &&
          typeof response === "object" &&
          "isAnonymous" in response
        ) {
          queryClient.setQueryData(
            ["user-info", "current"],
            (oldData: { user: UserInfo } | undefined) => {
              if (oldData?.user) {
                return {
                  ...oldData,
                  user: {
                    ...oldData.user,
                    isAnonymous: response.isAnonymous,
                    employeeCode:
                      response.employeeCode || oldData.user.employeeCode,
                  },
                }
              }
              return oldData
            }
          )
        }
        // Also invalidate and refetch to ensure we have the latest data
        queryClient.invalidateQueries({ queryKey: ["user-info", "current"] })
        // Refetch to ensure UI is updated
        setTimeout(() => {
          refetch()
        }, 100)
      },
      onError: () => {
        // On error, refetch to get the correct state
        refetch()
      },
    })
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>
          <div className="text-foreground font-bold">Privacy Settings</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          {/* Anonymous Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Typography
                variant="span"
                className="font-medium text-foreground mb-1"
              >
                Anonymous Mode
              </Typography>
              <Typography
                variant="span"
                className="text-sm text-muted-foreground"
              >
                Hide your name, email, and image. Only your employee ID will be
                visible to doctors.
              </Typography>
            </div>
            <Switch
              checked={userInfo.isAnonymous || false}
              onCheckedChange={handleToggleAnonymous}
              disabled={isTogglingAnonymous}
            />
          </div>

          {userInfo.isAnonymous && userInfo.employeeCode && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <Typography
                variant="span"
                className="text-sm text-foreground mb-1 font-medium"
              >
                Your Employee Code
              </Typography>
              <Typography
                variant="span"
                className="text-sm text-muted-foreground"
              >
                When anonymous mode is enabled, doctors will see this identifier
                instead of your personal information:
              </Typography>
              <Typography
                variant="p"
                className="text-lg font-bold text-foreground mt-2"
              >
                {userInfo.employeeCode}
              </Typography>
            </div>
          )}

          {userInfo.isAnonymous && !userInfo.employeeCode && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <Typography variant="span" className="text-foreground">
                <strong>Note:</strong> You have anonymous mode enabled, but no
                employee code is assigned. Please contact your administrator to
                get an employee code assigned.
              </Typography>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <Typography
              variant="span"
              className="text-foreground font-medium mb-2"
            >
              How Anonymous Mode Works
            </Typography>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Your name, email, and profile image will be hidden</li>
              <li>Only your employee code will be visible to doctors</li>
              <li>You will always see your own full information</li>
              <li>This setting applies to all appointments and sessions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
