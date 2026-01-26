"use client"

import { useEffect, useState } from "react"
import auth from "@/lib/auth"
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

export function useUserPermissions(userId: string | null) {
  const [permissions, setPermissions] = useState<string[]>([])
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isMainAdminDetermined, setIsMainAdminDetermined] = useState(false)

  // Only make the request if userId exists and is not empty
  // Use a placeholder path when userId is null to satisfy useFetch requirement
  // but enabled: false will prevent the actual request
  // Disable query if we've already determined user is main admin
  const {
    data,
    isLoading,
    error: fetchError,
  } = useFetch<TeamMemberResponse>({
    path:
      userId && typeof userId === "string" && userId.trim().length > 0
        ? `/api/admin/team-members/${userId}`
        : "/api/admin/team-members/placeholder",
    queryKey: ["user-permissions", userId],
    config: {
      enabled:
        !!userId &&
        typeof userId === "string" &&
        userId.trim().length > 0 &&
        !isMainAdminDetermined,
      refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: false, // Disable automatic refetching
    },
  })

  useEffect(() => {
    // If we've already determined the user is a main admin, don't process again
    if (isMainAdminDetermined && permissions.includes("*")) {
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
      console.log("Loaded permissions:", permissionSlugs)
      console.log("Team member role:", data.role.name)
      setPermissions(permissionSlugs)
      setRole(data.role)
      setError(null)
      setIsMainAdminDetermined(false) // Not main admin if they have team member record
      setLoading(false)
    } else if (fetchError) {
      // Handle errors
      const axiosError = fetchError as
        | { response?: { status?: number } }
        | Error
      const is404 =
        axiosError &&
        typeof axiosError === "object" &&
        "response" in axiosError &&
        axiosError.response?.status === 404

      if (is404) {
        // Check if user is main admin (role === "admin")
        // Main admin without team member record should have all permissions
        auth
          .getSession()
          .then((session) => {
            const userRole = session.data?.user?.role
            if (userRole === "admin") {
              // Main admin without team member record - grant all permissions
              console.log(
                "Main admin detected (no team member record), granting all permissions"
              )
              setPermissions(["*"]) // Special marker for "all permissions"
              setRole(null)
              setError(null)
              setIsMainAdminDetermined(true) // Mark as determined to prevent refetching
              setLoading(false)
            } else {
              // 404 but not main admin - no permissions
              setPermissions([])
              setRole(null)
              setError(null)
              setIsMainAdminDetermined(false)
              setLoading(false)
            }
          })
          .catch((error) => {
            console.error("Failed to check user role:", error)
            // On error checking role, assume no permissions
            setPermissions([])
            setRole(null)
            setError(null)
            setIsMainAdminDetermined(false)
            setLoading(false)
          })
      } else {
        // Non-404 error
        setError(
          fetchError instanceof Error
            ? fetchError
            : new Error("Failed to fetch permissions")
        )
        setPermissions([])
        setRole(null)
        setIsMainAdminDetermined(false)
        setLoading(false)
      }
    } else if (!isLoading && !fetchError) {
      // Data loaded but no team member record - check if main admin
      auth
        .getSession()
        .then((session) => {
          const userRole = session.data?.user?.role
          if (userRole === "admin") {
            // Main admin without team member record - grant all permissions
            console.log(
              "Main admin detected (no team member record), granting all permissions"
            )
            setPermissions(["*"]) // Special marker for "all permissions"
            setRole(null)
            setError(null)
            setIsMainAdminDetermined(true) // Mark as determined to prevent refetching
          } else {
            // Not main admin and no team member record
            console.log("No team member data found, but no error")
            setPermissions([])
            setRole(null)
            setIsMainAdminDetermined(false)
          }
          setLoading(false)
        })
        .catch((error) => {
          console.error("Failed to check user role:", error)
          // On error checking role, assume no permissions
          setPermissions([])
          setRole(null)
          setIsMainAdminDetermined(false)
          setLoading(false)
        })
    }

    // Only set loading to false if we've processed the data or error
    // Don't set it here since we set it in each branch above
  }, [data, isLoading, fetchError, isMainAdminDetermined, permissions])

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
