"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import Footer from "./footer"
import Header from "./header"
import { AdminSidebar } from "./sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideSidebar = pathname === "/admin/update-profile"

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
