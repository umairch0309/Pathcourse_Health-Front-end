"use client"

import { useParams } from "next/navigation"
import { Loader } from "@/components/loader"
import { Typography } from "@/components/ui/typography"
import { Card, CardContent } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { DetailsTabs } from "./_components/tabs"

type Appointment = {
  id: string
  doctorId: string
  patientId: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
  chatroomExpiry: string | null
  age: number | null
  appointmentFor: string
  issue: string
  uploadId: string | null
  relationWithPatient: string | null
  patientName: string | null
  patientAge: number | null
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    phone: string | null
    role: string | null
    isAnonymous: boolean | null
    employeeCode: string | null
    enterpriseCode: string | null
    banned: boolean | null
    onboardingStage: string | null
    createdAt: string
  }
  patient: {
    id: string
    name: string
    email: string
    image: string | null
    phone: string | null
    role: string | null
    isAnonymous: boolean | null
    employeeCode: string | null
    enterpriseCode: string | null
    banned: boolean | null
    onboardingStage: string | null
    createdAt: string
  }
  appointmentNotes: {
    id: string
    appointmentId: string
    doctorId: string
    notes: string
    createdAt: string
    updatedAt: string
  } | null
  sessionReason: {
    id: string
    appointmentId: string
    reason: string
    createdAt: string
    updatedAt: string
  } | null
}

export default function SessionDetailsPage() {
  const params = useParams()
  const appointmentId = params.id as string

  const { data: appointment, isLoading } = useFetch<Appointment>({
    path: `/api/admin/appointments/${appointmentId}`,
    queryKey: ["admin-appointment", appointmentId],
  })

  if (isLoading) {
    return (
      <main className="space-y-4 w-full">
        <Typography variant="h5" className="font-bold text-foreground">
          Session Details
        </Typography>
        <Card className="bg-background w-full">
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader size="sm" />
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!appointment) {
    return (
      <main className="space-y-4 w-full">
        <Typography variant="h5" className="font-bold text-foreground">
          Session Details
        </Typography>
        <Card className="bg-background w-full">
          <CardContent>
            <Typography variant="p" className="text-foreground">
              Appointment not found
            </Typography>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="space-y-4 w-full">
      <Typography variant="h5" className="font-bold text-foreground">
        Session Details
      </Typography>

      <DetailsTabs appointment={appointment} />
    </main>
  )
}
