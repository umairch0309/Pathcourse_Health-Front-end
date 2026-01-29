"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Archive, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

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
  isArchived?: boolean
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
  isArchived?: boolean
  sortDate: string
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
    type: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
    ],
  },
]

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "all",
    sort: "date-newest",
  })
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [activePageNum, setActivePageNum] = useState(1)
  const [archivedPageNum, setArchivedPageNum] = useState(1)
  const router = useRouter()
  const queryClient = useQueryClient()

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
  const { hasPermission, loading: permissionsLoading } = useUserPermissions(userId, userRole)

  const activeAppointmentsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", activePageNum.toString())
    params.append("limit", "10")
    const status = filterValues["status"]
    if (status && status !== "all") {
      params.append("status", status)
    }
    params.append("isArchived", "false")
    return `/api/admin/appointments?${params.toString()}`
  }, [activePageNum, filterValues])

  const archivedAppointmentsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", archivedPageNum.toString())
    params.append("limit", "10")
    const status = filterValues["status"]
    if (status && status !== "all") {
      params.append("status", status)
    }
    params.append("isArchived", "true")
    return `/api/admin/appointments?${params.toString()}`
  }, [archivedPageNum, filterValues])

  const { data: activeAppointmentsData, isLoading: isLoadingActive } = useFetch<AppointmentsResponse>({
    path: activeAppointmentsPath,
    queryKey: ["admin-appointments-active", activePageNum, filterValues],
  })

  const { data: archivedAppointmentsData, isLoading: isLoadingArchived } = useFetch<AppointmentsResponse>({
    path: archivedAppointmentsPath,
    queryKey: ["admin-appointments-archived", archivedPageNum, filterValues],
  })

  // Select the appropriate data based on active tab
  const appointmentsData = activeTab === "active" ? activeAppointmentsData : archivedAppointmentsData
  const isLoading = activeTab === "active" ? isLoadingActive : isLoadingArchived

  // Archive API
  const { onRequest: archiveSession, isPending: isArchiving } = useApi<
    Record<string, never>
  >({
    key: "archive-session",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const transformedAppointments = useMemo(() => {
    if (!appointmentsData?.appointments) return []
    const rows = appointmentsData.appointments
      .map((appointment) => {
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
          isArchived: appointment.isArchived || false,
          sortDate: appointment.scheduledAt || appointment.createdAt,
        }
      })

    const sort = filterValues.sort
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      const aTime = new Date(a.sortDate).getTime()
      const bTime = new Date(b.sortDate).getTime()
      if (sort === "date-newest") return bTime - aTime
      if (sort === "date-oldest") return aTime - bTime
      return 0
    })
  }, [appointmentsData, filterValues.sort])

  const handleArchive = () => {
    if (!selectedSessionId) return
    archiveSession({
      path: `/api/admin/appointments/${selectedSessionId}/archive`,
      data: {},
      onSuccess: () => {
        setArchiveDialogOpen(false)
        setSelectedSessionId(null)
        // Invalidate both active and archived queries
        queryClient.invalidateQueries({ 
          queryKey: ["admin-appointments-active"],
          exact: false 
        })
        queryClient.invalidateQueries({ 
          queryKey: ["admin-appointments-archived"],
          exact: false 
        })
      },
    })
  }

  const actions: ActionMenuItem<TableAppointment>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/sessions/${row.id}` as never)
      },
    },
  ]

  // Add archive action only for active sessions (but only show after permissions load)
  if (activeTab === "active" && !permissionsLoading && hasPermission("sessions.archive")) {
    actions.push({
      label: "Archive",
      onClick: (row) => {
        setSelectedSessionId(row.id)
        setArchiveDialogOpen(true)
      },
    } as ActionMenuItem<TableAppointment>)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    // Reset to first page for the current tab when filter changes
    if (activeTab === "active") {
      setActivePageNum(1)
    } else {
      setArchivedPageNum(1)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Don't reset filters when switching tabs - each tab maintains its own pagination
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Sessions
      </h2>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="space-x-4">
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="active"
            >
              Active Sessions
            </TabsTrigger>
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="archived"
            >
              Archived Sessions
            </TabsTrigger>
          </TabsList>

          {/* Filter Dropdowns */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={filterValues[filter.key] || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[140px] data-[placeholder]:text-foreground [&_*[data-slot=select-value]]:font-semibold">
                    <SelectValue
                      placeholder={filter.placeholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="active" className="mt-0">
          <DataTable
            data={transformedAppointments}
            columns={columns}
            filters={filters}
            actions={actions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            pagination={
              appointmentsData?.pagination
                ? {
                    currentPage: appointmentsData.pagination.page,
                    totalPages: appointmentsData.pagination.totalPages,
                    onPageChange: (page) => setActivePageNum(page),
                  }
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="archived" className="mt-0">
          <DataTable
            data={transformedAppointments}
            columns={columns}
            filters={filters}
            actions={[
              {
                label: "View Details",
                onClick: (row) => {
                  router.push(`/admin/sessions/${row.id}` as never)
                },
              },
            ]}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            pagination={
              appointmentsData?.pagination
                ? {
                    currentPage: appointmentsData.pagination.page,
                    totalPages: appointmentsData.pagination.totalPages,
                    onPageChange: (page) => setArchivedPageNum(page),
                  }
                : undefined
            }
          />
        </TabsContent>
      </Tabs>

      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this session? It will be moved
              to the archived sessions tab and no longer appear in active
              sessions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setArchiveDialogOpen(false)
                setSelectedSessionId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchive}
              disabled={isArchiving}
              className="gap-2"
            >
              <Archive className="h-4 w-4" />
              {isArchiving ? "Archiving..." : "Archive Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
