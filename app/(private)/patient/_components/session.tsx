"use client"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useFetch } from "@/hooks/use-fetch"
import { Typography } from "../../../../components/ui/typography"

type PatientSessionHistoryItem = {
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
  } = useFetch<PatientSessionHistoryItem[]>({
    path: "/api/appointments/patient/session-history?limit=5",
    queryKey: ["patient", "session-history"],
  })

  return (
    <div className="bg-background border rounded-md p-2 w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography variant="span" className="pl-1 text-foreground">
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
              <Link href="/patient/session">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="sm" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="p" className="text-muted-foreground text-sm">
              Failed to load session history. Please try again.
            </Typography>
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="p" className="text-muted-foreground text-sm">
              No completed sessions found yet.
            </Typography>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Specialist</TableHead>
                <TableHead className="whitespace-nowrap">Session for</TableHead>
                <TableHead className="whitespace-nowrap">Session on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const dateText = session.scheduledAt
                  ? new Date(session.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(session.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })

                const initials = session.doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <TableRow key={session.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center truncate gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={session.doctor.image ?? undefined}
                            alt={session.doctor.name}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{session.doctor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {session.appointmentFor || "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {dateText}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
