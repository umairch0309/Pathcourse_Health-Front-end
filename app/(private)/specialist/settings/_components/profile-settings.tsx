"use client"
import { format, parse } from "date-fns"
import { Calendar1 } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { cn } from "@/lib/utils"

type CompleteProfile = {
  doctor: {
    id: string
    userid: string
    professional_contact: string
    professional_email: string
    secondary_contact: string | null
    user: {
      id: string
      name: string
      email: string
      image: string | null
      userInfo: {
        gender: string | null
        dateOfBirth: string | null
        phone: string | null
        address: string | null
      } | null
    }
  }
}

const profileSchema = z.object({
  professional_contact: z.string().min(1, "Professional contact is required"),
  professional_email: z.string().email("Invalid email address"),
  secondary_contact: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(), // Will be YYYY-MM-DD format
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

type UpdateProfileRequest = {
  professional_contact?: string
  professional_email?: string
  secondary_contact?: string | null
  image?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  phone?: string | null
  address?: string | null
}

export default function ProfileSettings() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const underlineInputClass =
    "flex h-9 w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary"

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useFetch<CompleteProfile>({
    path: "/api/doctor/profile/complete",
    queryKey: ["doctor-profile-complete"],
  })

  const { onRequest, isPending } = useApi<UpdateProfileRequest>({
    key: "update-profile",
    showSuccessToast: true,
    showErrorToast: true,
    method: "put",
  })

  const handleSubmit = (data: ProfileFormData) => {
    // Convert dateOfBirth from YYYY-MM-DD to ISO datetime string
    let dateOfBirthISO: string | null = null
    if (data.dateOfBirth) {
      try {
        const date = parse(data.dateOfBirth, "yyyy-MM-dd", new Date())
        dateOfBirthISO = date.toISOString()
      } catch (error) {
        console.error("Failed to parse date:", error)
      }
    }

    const requestData: UpdateProfileRequest = {
      professional_contact: data.professional_contact,
      professional_email: data.professional_email,
      secondary_contact: data.secondary_contact || null,
      image: data.image || null,
      gender: data.gender || null,
      dateOfBirth: dateOfBirthISO,
      phone: data.phone || null,
      address: data.address || null,
    }

    onRequest({
      path: "/api/doctor/profile",
      data: requestData,
      onSuccess: () => {
        setIsEditOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to update profile:", error)
      },
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Profile Settings</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </CardContent>
      </Card>
    )
  }

  if (!profileData) {
    return (
      <Card className="w-full bg-background">
        <CardContent className="py-12">
          <Typography variant="p" className="text-center text-muted-foreground">
            No profile data available
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const doctor = profileData.doctor
  const user = doctor.user
  const userInfo = user.userInfo
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"
    try {
      return format(new Date(dateString), "PPP")
    } catch {
      return dateString
    }
  }

  return (
    <>
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Profile Settings</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:space-y-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Avatar className="size-24 lg:size-30">
                <AvatarImage
                  src={user.image ?? "/avatar.svg?height=96&width=96"}
                  alt="Profile photo"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div>
            <div className="mb-4 lg:mb-6 font-semibold text-foreground">
              General Info
            </div>

            <div className="block lg:hidden space-y-4">
              <div>
                <div className="text-foreground mb-2">Name</div>
                <div className="text-muted-foreground border-b pb-2">
                  {user.name}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Email</div>
                <div className="text-muted-foreground border-b pb-2">
                  {user.email}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Date of birth</div>
                <div className="text-muted-foreground border-b pb-2">
                  {formatDate(userInfo?.dateOfBirth)}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Gender</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo?.gender || "-"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Address</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo?.address || "-"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Phone</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo?.phone || doctor.professional_contact || "-"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">
                  Professional Email
                </div>
                <div className="text-muted-foreground border-b pb-2">
                  {doctor.professional_email}
                </div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2">
              <div className="space-y-6">
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Name
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Email
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Date of birth
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Gender
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Address
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Phone
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Professional Email
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b p-2 text-sm">{user.name}</div>
                <div className="border-b p-2 text-sm">{user.email}</div>
                <div className="border-b p-2 text-sm">
                  {formatDate(userInfo?.dateOfBirth)}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo?.gender || "-"}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo?.address || "-"}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo?.phone || doctor.professional_contact || "-"}
                </div>
                <div className="border-b p-2 text-sm">
                  {doctor.professional_email}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <FormModified
            schema={profileSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              professional_contact: doctor.professional_contact,
              professional_email: doctor.professional_email,
              secondary_contact: doctor.secondary_contact || "",
              image: user.image || "",
              gender: userInfo?.gender || "",
              dateOfBirth: userInfo?.dateOfBirth
                ? format(new Date(userInfo.dateOfBirth), "yyyy-MM-dd")
                : "",
              phone: userInfo?.phone || "",
              address: userInfo?.address || "",
            }}
          >
            {({ components }) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground"
                  >
                    Profile Image
                  </Typography>
                  <components.S3FileUpload
                    name="image"
                    singleItem={true}
                    fileType="images"
                    maxSize={50 * 1024 * 1024} // 50MB
                    placeholder="Upload profile image (Max 50MB)"
                  />
                </div>

                <components.Input
                  name="professional_contact"
                  label="Professional Contact"
                  placeholder="Professional contact number"
                  className={underlineInputClass}
                  required
                />
                <components.Input
                  name="professional_email"
                  label="Professional Email"
                  type="email"
                  placeholder="Professional email address"
                  className={underlineInputClass}
                  required
                />
                <components.Input
                  name="secondary_contact"
                  label="Secondary Contact (Optional)"
                  placeholder="Secondary contact number"
                  className={underlineInputClass}
                />
                <components.Input
                  name="phone"
                  label="Phone (Optional)"
                  placeholder="Phone number"
                  className={underlineInputClass}
                />
                <components.Field
                  name="gender"
                  label="Gender (Optional)"
                  formItemClassName="space-y-2"
                >
                  {(field) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={cn(
                          underlineInputClass,
                          "justify-between h-9 px-0 py-2"
                        )}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </components.Field>
                <components.Field
                  name="dateOfBirth"
                  label="Date of Birth (Optional)"
                  formItemClassName="space-y-2"
                >
                  {(field) => {
                    const dateValue = field.value
                      ? parse(field.value, "yyyy-MM-dd", new Date())
                      : undefined
                    return (
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-between bg-transparent border-0 border-b border-border rounded-none px-0 py-2 h-9 w-full text-left font-normal",
                              !dateValue && "text-muted-foreground/60"
                            )}
                          >
                            <span className="truncate">
                              {dateValue
                                ? format(dateValue, "PPP")
                                : "Select date of birth"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setCalendarOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                </components.Field>
                <components.Input
                  name="address"
                  label="Address (Optional)"
                  placeholder="Address"
                  className={underlineInputClass}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </FormModified>
        </DialogContent>
      </Dialog>
    </>
  )
}
