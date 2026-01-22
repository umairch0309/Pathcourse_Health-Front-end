"use client"

import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { Loader } from "@/components/loader"
import EmptyCard from "@/components/empty-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type DoctorSessionHistoryItem = {
  id: string
  doctorId: string
  patientId: string
  status: string
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
  age: number | null
  appointmentFor: string | null
  issue: string | null
  patientName: string | null
  patientAge: number | null
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    employeeCode: string | null
  }
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    employeeCode: string | null
  }
}

export function AppointmentsTable() {
  const {
    data: sessions,
    isLoading,
    error,
  } = useFetch<DoctorSessionHistoryItem[]>({
    path: "/api/appointments/doctor/session-history?limit=4",
    queryKey: ["doctor", "session-history"],
  })

  return (
    <div className="bg-background border rounded-md p-2 lg:h-[300px] w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography
          variant="span"
          className="pl-6 text-foreground text-base font-medium"
        >
          Session History
        </Typography>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-[30px] w-[30px] border-muted-foreground border-1 rounded-full"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem asChild>
              <Link href="/specialist/session">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto px-8">
        {error ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="p" className="text-muted-foreground text-sm">
              Failed to load session history. Please try again.
            </Typography>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">User</TableHead>
                <TableHead className="whitespace-nowrap">Session for</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">
                  Date &amp; Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <div className="flex items-center justify-center py-8">
                      <Loader size="sm" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !sessions || sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <EmptyCard message="No completed sessions found yet." />
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => {
                  const dateText = session.scheduledAt
                    ? new Date(session.scheduledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"
                  const timeText = session.scheduledAt
                    ? new Date(session.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""

                  const isAnonymous =
                    !session.patient?.name &&
                    !session.patient?.email &&
                    !!session.patient?.employeeCode
                  const userDisplay = isAnonymous
                    ? session.patient?.employeeCode || ""
                    : session.patient?.name || session.patientName || "Unknown"

                  const sessionFor =
                    session.appointmentFor ||
                    session.patientName ||
                    session.patient?.name ||
                    "N/A"

                  return (
                    <TableRow key={session.id}>
                      <TableCell className="whitespace-nowrap">
                        {userDisplay}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {sessionFor}
                      </TableCell>
                      <TableCell className="whitespace-nowrap capitalize">
                        {session.status.toLowerCase()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dateText}
                        {timeText && ` • ${timeText}`}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
