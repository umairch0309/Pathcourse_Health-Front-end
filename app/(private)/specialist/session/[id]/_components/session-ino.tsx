import { Calendar, Clock, FileText, HeartPulse } from "lucide-react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppointmentForDetails } from "./tabs"

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
  appointment: AppointmentForDetails
}

export default function AppointmentInfo({ appointment }: AppointmentInfoProps) {
  const scheduledDate = appointment.scheduledAt
    ? new Date(appointment.scheduledAt)
    : null

  const dateLabel = scheduledDate
    ? scheduledDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null

  const startTime = scheduledDate
    ? scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  const endTime = appointment.endedAt
    ? new Date(appointment.endedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  const timeLabel =
    startTime && endTime ? `${startTime} - ${endTime}` : startTime || "-"

  const sessionStatusLabel =
    appointment.status === "NO_SHOW"
      ? "No show"
      : appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()

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
          <InfoItem
            icon={Calendar}
            label="Date of Session:"
            value={dateLabel || "-"}
          />
          <InfoItem icon={Clock} label="Time of Session:" value={timeLabel} />
          <InfoItem
            icon={HeartPulse}
            label="Session status:"
            value={sessionStatusLabel}
          />
        </div>
      </CardContent>
    </Card>
  )
}
