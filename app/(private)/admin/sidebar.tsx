"use client"

import {
  Building2,
  Calendar,
  LayoutGrid,
  MailQuestion,
  Settings,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader } from "@/components/loader"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"
import { cn } from "@/lib/utils"

export const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/admin",
    permission: "dashboard.view",
  },
  {
    title: "Enterprises",
    icon: Building2,
    href: "/admin/enterprises",
    permission: "enterprise.view",
  },
  {
    title: "Specialists",
    icon: Users,
    href: "/admin/specialists",
    permission: "specialists.view",
  },
  {
    title: "Users",
    icon: User,
    href: "/admin/users",
    permission: "users.view",
  },
  {
    title: "Sessions",
    icon: Calendar,
    href: "/admin/sessions",
    permission: "sessions.view",
  },
  {
    title: "User Inquiries",
    icon: MailQuestion,
    href: "/admin/user-inquiries",
    permission: "user_inquiries.view",
  },
  {
    title: "Team Members",
    icon: Users,
    href: "/admin/team-members",
    permission: "settings.view", // Use settings.view for team management
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    permission: "settings.view",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        console.log("Session data:", session.data)
        if (session.data?.user?.id) {
          console.log("Setting userId:", session.data.user.id)
          setUserId(session.data.user.id)
          setUserRole(session.data.user.role || null)
        } else {
          console.warn("No user ID found in session:", session.data)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchSession()
  }, [])

  const {
    hasPermission,
    loading: isLoadingPermissions,
    error: permissionsError,
    permissions,
  } = useUserPermissions(
    userRole === "team_admin" || userRole === "team member" ? userId : null
  )

  // Close mobile sidebar when pathname changes
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  // Filter menu items based on permissions
  const visibleMenuItems = adminMenuItems.filter((item) => {
    // If still loading, show nothing (prevent flash of all items)
    if (isLoadingUser || isLoadingPermissions) {
      return false
    }
    // If no user ID, hide all items
    if (!userId) {
      return false
    }

    // Check if permissions are empty and error is 404 (no team member) or no error at all
    const errorStatus = permissionsError as
      | { response?: { status?: number } }
      | undefined
    const is404Error = errorStatus?.response?.status === 404
    const hasNoPermissions = permissions?.length === 0

    // If user is admin but has no team member record (backward compatibility),
    // show all items. This handles legacy admins who don't have team member records yet.
    if (
      userRole === "admin" &&
      hasNoPermissions &&
      (is404Error || !permissionsError)
    ) {
      return true
    }

    // If user is team admin but has no team member record, show nothing
    // (they need to be added as a team member first)
    if (userRole === "team_admin" && hasNoPermissions && is404Error) {
      return false
    }

    // If user has permissions loaded, check them
    if (!hasNoPermissions) {
      return hasPermission(item.permission)
    }

    // Default: show all for admins only
    return userRole === "admin"
  })

  // Check if team admin has no record
  const errorStatus = permissionsError as
    | { response?: { status?: number } }
    | undefined
  const is404Error = errorStatus?.response?.status === 404
  const hasNoPermissions = permissions?.length === 0
  const isTeamMemberWithoutRecord =
    (userRole === "team_admin" || userRole === "team member") &&
    hasNoPermissions &&
    is404Error

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        {isTeamMemberWithoutRecord ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-muted-foreground">
                <p className="font-medium mb-2">No Access</p>
                <p>
                  Your account needs to be added as a team member to access the
                  admin panel.
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarHeader className="text-muted-foreground mb-2">
              Your Profile Access To
            </SidebarHeader>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMenuItems.length === 0 ? (
                  <div className="p-4 flex items-center justify-center h-50">
                    <Loader size="lg" />
                  </div>
                ) : (
                  visibleMenuItems.map((item) => {
                    const Icon = item.icon
                    // For Dashboard, only match exact path. For others, match exact or sub-paths
                    const isActive =
                      item.href === "/admin"
                        ? pathname === item.href || pathname === item.href + "/"
                        : pathname === item.href ||
                          pathname?.startsWith(item.href + "/")

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "w-full justify-start gap-3",
                            "hover:bg-foreground hover:text-background",
                            "data-[active=true]:bg-foreground data-[active=true]:text-background",
                            isActive && "!bg-foreground !text-background"
                          )}
                        >
                          {/* @ts-expect-error - href is a valid admin route */}
                          <Link href={item.href}>
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
