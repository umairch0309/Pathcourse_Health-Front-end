"use client"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"

const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

type newPasswordFormData = z.infer<typeof newPasswordSchema>

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleSubmit = (data: newPasswordFormData) => {
    router.push("/auth/login")
    console.log("Signup data:", { ...data })
  }

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <Typography
            as="h1"
            variant="h5"
            className="text-xl font-bold sm:text-2xl text-foreground"
          >
            New Password
          </Typography>
          <Typography variant="span" className="text-muted-foreground">
            Enter your new password below to reset your account password.
          </Typography>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <FormModified
            schema={newPasswordSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              password: "",
              confirm_password: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <components.Field
                    name="password"
                    label="Password"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {(field) => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="flex h-9 w-full rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </components.Field>
                </div>

                <div className="space-y-2">
                  <components.Field
                    name="confirm_password"
                    label="Confirm Password"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {(field) => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="flex h-9 w-full rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </components.Field>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="flex mx-auto w-full lg:w-[350px] lg:mt-10 sm:w-auto"
                >
                  Update Password
                </Button>
              </div>
            )}
          </FormModified>
        </div>
      </div>
    </div>
  )
}
