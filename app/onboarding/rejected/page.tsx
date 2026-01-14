"use client"

import { AlertCircle, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

type DoctorData = {
  id?: string
  userid?: string
  professional_contact?: string
  professional_email?: string
  secondary_contact?: string | null
  isAvailable?: boolean
  isInMeeting?: boolean
  rejectReason?: string | null
  createdAt?: string
  updatedAt?: string
}

export default function RejectedPage() {
  const [user, setUser] = useState<{
    name?: string
    email?: string
    image?: string | null
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
        setIsLoading(false)
      }
    }
    fetchSession()
  }, [])

  // Fetch doctor data to get rejection reason
  const { data: doctorData, isLoading: isLoadingDoctor } = useFetch<DoctorData>(
    {
      path: "/api/doctor",
      queryKey: ["doctor", "current"],
      config: {
        enabled: !isLoading && !!user,
        retry: false,
      },
    }
  )

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading || isLoadingDoctor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader size="lg" variant="spinner" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={32}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  {user?.image && (
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  {user?.name && (
                    <div className="text-sm font-medium">{user.name}</div>
                  )}
                  {user?.email && (
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-xl border bg-card p-8 text-center shadow-lg sm:p-12">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            {/* Heading */}
            <Typography variant="h5" className="mb-4 text-foreground">
              Profile Rejected
            </Typography>

            {/* Description */}
            <Typography
              variant="span"
              className="mb-8 text-xs text-muted-foreground"
            >
              We're sorry, but your profile submission has been rejected. Please
              review the reason below and update your profile accordingly.
            </Typography>

            {/* Rejection Reason Box */}
            {doctorData?.rejectReason && (
              <div className="mb-8 rounded-lg border-l-4 border-destructive bg-destructive/5 p-4 text-left">
                <Typography
                  variant="span"
                  className="mb-2 font-semibold text-destructive"
                >
                  Rejection Reason:
                </Typography>
                <Typography
                  variant="p"
                  className="text-sm text-foreground whitespace-pre-wrap"
                >
                  {doctorData.rejectReason}
                </Typography>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={() => router.push("/onboarding/update-profile")}
              className="w-full sm:w-auto"
              size="lg"
            >
              Update Profile Again
            </Button>

            {/* Footer Message */}
            <Typography
              variant="span"
              className="mt-6 block text-sm text-muted-foreground"
            >
              If you have any questions, please contact our support team.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
