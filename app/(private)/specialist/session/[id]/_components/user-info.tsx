import { Calendar, Mail, Phone, User } from "lucide-react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppointmentForDetails } from "./tabs"

type InfoItemProps = {
  icon: React.ElementType
  label: string
  value: string | number
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
        <Icon className="h-4 w-4 text-foreground " />
      </div>
      <div className="grid gap-0.5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}

type PatientInfoProps = {
  appointment: AppointmentForDetails
}

export default function PatientInfo({ appointment }: PatientInfoProps) {
  const { patient, appointmentFor, patientAge, age, uploadId } = appointment

  const isAnonymous = patient.isAnonymous
  const displayName = isAnonymous
    ? patient.employeeCode || "Anonymous user"
    : patient.name || "Unknown user"

  const sessionFor =
    appointmentFor === "self"
      ? "My Self"
      : appointmentFor === "someone else"
        ? "Someone Else"
        : "-"

  const rawAge = patientAge ?? age
  const displayAge =
    rawAge !== null && rawAge !== undefined ? `${rawAge} years` : "-"

  const contactPhone = appointment.patient.userInfo?.phone || "-"
  const contactEmail =
    !isAnonymous && appointment.patient.email ? appointment.patient.email : "-"
  const uploadValue = uploadId || "-"

  return (
    <Card className="bg-background w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 border-b pb-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem icon={User} label="User name:" value={displayName} />
          <InfoItem
            icon={Calendar}
            label="Session taken for:"
            value={sessionFor}
          />
          <InfoItem icon={Calendar} label="User Age:" value={displayAge} />
        </div>
      </CardContent>

      <CardHeader className="pb-4 pt-0">
        <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem icon={Phone} label="Contact no.:" value={contactPhone} />
          <InfoItem icon={Mail} label="Contact email:" value={contactEmail} />
          <InfoItem icon={User} label="Uploaded file ID:" value={uploadValue} />
        </div>
      </CardContent>
    </Card>
  )
}
