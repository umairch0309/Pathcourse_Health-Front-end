"use client"

import { Typography } from "@/components/ui/typography"
import { Inquiries } from "./_components/inquiries"
import { SessionHistoryTable } from "./_components/session-history"
import { DashboardStats } from "./_components/stats1"
import { DashboardStats2 } from "./_components/stats2"
import { TotalSessions } from "./_components/total-sessions"

export default function AdminPage() {
  return (
    <div>
      <Typography variant="h5" className="text-foreground font-bold">
        Dashboard
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats />
        <DashboardStats2 />
        <TotalSessions />
        <Inquiries />
      </div>

      <div className="mt-4">
        <SessionHistoryTable />
      </div>
    </div>
  )
}
