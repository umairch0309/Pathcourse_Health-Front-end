"use client"

import { format } from "date-fns"
import { Plus, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import { buildPermissionGroups } from "@/lib/permissions"

/* ===================== TYPES ===================== */

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

interface PermissionsResponse {
  permissions: Permission[]
}

/* ===================== SCHEMA ===================== */

const roleSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional().or(z.literal("")),
})

type RoleFormData = z.infer<typeof roleSchema>

/* ===================== COLUMNS ===================== */

const columns: Column<Role>[] = [
  { key: "name", header: "Name" },
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

/* ===================== COMPONENT ===================== */

export default function RolesPermissions() {
  const { toastError } = useToast()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  )
  const [managePermissions, setManagePermissions] = useState<Set<string>>(
    new Set()
  )

  /* ===================== FETCH ===================== */

  const { data, isLoading, error, refetch } = useFetch<RolesResponse>({
    path: "/api/admin/roles",
    queryKey: ["admin-roles"],
  })

  const { data: permissionsData } = useFetch<PermissionsResponse>({
    path: "/api/admin/permissions",
    queryKey: ["admin-permissions"],
  })

  const permissions = permissionsData?.permissions || []
  const roles = data?.roles || []
  const permissionGroups = buildPermissionGroups(permissions.map((p) => p.slug))

  /* ===================== API ===================== */

  const { onRequest: createRole, isPending: isCreating } = useApi<any>({
    key: "create-role",
    method: "post",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const { onRequest: assignPermissions, isPending: isSavingPermissions } =
    useApi<any>({
      key: "assign-permissions",
      method: "post",
      showSuccessToast: true,
      showErrorToast: true,
    })

  const { onRequest: deleteRole, isPending: isDeleting } = useApi<any>({
    key: "delete-role",
    method: "delete",
    showSuccessToast: true,
    showErrorToast: true,
  })

  /* ===================== HELPERS ===================== */

  const togglePermission = (
    permissionId: string,
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    const clicked = permissions.find((p) => p.id === permissionId)

    setFn((prev) => {
      const next = new Set(prev)

      if (next.has(permissionId)) {
        next.delete(permissionId)
        return next
      }

      next.add(permissionId)

      if (!clicked) return next

      const prefix = clicked.slug.split(".")[0]
      const viewSlug = `${prefix}.view`

      if (clicked.slug !== viewSlug) {
        const viewPermission = permissions.find((p) => p.slug === viewSlug)
        if (viewPermission) next.add(viewPermission.id)
      }

      return next
    })
  }

  /* ===================== ACTIONS ===================== */

  const actions: ActionMenuItem<Role>[] = [
    {
      label: "Manage Permissions",
      icon: <Settings className="h-4 w-4" />,
      onClick: (role) => {
        setSelectedRole(role)
        setManagePermissions(new Set(role.permissions.map((p) => p.id)))
        setManageDialogOpen(true)
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (role) => {
        setRoleToDelete(role)
        setDeleteDialogOpen(true)
      },
    },
  ]

  /* ===================== SUBMIT ===================== */

  const handleCreateRole = (data: RoleFormData) => {
    createRole({
      path: "/api/admin/roles",
      data: {
        name: data.name,
        description: data.description || undefined,
        permissionIds: Array.from(selectedPermissions),
      },
      onSuccess: () => {
        setAddDialogOpen(false)
        setSelectedPermissions(new Set())
        refetch()
      },
    })
  }

  const handleDelete = () => {
    if (!roleToDelete) return

    deleteRole({
      path: `/api/admin/roles/${roleToDelete.id}`,
      data: {},
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setRoleToDelete(null)
        refetch()
      },
      onError: () => {
        toastError("Cannot delete role assigned to team members")
      },
    })
  }

  const handleSavePermissions = () => {
    if (!selectedRole) return

    assignPermissions({
      path: `/api/admin/roles/${selectedRole.id}/permissions`,
      data: {
        permissionIds: Array.from(managePermissions),
      },
      onSuccess: () => {
        setManageDialogOpen(false)
        setSelectedRole(null)
        refetch()
      },
    })
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="w-full">
      <DataTable
        title="Roles and Permissions"
        data={roles}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showAllButton={false}
        customButton={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        }
      />

      {/* ================= ADD ROLE ================= */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              Create a role and assign permissions
            </DialogDescription>
          </DialogHeader>

          <FormModified
            schema={roleSchema}
            onSubmit={handleCreateRole}
            disabled={isCreating}
            defaultValues={{ name: "", description: "" }}
          >
            {({ components }) => (
              <>
                <components.Input name="name" label="Role Name" />

                <Typography className="font-bold mt-6">Permissions</Typography>

                {Object.entries(permissionGroups).map(([group, slugs]) => {
                  let groupSlugs = Array.from(slugs);
                  // Only add users.view to Users, sessions.view to Sessions
                  if (group === "Users" && !groupSlugs.includes("users.view") && permissions.some((p) => p.slug === "users.view")) {
                    groupSlugs.push("users.view");
                  }
                  if (group === "Sessions" && !groupSlugs.includes("sessions.view") && permissions.some((p) => p.slug === "sessions.view")) {
                    groupSlugs.push("sessions.view");
                  }
                  // Remove notifications.view_by_permission from Notifications group
                  if (group === "Notifications") {
                    groupSlugs = groupSlugs.filter(slug => slug !== "notifications.view_by_permission");
                  }
                  return (
                    <div key={group}>
                      <Typography className="font-medium my-2">
                        {group}
                      </Typography>
                      <div className="grid grid-cols-2 gap-3">
                        {permissions
                          .filter((p) => groupSlugs.includes(p.slug))
                          .map((p) => (
                            <div key={p.id} className="flex gap-2">
                              <Checkbox
                                checked={selectedPermissions.has(p.id)}
                                onCheckedChange={() =>
                                  togglePermission(p.id, setSelectedPermissions)
                                }
                              />
                              <span className="text-sm">{p.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </FormModified>
        </DialogContent>
      </Dialog>

      {/* ================= MANAGE PERMISSIONS ================= */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Permissions – {selectedRole?.name}</DialogTitle>
          </DialogHeader>

          {Object.entries(permissionGroups).map(([group, slugs]) => {
            let groupSlugs = Array.from(slugs);
            // Only add users.view to Users, sessions.view to Sessions
            if (group === "Users" && !groupSlugs.includes("users.view") && permissions.some((p) => p.slug === "users.view")) {
              groupSlugs.push("users.view");
            }
            if (group === "Sessions" && !groupSlugs.includes("sessions.view") && permissions.some((p) => p.slug === "sessions.view")) {
              groupSlugs.push("sessions.view");
            }
            // Remove notifications.view_by_permission from Notifications group
            if (group === "Notifications") {
              groupSlugs = groupSlugs.filter(slug => slug !== "notifications.view_by_permission");
            }
            return (
              <div key={group}>
                <Typography className="font-medium my-2 text-foreground">
                  {group}
                </Typography>
                <div className="grid grid-cols-2 gap-3">
                  {permissions
                    .filter((p) => groupSlugs.includes(p.slug))
                    .map((p) => (
                      <div key={p.id} className="flex gap-2">
                        <Checkbox
                          checked={managePermissions.has(p.id)}
                          onCheckedChange={() =>
                            togglePermission(p.id, setManagePermissions)
                          }
                        />
                        <span className="text-sm">{p.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setManageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePermissions}
              disabled={isSavingPermissions}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE ================= */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <b>{roleToDelete?.name}</b>?
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
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
