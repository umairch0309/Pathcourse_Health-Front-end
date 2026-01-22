"use client"

import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
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

type DeleteEnterpriseRequest = {
  id: string
}

export default function EnterprisesPage() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [enterpriseToDelete, setEnterpriseToDelete] =
    useState<Enterprise | null>(null)

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

  const enterprises = data?.enterprises || []
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

  const actions: ActionMenuItem<Enterprise>[] = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/admin/enterprises/${row.id}/edit`)
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        handleDelete(row)
      },
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        data={enterprises}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search enterprises..."
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Enterprises"
        customButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/admin/enterprises/add")}
          >
            Add Enterprise
          </Button>
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
