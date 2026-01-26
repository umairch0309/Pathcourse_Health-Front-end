"use client"

import { User, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function SignupPage() {
  const router = useRouter()

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <Typography
            as="h3"
            variant="h5"
            className="text-xl font-bold sm:text-2xl text-primary"
          >
            <span className="text-foreground">Welcome To</span> Path Course
            Health
          </Typography>
          <Typography variant="span" className="text-foreground">
            Choose your account type to get started
          </Typography>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-auto p-6 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary transition-colors"
            onClick={() => router.push("/auth/signup/patient")}
          >
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div className="text-left">
                <Typography variant="h6" className="font-semibold">
                  Patient Signup
                </Typography>
                <Typography
                  variant="span"
                  className="text-xs text-muted-foreground"
                >
                  Create a patient account
                </Typography>
              </div>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-auto p-6 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary transition-colors"
            onClick={() => router.push("/auth/signup/doctor")}
          >
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <div className="text-left">
                <Typography variant="h6" className="font-semibold">
                  Doctor Signup
                </Typography>
                <Typography
                  variant="span"
                  className="text-xs text-muted-foreground"
                >
                  Create a doctor account
                </Typography>
              </div>
            </div>
          </Button>
        </div>

        <div className="text-center">
          <Typography variant="span" className="text-foreground/60">
            Have an account?{" "}
            <Link href="/auth/login">
              <span className="font-bold hover:underline text-foreground">
                Login
              </span>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}
