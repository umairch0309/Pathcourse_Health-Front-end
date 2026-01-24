"use client"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"

const addDoctorSchema = z
  .object({
    specialistName: z.string().min(1, "Specialist name is required"),
    email: z.string().email("Invalid email address"),
    professionalEmail: z
      .string()
      .email("Invalid professional email address")
      .min(1, "Professional email is required"),
    contactNo: z.string().min(1, "Contact number is required"),
    professionalContact: z.string().min(1, "Professional contact is required"),
    secondaryContact: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    credentialsEmail: z.string().email("Invalid email address").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type AddDoctorFormData = z.infer<typeof addDoctorSchema>

type CreateDoctorRequest = {
  name: string
  email: string
  password: string
  professional_email: string
  professional_contact: string
  secondary_contact?: string
  phone?: string
}

export default function AddDoctorForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showInvitationModal, setShowInvitationModal] = useState(false)

  const { onRequest: createDoctor, isPending: isCreating } =
    useApi<CreateDoctorRequest>({
      key: "create-doctor",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  const handleCancel = () => {
    router.back()
  }

  const handleSubmit = (data: AddDoctorFormData) => {
    const requestData: CreateDoctorRequest = {
      name: data.specialistName,
      email: data.email,
      password: data.password,
      professional_email: data.professionalEmail,
      professional_contact: data.professionalContact,
      secondary_contact: data.secondaryContact || undefined,
      phone: data.phone || undefined,
    }

    createDoctor({
      path: "/api/admin/doctors",
      data: requestData,
      onSuccess: () => {
        setShowInvitationModal(true)
        // Note: In a real application, you would send credentials to credentialsEmail
        // This email sending functionality should be implemented separately
      },
    })
  }

  const handleModalClose = () => {
    setShowInvitationModal(false)
    router.push("/admin/specialists")
  }

  return (
    <>
      <div>
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Add Specialist
        </Typography>
        <div className=" bg-background p-6 rounded-md">
          <div>
            <FormModified
              schema={addDoctorSchema}
              onSubmit={handleSubmit}
              defaultValues={{
                specialistName: "",
                email: "",
                professionalEmail: "",
                contactNo: "",
                professionalContact: "",
                secondaryContact: "",
                phone: "",
                password: "",
                confirmPassword: "",
                credentialsEmail: "",
              }}
            >
              {({ components }) => (
                <div className="space-y-6">
                  <div>
                    <Typography
                      variant="p"
                      className="font-bold text-foreground mb-2"
                    >
                      Specialist Info
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <components.Input
                        name="specialistName"
                        label="Specialist name"
                        placeholder="Specialist Name"
                      />
                      <components.Input
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                      />
                      <components.Input
                        name="professionalEmail"
                        label="Professional Email"
                        type="email"
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <components.Input
                        name="professionalContact"
                        label="Professional Contact"
                        placeholder="(321) 123-456"
                      />
                      <components.Input
                        name="contactNo"
                        label="Phone (Optional)"
                        placeholder="(321) 123-456"
                      />
                      <components.Input
                        name="secondaryContact"
                        label="Secondary Contact (Optional)"
                        placeholder="(321) 123-457"
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                      <components.Field name="password" label="Password">
                        {(field) => (
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
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
                      <components.Field
                        name="confirmPassword"
                        label="Confirm password"
                      >
                        {(field) => (
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="confirm password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
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
                  </div>

                  <div>
                    <Typography
                      variant="p"
                      className="font-bold text-foreground mb-2"
                    >
                      Send Credentials On
                    </Typography>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <components.Input
                        name="credentialsEmail"
                        placeholder="Specialist personal email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <Loader size="lg" color="white" />
                      ) : (
                        "Create Doctor"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </FormModified>
          </div>
        </div>
      </div>
      <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Invitation Sent
            </DialogTitle>
          </DialogHeader>
          <Typography variant="span" className="mb-4 lg:mb-6 text-foreground">
            Invitation sent has been to successfully to the Doctor.
          </Typography>
          <DialogFooter>
            <Button onClick={handleModalClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
