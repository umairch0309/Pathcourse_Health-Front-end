"use client"

import { format } from "date-fns"
import { Edit, Plus, Trash2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useFetch } from "@/hooks/use-fetch"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"

interface Permission {
  id: string
  name: string
  slug: string
}

interface Role {
  id: string
  name: string
  description: string | null
  permissions: Permission[]
}

interface TeamMember {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
    createdAt: string
  }
  role: Role
  createdAt: string
  updatedAt: string
}

interface TeamMembersResponse {
  teamMembers: TeamMember[]
}

const columns: Column<TeamMember>[] = [
  {
    key: "user",
    header: "User",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.user.image || undefined} alt={row.user.name} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{row.user.name}</p>
          <p className="text-xs text-muted-foreground">{row.user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (row) => row.role.name,
  },
  {
    key: "permissions",
    header: "Permissions",
    render: (row) => `${row.role.permissions.length} permission(s)`,
  },
  {
    key: "createdAt",
    header: "Added On",
    render: (row) => format(new Date(row.createdAt), "MMM dd, yyyy"),
  },
]

type DeleteTeamMemberRequest = {
  userId: string
}

export default function TeamMembersPage() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)

  const { data, isLoading, error, refetch } =
    useFetch<TeamMembersResponse>({
      path: "/api/admin/team-members",
      queryKey: ["admin-team-members"],
    })

  const { onRequest: deleteTeamMember, isPending: isDeleting } =
    useApi<DeleteTeamMemberRequest>({
      key: "delete-team-member",
      showSuccessToast: true,
      showErrorToast: true,
      method: "delete",
    })

  const teamMembers = data?.teamMembers || []

  const handleDelete = (member: TeamMember) => {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!memberToDelete) return

    deleteTeamMember({
      data: {} as DeleteTeamMemberRequest,
      path: `/api/admin/team-members/${memberToDelete.userId}`,
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setMemberToDelete(null)
        refetch()
      },
      onError: (error: unknown) => {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } }
        }
        if (axiosError?.response?.status === 404) {
          toastError("Team member not found")
        } else {
          toastError("Failed to remove team member. Please try again.")
        }
      },
    })
  }

  const actions: ActionMenuItem<TeamMember>[] = [
    {
      label: "Change Role",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/admin/team-members/${row.userId}/role`)
      },
    },
    {
      label: "Remove",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        handleDelete(row)
      },
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        data={teamMembers}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search team members..."
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Team Members"
        customButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/admin/team-members/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        }
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{memberToDelete?.user.name}" from
              the team? This will remove their admin access and permissions, but
              their user account will remain.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setMemberToDelete(null)
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
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

