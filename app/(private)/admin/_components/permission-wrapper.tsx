"use client"

import { useEffect, useState } from "react"
import auth from "@/lib/auth"
import { useUserPermissions } from "@/hooks/use-user-permissions"

interface PermissionWrapperProps {
  children: (hasPermission: boolean) => React.ReactNode
  requiredPermission: string
}

export function PermissionWrapper({
  children,
  requiredPermission,
}: PermissionWrapperProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { hasPermission, loading } = useUserPermissions(userId)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchSession()
  }, [])

  if (isLoadingUser || loading) {
    return null
  }

  return <>{children(hasPermission(requiredPermission))}</>
}

