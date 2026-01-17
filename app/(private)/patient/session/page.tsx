"use client"

import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  appointmentFor: "self" | "someone else"
  issue: string | null
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

const filters: FilterConfig[] = [
  {
    label: "Status",
    key: "status",
    options: [
      { label: "Booked", value: "BOOKED" },
      { label: "Completed", value: "COMPLETED" },
      { label: "No Show", value: "NO_SHOW" },
    ],
  },
]

export default function SessionsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Build API path with status filter
  const statusParam =
    statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : ""
  const apiPath = `/api/appointments/patient?page=${currentPage}&limit=10${statusParam}`

  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = useFetch<AppointmentsResponse>({
    path: apiPath,
    queryKey: ["patient-appointments", currentPage, statusFilter],
    config: {
      refetchOnWindowFocus: false,
    },
  })

  const appointments = appointmentsData?.appointments || []
  const pagination = appointmentsData?.pagination

  const columns: Column<Appointment>[] = [
    {
      key: "specialist",
      header: "Specialist",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.doctor.image || undefined}
              alt={row.doctor.name}
            />
            <AvatarFallback>{row.doctor.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{row.doctor.name}</span>
        </div>
      ),
    },
    {
      key: "dateTime",
      header: "Date & time",
      render: (row) => (
        <span className="text-sm">
          {format(new Date(row.scheduledAt), "MMM dd, yyyy hh:mm a")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "COMPLETED") {
          return (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
              Completed
            </Badge>
          )
        }
        if (row.status === "NO_SHOW") {
          return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
              No Show
            </Badge>
          )
        }
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            Booked
          </Badge>
        )
      },
    },
  ]

  const actions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/patient/session/${row.id}`)
      },
    },
    {
      label: "View Prescription",
      onClick: (row) => {
        // TODO: Navigate to prescription page
        console.log("View Prescription", row.id)
      },
    },
    {
      label: "Submit Review",
      onClick: (row) => {
        // TODO: Open review modal
        console.log("Submit Review", row.id)
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
        data={appointments}
        columns={columns}
        actions={actions}
        filters={filters}
        filterValues={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Sessions"
        pagination={{
          currentPage: pagination?.page || 1,
          totalPages: pagination?.totalPages || 1,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  )
}
