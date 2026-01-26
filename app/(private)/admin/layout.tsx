"use client"

import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"
import Footer from "./footer"
import Header from "./header"
import { AdminSidebar, adminMenuItems } from "./sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const hideSidebar = pathname === "/admin/update-profile"
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { hasPermission, loading: isLoadingPermissions } =
    useUserPermissions(userId)

  // Fetch user session
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

  // Redirect if user is on dashboard but doesn't have permission
  useEffect(() => {
    if (isLoadingUser || isLoadingPermissions) {
      return
    }

    // Only redirect if user is on /admin (dashboard) and doesn't have permission
    if (pathname === "/admin" || pathname === "/admin/") {
      if (!hasPermission("dashboard.view")) {
        // Find the first menu item the user has permission for
        // Skip dashboard since we already know they don't have access
        const firstAvailablePage = adminMenuItems
          .filter((item) => item.href !== "/admin")
          .find((item) => hasPermission(item.permission))

        if (firstAvailablePage) {
          // @ts-expect-error - href is a valid admin route
          router.replace(firstAvailablePage.href)
        }
      }
    }
  }, [isLoadingUser, isLoadingPermissions, hasPermission, router, pathname])

  // Show loading while checking permissions and redirecting
  if (isLoadingUser || isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" variant="spinner" />
      </div>
    )
  }

  // Show loading if user is on dashboard but doesn't have permission (redirecting)
  if (
    (pathname === "/admin" || pathname === "/admin/") &&
    !hasPermission("dashboard.view")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" variant="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col bg-muted">
        <SidebarProvider>
          <div className="flex flex-col min-h-svh w-full">
            <Header />
            <div className="flex flex-1 pt-[60px] min-h-0 overflow-hidden">
              {!hideSidebar && <AdminSidebar />}
              <main className="flex-1 bg-muted lg:p-4 md:p-2 p-5 overflow-y-auto min-h-0">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
