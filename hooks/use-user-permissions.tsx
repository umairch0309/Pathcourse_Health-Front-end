"use client"

import { useEffect, useState } from "react"
import { useFetch } from "./use-fetch"

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

// API returns team member directly, not nested
type TeamMemberResponse = TeamMember

export function useUserPermissions(
  userId: string | null,
  userRole?: string | null
) {
  const [permissions, setPermissions] = useState<string[]>([])
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState<boolean>(!!userId)
  const [error, setError] = useState<Error | null>(null)

  // Check if user is a main admin (role is "admin" or similar)
  const isMainAdmin = userRole === "admin"

  const {
    data,
    isLoading,
    error: fetchError,
  } = useFetch<TeamMemberResponse>({
    path:
      userId &&
      typeof userId === "string" &&
      userId.trim().length > 0 &&
      !isMainAdmin
        ? `/api/admin/team-members/${userId}`
        : "/api/admin/team-members/placeholder",
    queryKey: ["user-permissions", userId],
    config: {
      enabled:
        !!userId &&
        typeof userId === "string" &&
        userId.trim().length > 0 &&
        !isMainAdmin,
      refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: false, // Disable automatic refetching
    },
  })

  useEffect(() => {
    // If there is no userId, don't attempt to load permissions
    if (!userId) {
      setLoading(false)
      return
    }

    // If user is a main admin, grant all permissions
    if (isMainAdmin) {
      console.log("Main admin detected, granting all permissions")
      setPermissions(["*"])
      setRole({
        id: "admin",
        name: "Admin",
        description: null,
        permissions: [],
      })
      setError(null)
      setLoading(false)
      return
    }

    if (isLoading) {
      setLoading(true)
      return
    }

    // API returns team member directly, not nested in teamMember property
    console.log("useUserPermissions - data:", data)
    console.log("useUserPermissions - isLoading:", isLoading)
    console.log("useUserPermissions - fetchError:", fetchError)

    if (data?.role?.permissions) {
      const permissionSlugs = data.role.permissions.map((p) => p.slug)

      // Avoid unnecessary state updates if permissions have not changed
      const hasSamePermissions =
        permissions.length === permissionSlugs.length &&
        permissionSlugs.every((slug) => permissions.includes(slug))

      if (hasSamePermissions && role?.id === data.role.id && !error) {
        setLoading(false)
        return
      }

      console.log("Loaded permissions:", permissionSlugs)
      console.log("Team member role:", data.role.name)
      setPermissions(permissionSlugs)
      setRole(data.role)
      setError(null)
      setLoading(false)
      return
    }

    if (fetchError) {
      // Handle errors
      // On any error, clear permissions and propagate the error once
      setError(
        fetchError instanceof Error
          ? fetchError
          : new Error("Failed to fetch permissions")
      )
      setPermissions([])
      setRole(null)
      setLoading(false)
      return
    }

    if (!isLoading && !fetchError && !data) {
      // No data and no error: treat as no permissions
      if (permissions.length === 0 && !role && !error) {
        setLoading(false)
        return
      }
      console.log("No team member data found, but no error")
      setPermissions([])
      setRole(null)
      setError(null)
      setLoading(false)
    }
  }, [data, isLoading, fetchError, userId, isMainAdmin])

  const hasPermission = (slug: string) => {
    // Main admin with "*" permission has access to everything
    if (permissions.includes("*")) {
      return true
    }
    // If no permissions loaded and no error, assume no access
    // But this will be handled by the calling component
    return permissions.includes(slug)
  }

  const hasAnyPermission = (slugs: string[]) => {
    // Main admin with "*" permission has access to everything
    if (permissions.includes("*")) {
      return true
    }
    return slugs.some((slug) => permissions.includes(slug))
  }

  const hasAllPermissions = (slugs: string[]) => {
    // Main admin with "*" permission has access to everything
    if (permissions.includes("*")) {
      return true
    }
    return slugs.every((slug) => permissions.includes(slug))
  }

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    error,
  }
}
