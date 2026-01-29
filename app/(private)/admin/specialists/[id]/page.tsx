"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Ban, CheckCircle, Unlock } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

type ApprovedDoctor = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    phone: string | null
    banned: boolean
    banReason: string | null
    banExpires: string | null
    onboardingStage: string
    createdAt: string
  }
  documents: {
    id: string
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  } | null
  education: Array<{
    id: string
    degree: string
    institution_name: string
    startYear: string
    endYear: string
    document: string | null
  }>
  professionalExperience: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type ApprovedDoctorsResponse = {
  doctors: ApprovedDoctor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function DoctorInfo() {
  const params = useParams()
  const queryClient = useQueryClient()
  const doctorId = params.id as string
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [banReason, setBanReason] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
          setUserRole(session.data.user.role || null)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
  }, [])

  // Get user permissions
  const { hasPermission } = useUserPermissions(userId, userRole)

  // Fetch all approved doctors to find the specific one
  const {
    data: approvedDoctorsData,
    isLoading,
    refetch,
  } = useFetch<ApprovedDoctorsResponse>({
    path: `/api/admin/doctors/approved?page=1&limit=100`,
    queryKey: ["approved-doctor-detail", doctorId],
  })

  const doctor = approvedDoctorsData?.doctors.find((d) => d.id === doctorId)

  // Block/Unblock APIs
  const { onRequest: blockDoctor, isPending: isBlocking } = useApi<{
    banReason?: string
  }>({
    key: "block-doctor-detail",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const { onRequest: unblockDoctor, isPending: isUnblocking } = useApi<
    Record<string, never>
  >({
    key: "unblock-doctor-detail",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleBlock = () => {
    blockDoctor({
      path: `/api/admin/doctors/${doctorId}/block`,
      data: { banReason: banReason.trim() || undefined },
      onSuccess: () => {
        setBlockDialogOpen(false)
        setBanReason("")
        queryClient.invalidateQueries({ queryKey: ["approved-doctors"] })
        queryClient.invalidateQueries({ queryKey: ["approved-doctor-detail"] })
        refetch()
      },
    })
  }

  const handleUnblock = () => {
    unblockDoctor({
      path: `/api/admin/doctors/${doctorId}/unblock`,
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approved-doctors"] })
        queryClient.invalidateQueries({ queryKey: ["approved-doctor-detail"] })
        refetch()
      },
    })
  }

  if (!doctor && !isLoading) {
    return (
      <main className="min-h-screen space-y-4">
        <Typography variant="h5" className="font-bold text-foreground mb-6">
          Specialist Details
        </Typography>
        <Card className="rounded-2xl w-full py-4 bg-background">
          <CardContent>
            <Typography variant="p" className="text-foreground">
              Doctor not found
            </Typography>
          </CardContent>
        </Card>
      </main>
    )
  }

  const initials = doctor?.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className="min-h-screen space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h5" className="font-bold text-foreground">
          Specialist Details
        </Typography>
        {doctor && hasPermission("specialists.block_unblock") && (
          <div className="flex gap-2">
            {doctor.user.banned ? (
              <Button
                variant="outline"
                onClick={handleUnblock}
                disabled={isUnblocking}
                className="gap-2"
              >
                <Unlock className="h-4 w-4" />
                {isUnblocking ? "Unblocking..." : "Unblock Doctor"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setBlockDialogOpen(true)}
                className="gap-2"
              >
                <Ban className="h-4 w-4" />
                Block Doctor
              </Button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <Card className="rounded-2xl w-full py-4 bg-background">
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader size="sm" />
            </div>
          </CardContent>
        </Card>
      ) : !doctor ? (
        <Card className="rounded-2xl w-full py-4 bg-background">
          <CardContent>
            <Typography variant="p" className="text-foreground">
              Doctor not found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="rounded-2xl w-full py-4 bg-background">
            <CardContent>
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="mx-auto lg:h-[300px] lg:w-[500px] h-[250px] w-[250px] overflow-hidden rounded-xl md:mx-0 relative bg-muted">
                  {doctor.user.image ? (
                    <Image
                      src={doctor.user.image}
                      alt={doctor.user.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar className="h-full w-full rounded-xl">
                        <AvatarFallback className="text-4xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
                <div className="space-y-3 flex-1">
                  <Typography
                    variant="h6"
                    className="font-bold text-foreground"
                  >
                    {doctor.user.name}
                  </Typography>
                  {doctor.professionalExperience?.profession && (
                    <div>
                      <Badge
                        variant="default"
                        className="gap-1.5 px-4 py-2 rounded-full bg-accent text-foreground"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{doctor.professionalExperience.profession}</span>
                      </Badge>
                    </div>
                  )}
                  {doctor.user.banned && (
                    <Badge variant="destructive" className="gap-1.5 px-4 py-2">
                      <Ban className="h-4 w-4" />
                      <span>Blocked</span>
                    </Badge>
                  )}
                  <div className="space-y-1">
                    <Typography
                      variant="p"
                      className="text-sm text-muted-foreground"
                    >
                      <strong>Email:</strong> {doctor.user.email}
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-sm text-muted-foreground"
                    >
                      <strong>Professional Email:</strong>{" "}
                      {doctor.professional_email}
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-sm text-muted-foreground"
                    >
                      <strong>Contact:</strong> {doctor.professional_contact}
                    </Typography>
                    {doctor.secondary_contact && (
                      <Typography
                        variant="p"
                        className="text-sm text-muted-foreground"
                      >
                        <strong>Secondary Contact:</strong>{" "}
                        {doctor.secondary_contact}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl w-full bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {doctor.professionalExperience?.languages &&
                doctor.professionalExperience.languages.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-xs font-medium tracking-wide text-primary">
                        Languages:
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.professionalExperience.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

              {doctor.professionalExperience?.special_interest_area && (
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-primary">
                    Special interest area:
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {doctor.professionalExperience.special_interest_area}
                  </div>
                </div>
              )}

              {doctor.professionalExperience?.age_group && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium tracking-wide text-primary">
                      Age Group:
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {doctor.professionalExperience.age_group}
                    </div>
                  </div>
                </div>
              )}

              {doctor.education && doctor.education.length > 0 && (
                <div className="space-y-4">
                  <div className="text-xs font-medium tracking-wide text-primary">
                    Education:
                  </div>
                  <div className="space-y-2">
                    {doctor.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="text-sm text-muted-foreground"
                      >
                        <strong>{edu.degree}</strong> - {edu.institution_name} (
                        {new Date(edu.startYear).getFullYear()} -{" "}
                        {new Date(edu.endYear).getFullYear()})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.user.banned && doctor.user.banReason && (
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-destructive">
                    Ban Reason:
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {doctor.user.banReason}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this doctor? They will not be able
              to access the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="ban-reason" className="text-sm font-medium">
                Ban Reason (Optional)
              </label>
              <Textarea
                id="ban-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for blocking..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBlockDialogOpen(false)
                setBanReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlock}
              disabled={isBlocking}
            >
              {isBlocking ? "Blocking..." : "Block Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
