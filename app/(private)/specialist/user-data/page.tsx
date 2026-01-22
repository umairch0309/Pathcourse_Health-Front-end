"use client"

import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetch } from "@/hooks/use-fetch"

type SessionReasonType =
  | "LETTING_OFF_STEAM"
  | "TALKING_THROUGH_STRESS_OR_UNCERTAINTY"
  | "NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD"

type DoctorSessionReasonFullItem = {
  id: string
  doctorId: string
  patientId: string
  status: string
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
  age: number | null
  appointmentFor: string | null
  issue: string | null
  uploadId: string | null
  relationWithPatient: string | null
  patientName: string | null
  patientAge: number | null
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    employeeCode: string | null
  }
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    employeeCode: string | null
  }
  sessionReason: {
    reason: SessionReasonType
    createdAt: string
    updatedAt: string
  }
}

type DoctorSessionReasonFullResponse = {
  appointments: DoctorSessionReasonFullItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type SessionReasonRow = {
  user: string
  avatar?: string | null
  isAnonymous: boolean
  sessionReason: string
  submittedOn: string
  submittedAt: string
}

const columns: Column<SessionReasonRow>[] = [
  {
    key: "user",
    header: "User",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {row.avatar && !row.isAnonymous ? (
            <AvatarImage src={row.avatar} alt={row.user} />
          ) : (
            <AvatarFallback>
              {(row.user || "P").charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {row.user}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "sessionReason",
    header: "Session Reason",
  },
  {
    key: "submittedOn",
    header: "Submitted on",
  },
]

const filters: FilterConfig[] = [
  {
    label: "Session reason",
    key: "sessionReason",
    options: [
      { label: "All reasons", value: "all" },
      {
        label: "Letting Off Steam",
        value: "Letting Off Steam",
      },
      {
        label: "Talking Through Stress or Uncertainty",
        value: "Talking Through Stress or Uncertainty",
      },
      {
        label: "Needing Perspective During a Demanding Period",
        value: "Needing Perspective During a Demanding Period",
      },
    ],
  },
]

const sessionReasonLabels: Record<SessionReasonType, string> = {
  LETTING_OFF_STEAM: "Letting Off Steam",
  TALKING_THROUGH_STRESS_OR_UNCERTAINTY:
    "Talking Through Stress or Uncertainty",
  NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD:
    "Needing Perspective During a Demanding Period",
}

export default function UserDataPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useFetch<DoctorSessionReasonFullResponse>({
    path: `/api/appointments/doctor/session-reasons/full?page=${currentPage}&limit=${limit}`,
    queryKey: ["doctor", "session-reasons-full", currentPage, limit],
  })

  const rows: SessionReasonRow[] =
    historyData?.appointments.map((appointment) => {
      const patient = appointment.patient
      const isAnonymous =
        !patient.name && !patient.email && !!patient.employeeCode

      const user = isAnonymous
        ? patient.employeeCode || ""
        : patient.name || "Unknown patient"

      const submittedOn = appointment.sessionReason.createdAt
        ? new Date(appointment.sessionReason.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )
        : "-"

      return {
        user,
        avatar: patient.image,
        isAnonymous,
        sessionReason: sessionReasonLabels[appointment.sessionReason.reason],
        submittedOn,
        submittedAt: appointment.sessionReason.createdAt,
      }
    }) ?? []

  const totalPages = historyData?.pagination.totalPages ?? 1

  const sortedRows = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
      return bTime - aTime
    })
    return copy
  }, [rows])

  const actions: ActionMenuItem<SessionReasonRow>[] = []

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        User Data
      </h2>

      {/* Session reason history table */}
      <DataTable<SessionReasonRow>
        data={sortedRows}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search by user or reason"
        showAllButton={false}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
        isLoading={isHistoryLoading}
        error={historyError}
      />
    </div>
  )
}
