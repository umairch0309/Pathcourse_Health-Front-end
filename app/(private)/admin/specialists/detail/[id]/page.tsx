"use client"

import { BadgeCheck, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "@/components/loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import ContactInfo from "./_components/contact-info"
import ProfessionalDocuments from "./_components/documents"
import EducationInfo from "./_components/education-info"
import ProfessionalExperience from "./_components/professional-experience"

type DoctorRequest = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  rejectReason: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
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
  }>
  professionalExperience: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type DoctorRequestsResponse = {
  doctors: DoctorRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function DoctorDetails() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.id as string
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Fetch all doctor requests to find the specific one
  const { data: doctorRequestsData, isLoading } =
    useFetch<DoctorRequestsResponse>({
      path: `/api/admin/doctor-requests?page=1&limit=100`,
      queryKey: ["doctor-request", doctorId],
    })

  const doctor = doctorRequestsData?.doctors.find((d) => d.id === doctorId)

  // Approve API
  const { onRequest: approveDoctor, isPending: isApproving } = useApi<{
    doctorId: string
  }>({
    key: "approve-doctor",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  // Reject API
  const { onRequest: rejectDoctor, isPending: isRejecting } = useApi<{
    doctorId: string
    rejectReason: string
  }>({
    key: "reject-doctor",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleApprove = () => {
    approveDoctor({
      path: "/api/admin/doctor-requests/approve",
      data: { doctorId },
      onSuccess: () => {
        router.push("/admin/specialists")
      },
    })
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return
    }
    rejectDoctor({
      path: "/api/admin/doctor-requests/reject",
      data: { doctorId, rejectReason },
      onSuccess: () => {
        setRejectDialogOpen(false)
        setRejectReason("")
        router.push("/admin/specialists")
      },
    })
  }

  if (!doctor && !isLoading) {
    return (
      <div className="space-y-6">
        <Typography variant="h5" className="font-bold text-foreground">
          Specialist Info
        </Typography>
        <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6">
          <Typography variant="p" className="text-foreground">
            Doctor not found
          </Typography>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <Typography variant="h5" className="font-bold text-foreground">
        Specialist Info
      </Typography>
      <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        ) : doctor ? (
          <>
            <div className="flex lg:flex-row flex-col gap-6 mb-8">
              <div className="flex-shrink-0 lg:h-[250px] flex justify-center">
                <Image
                  src={doctor.user.image || "/dr-john.jpg"}
                  width={250}
                  height={250}
                  alt={doctor.user.name}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-4 lg:mt-8">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                      {doctor.user.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doctor.professionalExperience && (
                        <Badge
                          variant="default"
                          className="rounded-full text-foreground bg-accent px-3 py-1 flex items-center gap-1"
                        >
                          <BadgeCheck className="w-4 h-4" />
                          {doctor.professionalExperience.profession}
                        </Badge>
                      )}
                      <Badge
                        variant="default"
                        className="rounded-full text-foreground bg-accent px-3 py-1 flex items-center gap-1"
                      >
                        <ClipboardList className="w-4 h-4" />
                        {doctor.id.slice(0, 8)}
                      </Badge>
                    </div>
                    {doctor.professionalExperience && (
                      <div className="text-sm text-foreground/80">
                        {doctor.professionalExperience.special_interest_area}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-row gap-2 w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <>
                      <Loader size="sm" color="white" className="mr-2" />
                      Approving...
                    </>
                  ) : (
                    "Accept Registration"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto bg-background border border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={isApproving || isRejecting}
                >
                  Reject Request
                </Button>
              </div>
            </div>
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger
                  className="text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
                  value="contact"
                >
                  Contact Info
                </TabsTrigger>
                <TabsTrigger
                  className="text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
                  value="education"
                >
                  Educational Info
                </TabsTrigger>
                <TabsTrigger
                  className="text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
                  value="professional"
                >
                  Professional Experience
                </TabsTrigger>
                <TabsTrigger
                  className="text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
                  value="documents"
                >
                  Attached Documents
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contact" className="mt-6">
                <ContactInfo doctor={doctor} />
              </TabsContent>
              <TabsContent value="education" className="mt-6">
                <EducationInfo doctor={doctor} />
              </TabsContent>
              <TabsContent value="professional" className="mt-6">
                <ProfessionalExperience doctor={doctor} />
              </TabsContent>
              <TabsContent value="documents" className="mt-6">
                <ProfessionalDocuments doctor={doctor} />
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Doctor Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this doctor's registration
              request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full min-h-[100px] p-3 border rounded-md resize-none"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectReason("")
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader size="sm" color="white" className="mr-2" />
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
