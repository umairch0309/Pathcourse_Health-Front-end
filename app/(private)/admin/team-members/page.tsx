/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client"

import { format } from "date-fns"
import { Check, Edit, Loader2, Plus, Trash2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"

/* ================= TYPES ================= */

interface Permission {
  id: string
  name: string
  slug: string
}

interface Role {
  id: string
  name: string
  description: string | null
}

interface TeamMember {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  role: Role
  createdAt: string
}

interface TeamMembersResponse {
  teamMembers: TeamMember[]
}

interface RolesResponse {
  roles: Role[]
}

/* ================= TABLE ================= */

const columns: Column<TeamMember>[] = [
  {
    key: "user",
    header: "User",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.user.image || undefined} />
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
    key: "createdAt",
    header: "Added On",
    render: (row) => format(new Date(row.createdAt), "MMM dd, yyyy"),
  },
]

/* ================= PAGE ================= */

export default function TeamMembersPage() {
  const router = useRouter()
  const { toastError } = useToast()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [changeRoleOpen, setChangeRoleOpen] = useState(false)

  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState("")

  const { data, isLoading, error, refetch } = useFetch<TeamMembersResponse>({
    path: "/api/admin/team-members",
    queryKey: ["admin-team-members"],
  })

  const { data: rolesData } = useFetch<RolesResponse>({
    path: "/api/admin/roles",
    queryKey: ["admin-roles"],
  })

  const { onRequest: deleteTeamMember, isPending: isDeleting } = useApi({
    key: "delete-team-member",
    method: "delete",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const { onRequest: updateRole, isPending: isSavingRole } = useApi<{
    roleId: string
  }>({
    key: "update-team-member-role",
    method: "patch",
    showSuccessToast: true,
    showErrorToast: true,
  })

  useEffect(() => {
    if (memberToEdit) {
      setSelectedRoleId(memberToEdit.role.id)
    }
  }, [memberToEdit])

  const actions: ActionMenuItem<TeamMember>[] = [
    {
      label: "Change Role",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        setMemberToEdit(row)
        setChangeRoleOpen(true)
      },
    },
    {
      label: "Remove",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        setMemberToDelete(row)
        setDeleteDialogOpen(true)
      },
    },
  ]

  const handleRoleUpdate = () => {
    if (!memberToEdit || !selectedRoleId) {
      toastError("Please select a role")
      return
    }

    updateRole({
      path: `/api/admin/team-members/${memberToEdit.userId}/role`,
      data: { roleId: selectedRoleId },
      onSuccess: () => {
        setChangeRoleOpen(false)
        setMemberToEdit(null)
        refetch()
      },
    })
  }

  const confirmDelete = () => {
    if (!memberToDelete) return

    deleteTeamMember({
      path: `/api/admin/team-members/${memberToDelete.userId}`,
      data: "" as string,
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setMemberToDelete(null)
        refetch()
      },
    })
  }

  return (
    <div className="w-full">
      <DataTable
        title="Team Members"
        data={data?.teamMembers || []}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showAllButton={false}
        searchPlaceholder="Search team members..."
        customButton={
          <Button onClick={() => router.push("/admin/team-members/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        }
      />

      {/* ================= CHANGE ROLE MODAL ================= */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update role for{" "}
              <span className="font-medium">{memberToEdit?.user.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Role</p>
              <p className="text-sm">{memberToEdit?.role.name}</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Select New Role
              </label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                      {role.description && (
                        <span className="ml-2 text-muted-foreground">
                          - {role.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleUpdate} disabled={isSavingRole}>
              {isSavingRole ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update Role
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE MODAL ================= */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>{memberToDelete?.user.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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
