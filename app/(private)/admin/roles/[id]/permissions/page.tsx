"use client"

import { Check, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { buildPermissionGroups } from "@/lib/permissions"

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
  permissions: Permission[]
}

interface PermissionsResponse {
  permissions: Permission[]
}

// API returns the role directly, not nested in a role property
type RoleResponse = Role

type AssignPermissionsRequest = {
  permissionIds: string[]
}

export default function RolePermissionsPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  )

  const { data: roleData, isLoading: isLoadingRole } = useFetch<RoleResponse>({
    path: `/api/admin/roles/${roleId}`,
    queryKey: ["admin-role", roleId],
  })

  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useFetch<PermissionsResponse>({
      path: "/api/admin/permissions",
      queryKey: ["admin-permissions"],
    })

  const { onRequest: assignPermissions, isPending: isSaving } =
    useApi<AssignPermissionsRequest>({
      key: "assign-permissions",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  useEffect(() => {
    if (roleData?.permissions) {
      const permissionIds = roleData.permissions.map((p) => p.id)
      setSelectedPermissions(new Set(permissionIds))
    }
  }, [roleData])

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
    if (!permissionsData?.permissions) return

    const groupPermissionIds = permissionsData.permissions
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

  const handleSave = () => {
    const permissionIds = Array.from(selectedPermissions)
    assignPermissions({
      data: { permissionIds },
      path: `/api/admin/roles/${roleId}/permissions`,
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/roles")
        }, 1500)
      },
    })
  }

  if (isLoadingRole || isLoadingPermissions) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Manage Permissions
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!roleData || !roleData.id) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Manage Permissions
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <Typography variant="p" className="text-foreground">
            Role not found
          </Typography>
        </div>
      </div>
    )
  }

  if (!permissionsData || !Array.isArray(permissionsData.permissions)) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Manage Permissions - {roleData?.name || "Unknown"}
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <Typography variant="p" className="text-foreground">
            Failed to load permissions. Please try again.
          </Typography>
        </div>
      </div>
    )
  }

  const permissions = permissionsData.permissions
  const permissionGroups = buildPermissionGroups(permissions.map((p) => p.slug))

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Typography variant="h5" className="font-bold text-foreground">
            Manage Permissions - {roleData.name}
          </Typography>
        </div>

        <div className="bg-background p-3 sm:p-6 rounded-md space-y-6">
          {Object.entries(permissionGroups).map(([groupName, groupSlugs]) => {
            const groupSlugsArray = Array.from(groupSlugs) as string[]
            const groupPermissions = permissions.filter((p) =>
              groupSlugsArray.includes(p.slug)
            )
            const groupPermissionIds = groupPermissions.map((p) => p.id)
            const allSelected = groupPermissionIds.every((id) =>
              selectedPermissions.has(id)
            )

            return (
              <Card key={groupName}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{groupName}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAll(groupSlugsArray)}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.has(permission.id)}
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
                          {permission.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {permission.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                            {permission.slug}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Permissions
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
