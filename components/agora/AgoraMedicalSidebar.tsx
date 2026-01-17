"use client"

import { ChevronRight, Stethoscope } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"
import { cn } from "@/lib/utils"

type AgoraMedicalSidebarProps = {
  isOpen: boolean
  onClose: () => void
  appointmentId?: string | null
}

type AppointmentInfo = {
  id?: string
  _id?: string
  patient?: {
    id: string
    first_name?: string
    last_name?: string
    name?: string | null
    email?: string | null
    image?: string | null
    date_of_birth?: string
    gender?: string
    isAnonymous?: boolean
    employeeCode?: string | null
    userInfo?: {
      gender?: string | null
      dateOfBirth?: string | null
    }
  }
  doctor?: {
    id: string
    name?: string
    email?: string
    image?: string | null
  }
  service?: {
    name: string
  }
  appointmentDate?: string
  appointmentTime?: string
  scheduledAt?: string
  status?: string
  description?: string
  patientId?: string
  doctorId?: string
  appointmentFor?: "self" | "someone else"
}

export function AgoraMedicalSidebar({
  isOpen,
  onClose,
  appointmentId,
}: AgoraMedicalSidebarProps) {
  const [currentUser, setCurrentUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  // Fetch current user session to determine role
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setCurrentUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  const { data: appointment, isLoading } = useFetch<AppointmentInfo>({
    path: appointmentId ? `/api/appointment/${appointmentId}` : "",
    queryKey: ["appointment", appointmentId],
    config: {
      enabled: !!appointmentId && !isLoadingSession,
      refetchOnWindowFocus: false,
    },
  })

  // Determine if current user is viewing their own data
  const isPatient = currentUser?.role === "patient"
  const isViewingOwnData =
    isPatient && appointment?.patientId === currentUser?.id

  // Helper function to get patient display info
  const getPatientDisplayInfo = () => {
    if (!appointment?.patient) return null

    const patient = appointment.patient
    const isAnonymous = patient.isAnonymous && !isViewingOwnData

    // If patient is anonymous and doctor is viewing, show employee code
    if (isAnonymous) {
      return {
        name: patient.employeeCode || "—",
        email: null,
        dateOfBirth: null,
        gender: null,
      }
    }

    return {
      name:
        patient.name ||
        (patient.first_name && patient.last_name
          ? `${patient.first_name} ${patient.last_name}`
          : null),
      email: patient.email,
      dateOfBirth: patient.date_of_birth || patient.userInfo?.dateOfBirth,
      gender: patient.gender || patient.userInfo?.gender,
    }
  }

  const patientInfo = getPatientDisplayInfo()
  if (isLoading) {
    return (
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-90 md:w-[30rem] lg:w-[40rem] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-center h-full">
          <Typography variant="p" className="text-muted-foreground">
            Loading appointment info...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-90 md:w-[30rem] lg:w-[40rem] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation()
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-[var(--secondary)]/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--sidebar-foreground)] flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Appointment Info
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--secondary)]/70"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
              <h3 className="font-semibold mb-3 text-gray-900">
                Appointment Details
              </h3>
              <div className="space-y-3 text-sm">
                {/* Patient Info */}
                {patientInfo && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient:</span>
                      <span className="font-medium text-gray-900">
                        {patientInfo.name || "—"}
                      </span>
                    </div>
                    {patientInfo.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {patientInfo.email}
                        </span>
                      </div>
                    )}
                    {patientInfo.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(
                            patientInfo.dateOfBirth
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {patientInfo.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium text-gray-900">
                          {patientInfo.gender}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Doctor Info - Only show to patients */}
                {isPatient && appointment?.doctor && (
                  <>
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium text-gray-900">
                        {appointment.doctor.name || "—"}
                      </span>
                    </div>
                    {appointment.doctor.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {appointment.doctor.email}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {appointment?.appointmentFor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment For:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {appointment.appointmentFor.replace("_", " ")}
                    </span>
                  </div>
                )}
                {(appointment?.appointmentDate || appointment?.scheduledAt) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(
                        appointment.appointmentDate ||
                          appointment.scheduledAt ||
                          ""
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {appointment?.appointmentTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">
                      {appointment.appointmentTime}
                    </span>
                  </div>
                )}
                {appointment?.status && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">
                      {appointment.status}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {appointment?.description && (
              <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Description
                </h3>
                <p className="text-sm text-gray-700">
                  {appointment.description}
                </p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
