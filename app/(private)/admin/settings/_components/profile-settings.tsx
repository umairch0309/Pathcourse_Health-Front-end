"use client"
import { useEffect, useRef, useState } from "react"
import { Camera } from "lucide-react"
import z from "zod"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import auth from "@/lib/auth"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

type UpdateProfileRequest = {
  name?: string
  image?: string | null
  phone?: string | null
}

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [user, setUser] = useState<{
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const underlineInputClass =
    "flex h-9 w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary"

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  const initials = (user?.name || "Admin")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const { onRequest, isPending } = useApi<UpdateProfileRequest>({
    key: "update-admin-profile",
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
  }

  const handleSubmit = (data: ProfileFormData) => {
    const requestData: UpdateProfileRequest = {
      name: data.name,
      image: data.image || null,
    }

    onRequest({
      path: "/api/admin/profile",
      data: requestData,
      onSuccess: async () => {
        setIsEditOpen(false)
        // Refresh session to get updated user data
        try {
          const session = await auth.getSession()
          if (session.data?.user) {
            setUser(session.data.user)
          }
        } catch (error) {
          console.error("Failed to refresh session:", error)
        }
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
                    previewUrl ?? user?.image ?? "/avatar.svg?height=96&width=96"
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
                  {user?.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Email</div>
                <div className="text-muted-foreground border-b pb-2">
                  {user?.email || "—"}
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
              </div>
              <div className="space-y-6">
                <div className="border-b p-2 text-sm">{user?.name || "—"}</div>
                <div className="border-b p-2 text-sm">{user?.email || "—"}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
              disabled={isLoadingSession}
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
              name: user?.name || "",
              image: user?.image || "",
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

                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground text-sm"
                  >
                    Email
                  </Typography>
                  <div className="text-muted-foreground border-b pb-2 text-sm">
                    {user?.email || "—"}
                  </div>
                </div>

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

