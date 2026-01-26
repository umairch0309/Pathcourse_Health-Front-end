"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = useMemo(() => {
    const r = searchParams.get("role")
    return r === "doctor" ? "doctor" : "patient"
  }, [searchParams])

  const [otp, setOtp] = useState("")
  const isOtpComplete = otp.trim().length === 4

  const handleVerify = useCallback(() => {
    if (!isOtpComplete) {
      return
    }
    router.push("/patient")
  }, [isOtpComplete, role, router])

  return (
    <div className="w-full p-4 flex items-center justify-center">
      <div className="w-full max-w-xs sm:max-w-sm text-center space-y-4 sm:space-y-2">
        <Typography variant="h4" className="text-foreground font-bold">
          Verify Email
        </Typography>

        <div className="space-y-1">
          <Typography
            variant="span"
            className="text-muted-foreground text-center"
          >
            A 4 digit OTP has been sent to your email address{" "}
            <span className="text-primary">laslie.alexander@gmail.com</span>.
            This code is valid for only 30 minutes.
          </Typography>
        </div>

        <Button variant="link" className=" font-semibold text-black">
          Change Email
        </Button>

        <InputOTP
          maxLength={4}
          value={otp}
          onChange={setOtp}
          containerClassName="justify-center"
          className="w-12 h-12 text-lg"
          onComplete={handleVerify}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>

        <div className="flex flex-col items-center gap-2">
          <Typography variant="span" className="text-muted-foreground mt-2">
            If you didn’t receive the code then click on the button below.
          </Typography>

          <Button variant="link" className=" font-semibold text-black">
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
