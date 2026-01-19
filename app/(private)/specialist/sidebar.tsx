"use client"

import {
  Calendar,
  LayoutGrid,
  Settings,
  Star,
  User,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
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
import { cn } from "@/lib/utils"

const specialistMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/specialist",
  },
  {
    title: "Sessions",
    icon: Calendar,
    href: "/specialist/session",
  },
  {
    title: "User Data",
    icon: User,
    href: "/specialist/user-data",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/specialist/settings",
  },
]

export function SpecialistSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  // Close mobile sidebar when pathname changes
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-muted-foreground mb-2">
            Your Profile Access To
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {specialistMenuItems.map((item) => {
                const Icon = item.icon
                // For Dashboard, only match exact path. For others, match exact or sub-paths
                const isActive =
                  item.href === "/specialist"
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
                      <Link href={item.href as any}>
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
