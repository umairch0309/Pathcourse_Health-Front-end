"use client"

import { useQueryClient } from "@tanstack/react-query"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

type Patient = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  onboardingStage: string | null
  enterpriseCode: string | null
  employeeCode: string | null
  isAnonymous: boolean | null
  createdAt: string
  updatedAt: string
  userInfo: {
    id: string
    gender: string | null
    dateOfBirth: string | null
    phone: string | null
    address: string | null
  } | null
}

type PatientsResponse = {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type TablePatient = {
  id: string
  user: {
    name: string
    image: string | null
  }
  email: string
  enterpriseCode: string | null
  employeeCode: string | null
  createdAt: string
  banned: boolean | null
  banReason: string | null
}

const columns: Column<TablePatient>[] = [
  {
    key: "user",
    header: "User",
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
    key: "email",
    header: "Email",
  },
  {
    key: "enterpriseCode",
    header: "Enterprise Code",
    render: (row) => row.enterpriseCode || "-",
  },
  {
    key: "employeeCode",
    header: "Employee Code",
    render: (row) => row.employeeCode || "-",
  },
  {
    key: "createdAt",
    header: "Created on",
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    key: "banned",
    header: "Status",
    render: (row) => {
      if (row.banned) {
        return (
          <div className="flex flex-col gap-1">
            <Badge className="bg-red-100 text-red-800">Blocked</Badge>
          </div>
        )
      }
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    },
  },
]

const filters: FilterConfig[] = [
  {
    label: "Status",
    key: "bannedStatus",
    options: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Blocked", value: "blocked" },
    ],
    filterFn: (row, value) => {
      const banned = Boolean((row as TablePatient).banned)
      if (value === "active") return banned === false
      if (value === "blocked") return banned === true
      return true
    },
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

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    sort: "date-newest",
    bannedStatus: "all",
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  )
  const [banReason, setBanReason] = useState("")
  const [blockAction, setBlockAction] = useState<"block" | "unblock">("block")
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
  const { hasPermission } = useUserPermissions(userId, userRole)

  const patientsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    return `/api/admin/patients?${params.toString()}`
  }, [currentPage])

  const { data: patientsData, isLoading } = useFetch<PatientsResponse>({
    path: patientsPath,
    queryKey: ["admin-patients", currentPage],
  })

  // Block/Unblock API
  const { onRequest: blockUnblockPatient, isPending: isBlockingUnblocking } =
    useApi<Record<string, string | null | undefined>>({
      key: "block-unblock-patient",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  const transformedPatients = useMemo(() => {
    if (!patientsData?.patients) return []
    const rows = patientsData.patients.map((patient) => ({
      id: patient.id,
      user: {
        name: patient.name,
        image: patient.image,
      },
      email: patient.email,
      enterpriseCode: patient.enterpriseCode,
      employeeCode: patient.employeeCode,
      createdAt: patient.createdAt,
      banned: patient.banned,
      banReason: patient.banReason,
    }))

    const sort = filterValues.sort
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      if (sort === "date-newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === "date-oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return 0
    })
  }, [patientsData, filterValues.sort])

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const actions: ActionMenuItem<TablePatient>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/users/${row.id}` as never)
      },
    },
  ]

  // Add block/unblock actions if user has permission
  if (hasPermission("users.block_unblock")) {
    actions.push({
      label: "Block",
      onClick: (row: TablePatient) => {
        if (!row.banned) {
          setSelectedPatientId(row.id)
          setBlockAction("block")
          setBanReason("")
          setBlockDialogOpen(true)
        }
      },
    })
    actions.push({
      label: "Unblock",
      onClick: (row: TablePatient) => {
        if (row.banned) {
          setSelectedPatientId(row.id)
          setBlockAction("unblock")
          setBanReason("")
          setBlockDialogOpen(true)
        }
      },
    })
  }

  const handleBlockUnblock = () => {
    if (!selectedPatientId) return

    const path =
      blockAction === "block"
        ? `/api/admin/patients/${selectedPatientId}/block`
        : `/api/admin/patients/${selectedPatientId}/unblock`

    const data: Record<string, string | null | undefined> =
      blockAction === "block" ? { banReason: banReason || null } : {}

    blockUnblockPatient({
      path,
      data,
      onSuccess: () => {
        setBlockDialogOpen(false)
        setSelectedPatientId(null)
        setBanReason("")
        queryClient.invalidateQueries({
          queryKey: ["admin-patients"],
          exact: false,
        })
      },
    })
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Users
      </h2>

      <DataTable
        data={transformedPatients}
        columns={columns}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading}
        pagination={
          patientsData?.pagination
            ? {
                currentPage: patientsData.pagination.page,
                totalPages: patientsData.pagination.totalPages,
                onPageChange: (page) => setCurrentPage(page),
              }
            : undefined
        }
      />

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {blockAction === "block" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {blockAction === "block"
                ? "Are you sure you want to block this user? They will not be able to use the platform."
                : "Are you sure you want to unblock this user? They will regain access to the platform."}
            </DialogDescription>
          </DialogHeader>

          {blockAction === "block" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ban-reason">Ban Reason (Optional)</Label>
                <Input
                  id="ban-reason"
                  placeholder="e.g., Abusive behavior"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBlockDialogOpen(false)
                setSelectedPatientId(null)
                setBanReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant={blockAction === "block" ? "destructive" : "default"}
              onClick={handleBlockUnblock}
              disabled={isBlockingUnblocking}
              className="gap-2"
            >
              {isBlockingUnblocking
                ? "Processing..."
                : blockAction === "block"
                  ? "Block User"
                  : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
