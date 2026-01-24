"use client"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
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
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type Appointment = {
  id: string
  doctorId: string
  patientId: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  scheduledAt: string | null
  createdAt: string
  appointmentFor: string
  issue: string
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
  }
  patient: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
  }
}

type LastAppointmentsResponse = {
  appointments: Appointment[]
}

export function SessionHistoryTable() {
  const { data, isLoading, error, refetch } =
    useFetch<LastAppointmentsResponse>({
      path: "/api/admin/dashboard/last-appointments?limit=5",
      queryKey: ["admin-last-appointments"],
    })

  const appointments = data?.appointments || []

  return (
    <div className="bg-background border rounded-md p-4 w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography variant="span" className="pl-1 text-foreground">
          Session history
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
              <Link href="/admin/sessions">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        {error ? (
          <div className="py-4">
            <ErrorCard error={error} onRetry={() => refetch()} />
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Specialist</TableHead>
                <TableHead className="whitespace-nowrap">User</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <div className="flex items-center justify-center py-8">
                      <Loader size="sm" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyCard message="No appointments found yet." />
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => {
                  const doctorInitials = appointment.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  const patientInitials = appointment.patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  const dateStr = appointment.scheduledAt
                    ? new Date(appointment.scheduledAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : new Date(appointment.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center truncate gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={appointment.doctor.image || undefined}
                              alt={appointment.doctor.name}
                            />
                            <AvatarFallback className="text-xs">
                              {doctorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            {appointment.doctor.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center truncate gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={appointment.patient.image || undefined}
                              alt={appointment.patient.name}
                            />
                            <AvatarFallback className="text-xs">
                              {patientInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            {appointment.patient.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dateStr}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-xs">
                          {appointment.status.replace("_", " ")}
                        </span>
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
