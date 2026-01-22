"use client"
import { format, parse } from "date-fns"
import { Calendar1, Camera } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
import auth from "@/lib/auth"
import { cn } from "@/lib/utils"

type PatientProfile = {
  id: string
  userId: string
  gender: string | null
  dateOfBirth: string | null
  phone: string | null
  address: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    employeeCode: string | null
    isAnonymous: boolean
  }
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(), // YYYY-MM-DD
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

type UpdateProfileRequest = {
  name?: string
  image?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  phone?: string | null
  address?: string | null
}

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sessionUser, setSessionUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const underlineInputClass =
    "flex h-9 w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary"

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setSessionUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  // Fetch patient profile (user + userInfo)
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useFetch<PatientProfile>({
    path: "/api/patient/profile",
    queryKey: ["patient-profile", "current"],
    config: {
      enabled: !isLoadingSession && !!sessionUser,
      retry: false,
    },
  })

  const user = profileData?.user ?? {
    id: "",
    name: null,
    email: null,
    image: null,
    role: "patient",
    employeeCode: null,
    isAnonymous: false,
  }

  const userInfo = profileData
    ? {
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        phone: profileData.phone,
        address: profileData.address,
      }
    : {
        gender: null,
        dateOfBirth: null,
        phone: null,
        address: null,
      }

  const initials = (user.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const { onRequest, isPending } = useApi<UpdateProfileRequest>({
    key: "update-patient-profile",
    showSuccessToast: true,
    showErrorToast: true,
    method: "put",
  })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    // NOTE: image upload to get a permanent URL should be handled separately.
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—"
    try {
      return format(new Date(dateString), "PPP")
    } catch {
      return dateString
    }
  }

  const handleSubmit = (data: ProfileFormData) => {
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
      name: data.name,
      image: data.image || null,
      gender: data.gender || null,
      dateOfBirth: dateOfBirthISO,
      phone: data.phone || null,
      address: data.address || null,
      // image can be passed here once you have a real URL from an uploader
    }

    onRequest({
      path: "/api/user/profile",
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
                  src={
                    previewUrl ?? user.image ?? "/avatar.svg?height=96&width=96"
                  }
                  alt="Profile photo"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="default"
                className="absolute -bottom-1 -right-1 size-10 rounded-full p-0 border-2 border-background"
                onClick={handlePickImage}
              >
                <Camera className="h-5 w-5 text-foreground" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
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
                  {user.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Email</div>
                <div className="text-muted-foreground border-b pb-2">
                  {user.email || "—"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Date of birth</div>
                <div className="text-muted-foreground border-b pb-2">
                  {formatDate(userInfo.dateOfBirth ?? null)}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Gender</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo.gender || "—"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Address</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo.address || "—"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Phone</div>
                <div className="text-muted-foreground border-b pb-2">
                  {userInfo.phone || "—"}
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
              </div>
              <div className="space-y-6">
                <div className="border-b p-2 text-sm">{user.name || "—"}</div>
                <div className="border-b p-2 text-sm">{user.email || "—"}</div>
                <div className="border-b p-2 text-sm">
                  {formatDate(userInfo.dateOfBirth ?? null)}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo.gender || "—"}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo.address || "—"}
                </div>
                <div className="border-b p-2 text-sm">
                  {userInfo.phone || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
              disabled={isLoading}
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <FormModified
            schema={profileSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              name: user.name || "",
              image: user.image || "",
              gender: userInfo.gender || "",
              dateOfBirth: userInfo.dateOfBirth
                ? format(new Date(userInfo.dateOfBirth), "yyyy-MM-dd")
                : "",
              phone: userInfo.phone || "",
              address: userInfo.address || "",
            }}
          >
            {({ components }) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground text-sm"
                  >
                    Profile Image
                  </Typography>
                  <components.S3FileUpload
                    name="image"
                    singleItem
                    fileType="images"
                    maxSize={50 * 1024 * 1024}
                    placeholder="Upload profile image (Max 50MB)"
                  />
                </div>

                <components.Input
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  className={underlineInputClass}
                  required
                />

                <components.Field
                  name="dateOfBirth"
                  label="Date of Birth"
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

                <components.Field
                  name="gender"
                  label="Gender"
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
                      </SelectContent>
                    </Select>
                  )}
                </components.Field>

                <components.Input
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone number"
                  className={underlineInputClass}
                />

                <components.Input
                  name="address"
                  label="Address"
                  placeholder="Enter your address"
                  className={underlineInputClass}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader color="white" /> : "Save Changes"}
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
