"use client"

import { format } from "date-fns"
import { Edit, Plus, Settings, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PERMISSION_GROUPS } from "@/lib/permissions"

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

const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
})

type RoleFormData = z.infer<typeof roleSchema>

type CreateRoleRequest = {
  name: string
  description?: string
  permissionIds?: string[]
}

type DeleteRoleRequest = {
  id: string
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

export default function RolesPermissions() {
  const router = useRouter()
  const { toastError } = useToast()
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  )

  const { data, isLoading, error, refetch } = useFetch<RolesResponse>({
    path: "/api/admin/roles",
    queryKey: ["admin-roles"],
  })

  const { data: permissionsData } = useFetch<PermissionsResponse>({
    path: "/api/admin/permissions",
    queryKey: ["admin-permissions"],
  })

  const { onRequest: createRole, isPending: isCreating } =
    useApi<CreateRoleRequest>({
      key: "create-role",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  const { onRequest: assignPermissions } = useApi<{
    permissionIds: string[]
  }>({
    key: "assign-permissions",
    showSuccessToast: false,
    showErrorToast: true,
    method: "post",
  })

  const { onRequest: deleteRole, isPending: isDeleting } =
    useApi<DeleteRoleRequest>({
      key: "delete-role",
      showSuccessToast: true,
      showErrorToast: true,
      method: "delete",
    })

  const roles = data?.roles || []
  const permissions = permissionsData?.permissions || []

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

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId)
      } else {
        newSet.add(permissionId)
      }
      return newSet
    })
  }

  const handleSelectAll = (groupPermissions: string[]) => {
    if (!permissions) return

    const groupPermissionIds = permissions
      .filter((p) => groupPermissions.includes(p.slug))
      .map((p) => p.id)

    const allSelected = groupPermissionIds.every((id) =>
      selectedPermissions.has(id)
    )

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev)
      if (allSelected) {
        groupPermissionIds.forEach((id) => {
          newSet.delete(id)
        })
      } else {
        groupPermissionIds.forEach((id) => {
          newSet.add(id)
        })
      }
      return newSet
    })
  }

  const handleSubmit = async (data: RoleFormData) => {
    const permissionIds = Array.from(selectedPermissions)

    // First, try to create role with permissions
    createRole({
      data: {
        name: data.name,
        description: data.description?.trim() || undefined,
        permissionIds,
      },
      path: "/api/admin/roles",
      onSuccess: (response: unknown) => {
        const roleId =
          (response as { data?: { id?: string }; id?: string })?.data?.id ||
          (response as { id?: string })?.id

        // If permissions were provided and role was created, assign permissions
        if (permissionIds.length > 0 && roleId) {
          assignPermissions({
            data: { permissionIds },
            path: `/api/admin/roles/${roleId}/permissions`,
            onSuccess: () => {
              setAddRoleDialogOpen(false)
              setSelectedPermissions(new Set())
              refetch()
            },
            onError: () => {
              // If permission assignment fails, still close dialog and refresh
              // The role was created, permissions can be assigned later
              setAddRoleDialogOpen(false)
              setSelectedPermissions(new Set())
              refetch()
            },
          })
        } else {
          // No permissions to assign, just close and refresh
          setAddRoleDialogOpen(false)
          setSelectedPermissions(new Set())
          refetch()
        }
      },
      onError: (error: unknown) => {
        // If creation fails because permissionIds is not supported,
        // try creating without permissions first, then assign
        const axiosError = error as {
          response?: { status?: number }
        }
        if (
          axiosError?.response?.status === 400 ||
          axiosError?.response?.status === 422
        ) {
          createRole({
            data: {
              name: data.name,
              description: data.description?.trim() || undefined,
              permissionIds: undefined,
            },
            path: "/api/admin/roles",
            onSuccess: (response: unknown) => {
              const roleId =
                (response as { data?: { id?: string }; id?: string })?.data
                  ?.id || (response as { id?: string })?.id
              if (permissionIds.length > 0 && roleId) {
                assignPermissions({
                  data: { permissionIds },
                  path: `/api/admin/roles/${roleId}/permissions`,
                  onSuccess: () => {
                    setAddRoleDialogOpen(false)
                    setSelectedPermissions(new Set())
                    refetch()
                  },
                })
              } else {
                setAddRoleDialogOpen(false)
                setSelectedPermissions(new Set())
                refetch()
              }
            },
          })
        }
      },
    })
  }

  const handleOpenAddDialog = () => {
    setSelectedPermissions(new Set())
    setAddRoleDialogOpen(true)
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
        data={roles as unknown as Record<string, unknown>[]}
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        actions={
          actions as unknown as ActionMenuItem<Record<string, unknown>>[]
        }
        searchPlaceholder="Search roles..."
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        title="Roles and Permissions"
        customButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleOpenAddDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        }
      />

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              Create a new role and assign permissions to it.
            </DialogDescription>
          </DialogHeader>

          <FormModified
            schema={roleSchema}
            onSubmit={handleSubmit}
            disabled={isCreating}
            defaultValues={{
              name: "",
              description: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-6">
                <div>
                  <components.Input
                    name="name"
                    label="Role Name"
                    placeholder="Enter role name..."
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />
                </div>

                <div>
                  <Typography
                    variant="p"
                    className="font-bold text-foreground mb-4"
                  >
                    Permissions
                  </Typography>

                  <div className="space-y-4">
                    {Object.entries(PERMISSION_GROUPS).map(
                      ([groupName, groupSlugs]) => {
                        const groupSlugsArray = Array.from(
                          groupSlugs
                        ) as string[]
                        const groupPermissions = permissions.filter((p) =>
                          groupSlugsArray.includes(p.slug)
                        )
                        const groupPermissionIds = groupPermissions.map(
                          (p) => p.id
                        )
                        const allSelected = groupPermissionIds.every((id) =>
                          selectedPermissions.has(id)
                        )

                        return (
                          <Card key={groupName}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                  {groupName}
                                </CardTitle>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSelectAll(groupSlugsArray)
                                  }
                                >
                                  {allSelected ? "Deselect All" : "Select All"}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {groupPermissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                                  >
                                    <Checkbox
                                      id={permission.id}
                                      checked={selectedPermissions.has(
                                        permission.id
                                      )}
                                      onCheckedChange={() =>
                                        handlePermissionToggle(permission.id)
                                      }
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <label
                                        htmlFor={permission.id}
                                        className="text-sm font-medium cursor-pointer"
                                      >
                                        {permission.name}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      }
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddRoleDialogOpen(false)
                      setSelectedPermissions(new Set())
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader
                          size="sm"
                          variant="default"
                          color="white"
                          className="mr-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Create Role"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </FormModified>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
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
