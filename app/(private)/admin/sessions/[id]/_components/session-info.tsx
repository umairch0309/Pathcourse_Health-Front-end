import type React from "react"
import { Calendar, Clock, FileText, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appointment = {
  id: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  issue: string
  appointmentFor: string
  appointmentNotes: {
    id: string
    appointmentId: string
    doctorId: string
    notes: string
    createdAt: string
    updatedAt: string
  } | null
  sessionReason: {
    id: string
    appointmentId: string
    reason: string
    createdAt: string
    updatedAt: string
  } | null
}

type InfoItemProps = {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 lg:gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent sm:h-8 sm:w-8">
        <Icon className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4" />
      </div>
      <div className="grid min-w-0 gap-0.5">
        <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
        <div className="break-words text-sm font-medium sm:text-base">
          {value}
        </div>
      </div>
    </div>
  )
}

type SessionInfoProps = {
  appointment: Appointment
}

export default function SessionInfo({ appointment }: SessionInfoProps) {
  const scheduledDate = appointment.scheduledAt
    ? new Date(appointment.scheduledAt)
    : new Date(appointment.createdAt)

  const dateStr = scheduledDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const timeStr = appointment.scheduledAt
    ? scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Not scheduled"

  const statusColors = {
    BOOKED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    NO_SHOW: "bg-red-100 text-red-800",
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
        <CardTitle className="text-base font-semibold sm:text-lg">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-4 grid gap-4 px-4 pb-4 sm:mb-6 sm:gap-6 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <InfoItem
            icon={FileText}
            label="Session ID:"
            value={appointment.id}
          />
          <InfoItem icon={Calendar} label="Date of Session:" value={dateStr} />
          <InfoItem icon={Clock} label="Time of Session:" value={timeStr} />
          <InfoItem
            icon={FileText}
            label="Status:"
            value={
              <Badge
                className={
                  statusColors[appointment.status] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {appointment.status.replace("_", " ")}
              </Badge>
            }
          />
          <InfoItem
            icon={MessageSquare}
            label="Appointment For:"
            value={
              appointment.appointmentFor === "self" ? "Self" : "Someone Else"
            }
          />
          {appointment.appointmentNotes && (
            <InfoItem
              icon={MessageSquare}
              label="Doctor Notes:"
              value={
                <div className="max-w-md">
                  <p className="text-sm">
                    {appointment.appointmentNotes.notes}
                  </p>
                </div>
              }
            />
          )}
        </div>
        <div className="mt-4">
          <InfoItem
            icon={FileText}
            label="Issue/Reason:"
            value={appointment.issue}
          />
        </div>
        {appointment.sessionReason && (
          <div className="mt-4">
            <InfoItem
              icon={MessageSquare}
              label="Session Reason:"
              value={appointment.sessionReason.reason.replace(/_/g, " ")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
