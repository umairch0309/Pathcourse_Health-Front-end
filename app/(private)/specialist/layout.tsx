"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import Footer from "./footer"
import Header from "./header"
import { SpecialistSidebar } from "./sidebar"

export default function SpecialistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideSidebar = pathname === "/specialist/update-profile"
  const isOnDashboard =
    pathname === "/specialist" || pathname === "/specialist/"

  return (
    <div>
      <div className="flex flex-col bg-muted">
        <SidebarProvider>
          <div className="flex flex-col min-h-svh w-full">
            <Header />
            <div
              className={`flex flex-1 min-h-0 overflow-hidden ${isOnDashboard ? "pt-[60px]" : "pt-[60px]"}`}
            >
              {!hideSidebar && <SpecialistSidebar />}
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
