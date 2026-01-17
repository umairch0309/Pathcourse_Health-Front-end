"use client"
import { Camera } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

type UserInfo = {
  name: string | null
  email: string | null
  phone?: string | null
  gender?: string | null
  address?: string | null
}

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [user, setUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

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

  // Fetch user info
  const { data: userInfoData } = useFetch<{ user: UserInfo }>({
    path: "/api/user/info",
    queryKey: ["user-info", "current"],
    config: {
      enabled: !isLoadingSession && !!user,
      retry: false,
    },
  })

  const userInfo = userInfoData?.user || {
    name: null,
    email: null,
    phone: null,
    gender: null,
    address: null,
  }

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

  return (
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
                src={previewUrl ?? "/avatar.svg?height=96&width=96"}
                alt="Profile photo"
              />
              <AvatarFallback>EA</AvatarFallback>
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
                {userInfo.name || "—"}
              </div>
            </div>
            <div>
              <div className="text-foreground mb-2">Email</div>
              <div className="text-muted-foreground border-b pb-2">
                {userInfo.email || "—"}
              </div>
            </div>
            <div>
              <div className="text-foreground mb-2">Date of birth</div>
              <div className="text-muted-foreground border-b pb-2">
                {userInfo.phone || "—"}
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
            </div>
            <div className="space-y-6">
              <div className="border-b p-2 text-sm">{userInfo.name || "—"}</div>
              <div className="border-b p-2 text-sm">
                {userInfo.email || "—"}
              </div>
              <div className="border-b p-2 text-sm">
                {userInfo.phone || "—"}
              </div>
              <div className="border-b p-2 text-sm">
                {userInfo.gender || "—"}
              </div>
              <div className="border-b p-2 text-sm">
                {userInfo.address || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-4">
          <Button className="w-full lg:w-auto">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  )
}
