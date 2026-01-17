"use client"

import { useParams } from "next/navigation"
import { Typography } from "@/components/ui/typography"
import { DetailsTabs } from "./_components/tabs"
import { useFetch } from "@/hooks/use-fetch"
import { Loader } from "@/components/loader"

type AppointmentData = {
  id: string
  doctorId: string
  patientId: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
  appointmentFor: "self" | "someone else"
  issue: string | null
  age: number | null
  patientName: string | null
  patientAge: number | null
  relationWithPatient: string | null
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    doctor: {
      professional_email: string
      professional_contact: string
      about: string | null
    }
  }
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    userInfo: {
      id: string
      userId: string
      gender: string | null
      dateOfBirth: string | null
      phone: string | null
      address: string | null
    }
  }
}

export default function Page() {
  const params = useParams()
  const appointmentId = params.id as string

  const { data: appointment, isLoading, error } = useFetch<AppointmentData>({
    path: appointmentId ? `/api/appointment/${appointmentId}/full` : "",
    queryKey: ["appointment", appointmentId, "full"],
    config: {
      enabled: !!appointmentId,
      refetchOnWindowFocus: false,
    },
  })

  return (
    <main className="space-y-4 w-full">
      <Typography variant="h5" className="font-bold text-foreground">
        Session Details
      </Typography>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error || !appointment ? (
        <div className="flex items-center justify-center py-12">
          <Typography variant="p" className="text-muted-foreground">
            Failed to load appointment details. Please try again.
          </Typography>
        </div>
      ) : (
        <DetailsTabs appointment={appointment} />
      )}
    </main>
  )
}
