import { Eye, EyeOff } from "lucide-react"
import { useRef, useState } from "react"
import z from "zod"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const formMethodsRef = useRef<{ reset: () => void } | null>(null)

  const { onRequest, isPending } = useApi<ChangePasswordRequest>({
    key: "change-password",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = (data: ChangePasswordSchema) => {
    const requestData: ChangePasswordRequest = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }

    onRequest({
      path: "/api/auth/change-password",
      data: requestData,
      onSuccess: () => {
        // Reset form after successful password change
        if (formMethodsRef.current) {
          formMethodsRef.current.reset()
        }
      },
      onError: (error) => {
        console.error("Failed to change password:", error)
      },
    })
  }
  return (
    <div className="bg-background rounded-md p-4 space-y-6">
      <Typography variant="p" className="text-foreground font-bold">
        Change Password
      </Typography>
      <FormModified
        schema={changePasswordSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
      >
        {({ components, methods }) => {
          // Store reset method in ref for use in onSuccess callback
          formMethodsRef.current = {
            reset: () => {
              methods.reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
            },
          }
          return (
            <div className="space-y-4">
              <components.Field
                name="currentPassword"
                formItemClassName="space-y-2"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Old password"
                      className="w-full py-2 pr-10 lg:w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute lg:left-88 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </components.Field>

              <components.Field
                name="newPassword"
                formItemClassName="space-y-2"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-full py-2 pr-10 lg:w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute lg:left-88 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </components.Field>

              <components.Field
                name="confirmPassword"
                formItemClassName="space-y-2"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full py-2 pr-10 lg:w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute lg:left-88 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </components.Field>

              <div className="flex justify-end">
                <Button variant="default" type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          )
        }}
      </FormModified>
    </div>
  )
}
