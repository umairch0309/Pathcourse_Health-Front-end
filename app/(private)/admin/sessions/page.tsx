"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import { useFetch } from "@/hooks/use-fetch"

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

type AppointmentsResponse = {
  appointments: Appointment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type TableAppointment = {
  id: string
  user: {
    name: string
    image: string | null
  }
  doctor: {
    name: string
    image: string | null
  }
  date: string
  time: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  issue: string
}

const columns: Column<TableAppointment>[] = [
  {
    key: "user",
    header: "Patient",
    render: (row) => {
      const initials = row.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={row.user.image || undefined}
              alt={row.user.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{row.user.name}</span>
        </div>
      )
    },
  },
  {
    key: "doctor",
    header: "Doctor",
    render: (row) => {
      const initials = row.doctor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={row.doctor.image || undefined}
              alt={row.doctor.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{row.doctor.name}</span>
        </div>
      )
    },
  },
  {
    key: "date",
    header: "Date",
  },
  {
    key: "time",
    header: "Time",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const statusColors = {
        BOOKED: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        NO_SHOW: "bg-red-100 text-red-800",
      }
      return (
        <Badge
          className={statusColors[row.status] || "bg-gray-100 text-gray-800"}
        >
          {row.status.replace("_", " ")}
        </Badge>
      )
    },
  },
]

const filters: FilterConfig[] = [
  {
    label: "Status",
    key: "status",
    options: [
      { label: "All", value: "all" },
      { label: "Booked", value: "BOOKED" },
      { label: "Completed", value: "COMPLETED" },
      { label: "No Show", value: "NO_SHOW" },
    ],
  },
  {
    label: "Sort by",
    key: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
    ],
  },
]

export default function SessionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const router = useRouter()

  const appointmentsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    if (statusFilter && statusFilter !== "all") {
      params.append("status", statusFilter)
    }
    return `/api/admin/appointments?${params.toString()}`
  }, [currentPage, statusFilter])

  const { data: appointmentsData, isLoading } = useFetch<AppointmentsResponse>({
    path: appointmentsPath,
    queryKey: ["admin-appointments", currentPage, statusFilter],
  })

  const transformedAppointments = useMemo(() => {
    if (!appointmentsData?.appointments) return []
    return appointmentsData.appointments.map((appointment) => {
      const scheduledDate = appointment.scheduledAt
        ? new Date(appointment.scheduledAt)
        : new Date(appointment.createdAt)

      const dateStr = scheduledDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      const timeStr = appointment.scheduledAt
        ? scheduledDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "Not scheduled"

      return {
        id: appointment.id,
        user: {
          name: appointment.patient.name,
          image: appointment.patient.image,
        },
        doctor: {
          name: appointment.doctor.name,
          image: appointment.doctor.image,
        },
        date: dateStr,
        time: timeStr,
        status: appointment.status,
        issue: appointment.issue,
      }
    })
  }, [appointmentsData])

  const actions: ActionMenuItem<TableAppointment>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/sessions/${row.id}` as never)
      },
    },
  ]

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value)
      setCurrentPage(1) // Reset to first page when filter changes
    }
  }

  return (
    <div className="w-full">
      <DataTable
        data={transformedAppointments}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        title="Sessions"
        isLoading={isLoading}
        filterValues={{ status: statusFilter || "all" }}
        onFilterChange={handleFilterChange}
        pagination={
          appointmentsData?.pagination
            ? {
                currentPage: appointmentsData.pagination.page,
                totalPages: appointmentsData.pagination.totalPages,
                onPageChange: (page) => setCurrentPage(page),
              }
            : undefined
        }
      />
    </div>
  )
}
