"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const handleSubmit = (data: ResetPasswordFormData) => {
    router.push(`/auth/verify-email`)
    console.log("Login data:", { ...data })
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-8 sm:space-y-6">
        <div className="text-center space-y-2">
          <Typography
            as="h3"
            variant="h5"
            className="text-xl sm:text-2xl font-bold text-foreground"
          >
            Reset Password
          </Typography>
          <Typography variant="span" className="text-muted-foreground">
            Kindly provide your email address reset your account password.
          </Typography>
        </div>

        <div className="space-y-6 sm:space-y-6 ">
          <FormModified
            schema={resetPasswordSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              email: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-3 lg:space-y-6">
                <components.Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="flex mx-auto w-full lg:w-[350px] sm:w-auto mt-4"
                >
                  Send Reset Link
                </Button>
              </div>
            )}
          </FormModified>

          <div className="text-center">
            <Typography variant="span" className="text-muted-foreground">
              {"Remember your password? "}
              <Link href="/auth/login">
                <span className="text-foreground font-bold hover:underline">
                  Login
                </span>
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
