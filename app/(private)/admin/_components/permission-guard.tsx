"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/loader"
import { Typography } from "@/components/ui/typography"
import auth from "@/lib/auth"
import { useUserPermissions } from "@/hooks/use-user-permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission: string
  fallback?: React.ReactNode
}

export function PermissionGuard({
  children,
  requiredPermission,
  fallback,
}: PermissionGuardProps) {
  const router = useRouter()
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
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" variant="spinner" />
      </div>
    )
  }

  if (!hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="w-full">
        <div className="bg-background p-6 rounded-md">
          <Typography variant="h5" className="font-bold text-foreground mb-2">
            Access Denied
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            You do not have permission to access this page. Required
            permission: {requiredPermission}
          </Typography>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

