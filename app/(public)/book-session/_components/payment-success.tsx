"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function PaymentSuccess() {
  const router = useRouter()

  const handleJoinCall = () => {
    router.push("/join-session")
  }

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="bg-muted rounded-2xl p-8 mb-8 text-center space-y-6">
          <Typography variant="h3" className="text-foreground font-bold">
            Your payment was successful
          </Typography>
          <Typography variant="p" className="text-foreground text-sm">
            Your booking has been confirmed. You can now join the video call to
            start your consultation.
          </Typography>
        </div>

        {/* Join Video Call Button */}
        <div className="flex justify-center">
          <Button variant="default" size="lg" onClick={handleJoinCall}>
            Join video call now
          </Button>
        </div>
      </div>
    </section>
  )
}
