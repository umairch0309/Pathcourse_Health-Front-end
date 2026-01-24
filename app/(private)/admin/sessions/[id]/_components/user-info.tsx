import { Building2, Calendar, Mail, Phone, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appointment = {
  id: string
  patientId: string
  appointmentFor: string
  age: number | null
  patientName: string | null
  patientAge: number | null
  relationWithPatient: string | null
  patient: {
    id: string
    name: string
    email: string
    phone: string | null
    employeeCode: string | null
    enterpriseCode: string | null
    createdAt: string
  }
}

type InfoItemProps = {
  icon: React.ElementType
  label: string
  value: string | number | null | undefined
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <div className="grid gap-0.5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value || "-"}</div>
      </div>
    </div>
  )
}

type UserInfoProps = {
  appointment: Appointment
}

export default function UserInfo({ appointment }: UserInfoProps) {
  const patientCreatedAt = new Date(appointment.patient.createdAt)

  return (
    <Card className="bg-background w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Patient Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 border-b pb-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem icon={User} label="Patient name:" value={appointment.patient.name} />
          <InfoItem icon={User} label="Patient ID:" value={appointment.patient.id} />
          <InfoItem
            icon={Calendar}
            label="Account Created:"
            value={patientCreatedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          />
          {appointment.appointmentFor === "self" && appointment.age && (
            <InfoItem icon={User} label="Age:" value={`${appointment.age} years`} />
          )}
          {appointment.appointmentFor === "someone else" && (
            <>
              {appointment.patientName && (
                <InfoItem icon={User} label="Patient Name:" value={appointment.patientName} />
              )}
              {appointment.patientAge && (
                <InfoItem
                  icon={User}
                  label="Patient Age:"
                  value={`${appointment.patientAge} years`}
                />
              )}
              {appointment.relationWithPatient && (
                <InfoItem
                  icon={User}
                  label="Relation:"
                  value={appointment.relationWithPatient}
                />
              )}
            </>
          )}
          {appointment.patient.enterpriseCode && (
            <InfoItem
              icon={Building2}
              label="Enterprise Code:"
              value={appointment.patient.enterpriseCode}
            />
          )}
          {appointment.patient.employeeCode && (
            <InfoItem
              icon={Building2}
              label="Employee Code:"
              value={appointment.patient.employeeCode}
            />
          )}
        </div>
      </CardContent>

      <CardHeader className="pb-4 pt-0">
        <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointment.patient.phone && (
            <InfoItem icon={Phone} label="Contact no.:" value={appointment.patient.phone} />
          )}
          <InfoItem icon={Mail} label="Contact email:" value={appointment.patient.email} />
        </div>
      </CardContent>
    </Card>
  )
}

