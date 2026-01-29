"use client"

import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

type Enterprise = {
  id: string
  name: string
  code: string
  sessionsPerMonth: number
  createdAt: string
  updatedAt: string
}

type EnterpriseResponse = {
  enterprises: Enterprise[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const columns: Column<Enterprise>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "code",
    header: "Code",
  },
  {
    key: "sessionsPerMonth",
    header: "Sessions/Month",
  },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => format(new Date(row.createdAt), "MMM dd, yyyy"),
  },
]

const filters: FilterConfig[] = [
  {
    label: "Sort by",
    key: "sort",
    type: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
      { label: "Name (A-Z)", value: "name-asc" },
      { label: "Name (Z-A)", value: "name-desc" },
    ],
  },
  {
    label: "Sessions/Month",
    key: "sessions",
    filterFn: (row, value) => {
      // row is Enterprise
      const sessions = Number((row as Enterprise).sessionsPerMonth ?? 0)
      if (value === "all") return true
      if (value === "0-10") return sessions >= 0 && sessions <= 10
      if (value === "11-50") return sessions >= 11 && sessions <= 50
      if (value === "51-100") return sessions >= 51 && sessions <= 100
      if (value === "100+") return sessions > 100
      return true
    },
    options: [
      { label: "All", value: "all" },
      { label: "0-10", value: "0-10" },
      { label: "11-50", value: "11-50" },
      { label: "51-100", value: "51-100" },
      { label: "100+", value: "100+" },
    ],
  },
]

type DeleteEnterpriseRequest = {
  id: string
}

export default function EnterprisesPage() {
  const router = useRouter()
  const { toastError } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [enterpriseToDelete, setEnterpriseToDelete] =
    useState<Enterprise | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    sort: "date-newest",
    sessions: "all",
  })

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
  }, [])

  // Get user permissions
  const { hasPermission } = useUserPermissions(userId)

  const { data, isLoading, error, refetch } = useFetch<EnterpriseResponse>({
    path: `/api/enterprises?page=${currentPage}&limit=10`,
    queryKey: ["enterprises", currentPage],
  })

  const { onRequest: deleteEnterprise, isPending: isDeleting } =
    useApi<DeleteEnterpriseRequest>({
      key: "delete-enterprise",
      showSuccessToast: true,
      showErrorToast: true,
      method: "delete",
    })

  const filteredEnterprises = (data?.enterprises || [])
    .filter((enterprise) => {
      if (filterValues.sessions !== "all") {
        const sessions = enterprise.sessionsPerMonth
        const range = filterValues.sessions

        if (range === "0-10" && sessions > 10) return false
        if (range === "11-50" && (sessions < 11 || sessions > 50)) return false
        if (range === "51-100" && (sessions < 51 || sessions > 100))
          return false
        if (range === "100+" && sessions <= 100) return false
      }

      return true
    })
    .sort((a, b) => {
      const sort = filterValues.sort

      if (sort === "date-newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === "date-oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sort === "name-asc") {
        return a.name.localeCompare(b.name)
      }
      if (sort === "name-desc") {
        return b.name.localeCompare(a.name)
      }

      return 0
    })

  const enterprises = filteredEnterprises
  const totalPages = data?.pagination?.totalPages || 1

  const handleDelete = (enterprise: Enterprise) => {
    setEnterpriseToDelete(enterprise)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!enterpriseToDelete) return

    deleteEnterprise({
      data: {} as DeleteEnterpriseRequest, // DELETE doesn't need body, but type requires it
      path: `/api/enterprises/${enterpriseToDelete.id}`,
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setEnterpriseToDelete(null)
        refetch()
      },
      onError: (error: unknown) => {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } }
        }
        if (axiosError?.response?.status === 404) {
          toastError("Enterprise not found")
        } else {
          toastError("Failed to delete enterprise. Please try again.")
        }
      },
    })
  }

  // Build actions array based on permissions
  const actions: ActionMenuItem<Enterprise>[] = []

  if (hasPermission("enterprise.update")) {
    actions.push({
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/admin/enterprises/${row.id}/edit`)
      },
    })
  }

  if (hasPermission("enterprise.delete")) {
    actions.push({
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        handleDelete(row)
      },
    })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  return (
    <div className="w-full">
      <DataTable
        data={enterprises}
        columns={columns}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        actions={actions}
        searchPlaceholder="Search enterprises..."
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Enterprises"
        customButton={
          hasPermission("enterprise.add") ? (
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/admin/enterprises/add")}
            >
              Add Enterprise
            </Button>
          ) : undefined
        }
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Enterprise</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{enterpriseToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setEnterpriseToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
