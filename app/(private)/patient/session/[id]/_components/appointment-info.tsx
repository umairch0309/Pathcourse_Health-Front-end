import { format } from "date-fns"
import { Calendar, Clock, FileText, HeartPulse } from "lucide-react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppointmentData } from "../page"

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

type AppointmentInfoProps = {
  appointment: AppointmentData
}

export default function AppointmentInfo({ appointment }: AppointmentInfoProps) {
  const scheduledDate = new Date(appointment.scheduledAt)

  const dateLabel = format(scheduledDate, "EEEE, MMM dd, yyyy")

  const startTime = appointment.startedAt
    ? format(new Date(appointment.startedAt), "hh:mm a")
    : null
  const endTime = appointment.endedAt
    ? format(new Date(appointment.endedAt), "hh:mm a")
    : null

  const timeLabel =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : format(scheduledDate, "hh:mm a")

  const sessionService = appointment.issue || "-"

  const statusMap: Record<AppointmentData["status"], string> = {
    BOOKED: "Scheduled",
    COMPLETED: "Completed",
    NO_SHOW: "No show",
  }

  const statusLabel = statusMap[appointment.status]

  return (
    <Card className="w-full bg-background">
      <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
        <CardTitle className="text-base font-semibold sm:text-lg">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-4 grid gap-4 border-b px-4 pb-4 sm:mb-6 sm:gap-6 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <InfoItem
            icon={FileText}
            label="Session ID:"
            value={appointment.id}
          />
          <InfoItem
            icon={Calendar}
            label="Date of Session:"
            value={dateLabel}
          />
          <InfoItem icon={Clock} label="Time of Session:" value={timeLabel} />
          <InfoItem
            icon={HeartPulse}
            label="Session service:"
            value={sessionService}
          />
          <InfoItem
            icon={HeartPulse}
            label="Session status:"
            value={statusLabel}
          />
        </div>
      </CardContent>
    </Card>
  )
}
