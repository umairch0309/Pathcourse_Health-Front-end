"use client"

import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
} from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  updatedAt: string
  appointmentFor: "self" | "someone else"
  issue: string | null
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    isAnonymous: boolean
    employeeCode: string | null
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

type AppointmentsResponse = {
  appointments: Appointment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function SessionsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<
    "available" | "attended" | "no-show"
  >("available")

  // Fetch available appointments (BOOKED status)
  const {
    data: availableData,
    isLoading: isLoadingAvailable,
    error: errorAvailable,
    refetch: refetchAvailable,
  } = useFetch<AppointmentsResponse>({
    path: `/api/appointments/doctor?status=BOOKED&page=${currentPage}&limit=10`,
    queryKey: ["doctor-appointments", "BOOKED", currentPage],
    config: {
      enabled: activeTab === "available",
      refetchOnWindowFocus: false,
    },
  })

  // Fetch attended appointments (COMPLETED)
  const {
    data: attendedData,
    isLoading: isLoadingAttended,
    error: errorAttended,
    refetch: refetchAttended,
  } = useFetch<AppointmentsResponse>({
    path: `/api/appointments/doctor?status=COMPLETED&page=${currentPage}&limit=10`,
    queryKey: ["doctor-appointments", "COMPLETED", currentPage],
    config: {
      enabled: activeTab === "attended",
      refetchOnWindowFocus: false,
    },
  })

  // Fetch no-show appointments (NO_SHOW)
  const {
    data: noShowData,
    isLoading: isLoadingNoShow,
    error: errorNoShow,
    refetch: refetchNoShow,
  } = useFetch<AppointmentsResponse>({
    path: `/api/appointments/doctor?status=NO_SHOW&page=${currentPage}&limit=10`,
    queryKey: ["doctor-appointments", "NO_SHOW", currentPage],
    config: {
      enabled: activeTab === "no-show",
      refetchOnWindowFocus: false,
    },
  })

  const appointments =
    activeTab === "available"
      ? availableData?.appointments || []
      : activeTab === "attended"
        ? attendedData?.appointments || []
        : noShowData?.appointments || []
  const pagination =
    activeTab === "available"
      ? availableData?.pagination
      : activeTab === "attended"
        ? attendedData?.pagination
        : noShowData?.pagination
  const isLoading =
    activeTab === "available"
      ? isLoadingAvailable
      : activeTab === "attended"
        ? isLoadingAttended
        : isLoadingNoShow
  const error =
    activeTab === "available"
      ? errorAvailable
      : activeTab === "attended"
        ? errorAttended
        : errorNoShow
  const refetch =
    activeTab === "available"
      ? refetchAvailable
      : activeTab === "attended"
        ? refetchAttended
        : refetchNoShow

  const availableColumns: Column<Appointment>[] = [
    {
      key: "user",
      header: "Patient",
      render: (row) => {
        // If name, email, and image are all null/empty, treat as anonymous and show employee code
        const isAnonymous =
          row.patient.isAnonymous ||
          (!row.patient.name && !row.patient.email && !row.patient.image)
        const displayName = isAnonymous
          ? row.patient.employeeCode || "—"
          : row.patient.name || "—"

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={row.patient.image || undefined}
                alt={displayName}
              />
              <AvatarFallback>
                {(displayName !== "—" ? displayName : "P")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{displayName}</span>
          </div>
        )
      },
    },
    {
      key: "sessionFor",
      header: "Session for",
      render: (row) => (
        <span className="capitalize">
          {row.appointmentFor.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "scheduledAt",
      header: "Scheduled",
      render: (row) => (
        <span className="text-sm">
          {format(new Date(row.scheduledAt), "MMM dd, yyyy hh:mm a")}
        </span>
      ),
    },
    {
      key: "sessionLink",
      header: "Session Link",
      render: (row) => (
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          onClick={() => {
            router.push(
              `/specialist/session/join-session/video-call?appointmentId=${row.id}`
            )
          }}
        >
          Join Now
        </Button>
      ),
    },
  ]

  const attendedColumns: Column<Appointment>[] = [
    {
      key: "user",
      header: "Patient",
      render: (row) => {
        // If name, email, and image are all null/empty, treat as anonymous and show employee code
        const isAnonymous =
          row.patient.isAnonymous ||
          (!row.patient.name && !row.patient.email && !row.patient.image)
        const displayName = isAnonymous
          ? row.patient.employeeCode || "—"
          : row.patient.name || "—"

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={row.patient.image || undefined}
                alt={displayName}
              />
              <AvatarFallback>
                {(displayName !== "—" ? displayName : "P")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{displayName}</span>
          </div>
        )
      },
    },
    {
      key: "sessionFor",
      header: "Session for",
      render: (row) => (
        <span className="capitalize">
          {row.appointmentFor.replace("_", " ")}
        </span>
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
      render: (row) => (
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
          {row.status.replace("_", " ")}
        </span>
      ),
    },
  ]

  const noShowColumns: Column<Appointment>[] = [
    {
      key: "user",
      header: "Patient",
      render: (row) => {
        // If name, email, and image are all null/empty, treat as anonymous and show employee code
        const isAnonymous =
          row.patient.isAnonymous ||
          (!row.patient.name && !row.patient.email && !row.patient.image)
        const displayName = isAnonymous
          ? row.patient.employeeCode || "—"
          : row.patient.name || "—"

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={row.patient.image || undefined}
                alt={displayName}
              />
              <AvatarFallback>
                {(displayName !== "—" ? displayName : "P")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{displayName}</span>
          </div>
        )
      },
    },
    {
      key: "sessionFor",
      header: "Session for",
      render: (row) => (
        <span className="capitalize">
          {row.appointmentFor.replace("_", " ")}
        </span>
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
      render: (row) => (
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">
          {row.status.replace("_", " ")}
        </span>
      ),
    },
  ]

  const availableActions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/specialist/session/${row.id}`)
      },
    },
  ]

  const attendedActions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/specialist/session/${row.id}`)
      },
    },
  ]

  const noShowActions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/specialist/session/${row.id}`)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Sessions
      </h2>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "available" | "attended" | "no-show")
          setCurrentPage(1) // Reset to first page when switching tabs
        }}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="space-x-4">
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="available"
            >
              Available
            </TabsTrigger>
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="attended"
            >
              Attended
            </TabsTrigger>
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="no-show"
            >
              No Show
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="mt-0">
          <DataTable
            data={appointments}
            columns={availableColumns}
            actions={availableActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            pagination={{
              currentPage: pagination?.page || 1,
              totalPages: pagination?.totalPages || 1,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>

        <TabsContent value="attended" className="mt-0">
          <DataTable
            data={appointments}
            columns={attendedColumns}
            actions={attendedActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            pagination={{
              currentPage: pagination?.page || 1,
              totalPages: pagination?.totalPages || 1,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>

        <TabsContent value="no-show" className="mt-0">
          <DataTable
            data={appointments}
            columns={noShowColumns}
            actions={noShowActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            pagination={{
              currentPage: pagination?.page || 1,
              totalPages: pagination?.totalPages || 1,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
