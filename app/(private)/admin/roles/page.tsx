"use client"

import { format } from "date-fns"
import { Edit, Plus, Settings, Trash2 } from "lucide-react"
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

interface Permission {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Role {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  permissions: Permission[]
}

interface RolesResponse {
  roles: Role[]
}

const columns: Column<Role>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "description",
    header: "Description",
    render: (row) => row.description || "—",
  },
  {
    key: "permissions",
    header: "Permissions",
    render: (row) => `${row.permissions.length} permission(s)`,
  },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => format(new Date(row.createdAt), "MMM dd, yyyy"),
  },
]

type DeleteRoleRequest = {
  id: string
}

export default function RolesPage() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const { data, isLoading, error, refetch } = useFetch<RolesResponse>({
    path: "/api/admin/roles",
    queryKey: ["admin-roles"],
  })

  const { onRequest: deleteRole, isPending: isDeleting } =
    useApi<DeleteRoleRequest>({
      key: "delete-role",
      showSuccessToast: true,
      showErrorToast: true,
      method: "delete",
    })

  const roles = data?.roles || []

  const handleDelete = (role: Role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!roleToDelete) return

    deleteRole({
      data: {} as DeleteRoleRequest,
      path: `/api/admin/roles/${roleToDelete.id}`,
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setRoleToDelete(null)
        refetch()
      },
      onError: (error: unknown) => {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } }
        }
        if (axiosError?.response?.status === 400) {
          toastError(
            axiosError.response.data?.message ||
              "Cannot delete role that is assigned to team members"
          )
        } else {
          toastError("Failed to delete role. Please try again.")
        }
      },
    })
  }

  const actions: ActionMenuItem<Role>[] = [
    {
      label: "Manage Permissions",
      icon: <Settings className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/admin/roles/${row.id}/permissions`)
      },
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/admin/roles/${row.id}/edit`)
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
        data={roles}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search roles..."
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Roles"
        customButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/admin/roles/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        }
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{roleToDelete?.name}"? This
              action cannot be undone. You cannot delete a role that is assigned
              to team members.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setRoleToDelete(null)
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
