"use client"

import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import FormModified from "@/components/ui/form-modified"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"
import auth from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toastError, toastSuccess } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const result = await auth.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess(context) {
            toastSuccess("Login successful! Redirecting...")
            router.refresh()
            console.log("Login successful:", context)
            // Redirect to a protected route - the layout will handle role-based redirects
            // Using window.location for full page reload to ensure session is loaded
            setTimeout(() => {
              window.location.href = "/admin"
            }, 500)
          },
        }
      )
      console.log("Login result:", result)

      // Check if result has an error
      if (result?.error) {
        const errorMessage =
          result.error.message || "An error occurred during login"
        toastError(errorMessage)
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
      const errorMessage =
        (
          error as {
            message?: string
            response?: { data?: { message?: string } }
          }
        )?.message ||
        (
          error as {
            message?: string
            response?: { data?: { message?: string } }
          }
        )?.response?.data?.message ||
        "Invalid email or password."
      toastError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "facebook") => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <Typography
            as="h3"
            variant="h5"
            className="text-xl font-bold sm:text-2xl text-primary"
          >
            <span className="text-foreground">Welcome Back To,</span> Path
            Course Health
          </Typography>
          <Typography variant="span" className="text-foreground">
            Welcome back! Please enter your details.
          </Typography>
        </div>

        <div className="space-y-4 sm:space-y-6 ">
          <div className="flex flex-col lg:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("google")}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("facebook")}
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="hidden sm:inline">Continue with Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs">
              <Typography
                variant="span"
                className="text-muted-foreground bg-background px-2"
              >
                or
              </Typography>
            </div>
          </div>

          <FormModified
            schema={loginSchema}
            onSubmit={handleSubmit}
            disabled={loading}
            defaultValues={{
              email: "",
              password: "",
              rememberMe: false,
            }}
          >
            {({ components }) => (
              <div className="space-y-3 sm:space-y-4">
                <components.Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  labelClassName="text-xs text-muted-foreground mb-2"
                />

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
                          placeholder="Enter your password"
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

                <div className="flex flex-row items-center justify-between">
                  <components.Field name="rememberMe">
                    {(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-black"
                        />
                        <Typography
                          variant="span"
                          className="text-foreground/90"
                        >
                          Remember me
                        </Typography>
                      </div>
                    )}
                  </components.Field>

                  <Button
                    type="button"
                    variant="link"
                    className="text-destructive text-sm self-start sm:self-auto"
                    onClick={() => router.push("/auth/reset-password")}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="flex mx-auto w-full lg:w-[350px] sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader
                      size="sm"
                      variant="default"
                      color="white"
                      className="mr-2"
                    />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>
            )}
          </FormModified>

          <div className="text-center space-y-2">
            <Typography variant="span" className="text-foreground/60">
              {"Don't have an account? "}
            </Typography>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Link
                href="/auth/signup/patient"
                className="hover:text-primary hover:underline font-bold text-foreground"
              >
                Sign up as Patient
              </Link>
              <span>|</span>
              <Link
                href="/auth/signup/doctor"
                className="hover:text-primary hover:underline font-bold text-foreground"
              >
                Sign up as Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
