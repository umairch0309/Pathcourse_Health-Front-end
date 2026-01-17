"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { AgoraVideo } from "@/components/agora/AgoraVideo"
import { Loader } from "@/components/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type AgoraTokenData = {
  token: string
  channel: string
  uid: number | string
  appId: string
  expiry: string
  isExisting: boolean
}

export default function VideoCallPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")

  // Fetch Agora token
  const {
    data: tokenData,
    isLoading,
    error,
  } = useFetch<AgoraTokenData>({
    path: appointmentId ? `/api/agora/token/${appointmentId}` : "",
    queryKey: ["agora-token", appointmentId],
    config: {
      enabled: !!appointmentId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  })

  const handleEndCall = () => {
    // Navigate based on user role - for now just go to home
    router.push("/")
  }

  // Show error state
  if (error && appointmentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <Typography variant="h4" className="text-foreground font-bold">
            Unable to Join Session
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Failed to initialize video call. Please check your connection and try again."}
          </Typography>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading || !appointmentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader size="lg" />
          <Typography variant="p" className="text-muted-foreground">
            {!appointmentId
              ? "No appointment ID provided"
              : "Initializing video call..."}
          </Typography>
        </div>
      </div>
    )
  }

  // Show error if no token data
  if (!tokenData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <Typography variant="h4" className="text-foreground font-bold">
            Unable to Join Session
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            Failed to retrieve video call credentials. Please try again.
          </Typography>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Render Agora video component
  return (
    <AgoraVideo
      appId={tokenData.appId}
      token={tokenData.token}
      channel={tokenData.channel}
      uid={tokenData.uid.toString()}
      onEndCall={handleEndCall}
      showHeader={true}
      showControls={true}
      width="100%"
      height="100vh"
      className=""
      headerTitle="Video Consultation"
      showMedicalSidebar={true}
      appointmentId={appointmentId}
    />
  )
}
