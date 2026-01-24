"use client"

import {
  Badge,
  Building2,
  Calendar,
  Mail,
  Phone,
  User,
  VenusAndMars,
} from "lucide-react"
import { useParams } from "next/navigation"
import { Loader } from "@/components/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type Patient = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  onboardingStage: string | null
  enterpriseCode: string | null
  employeeCode: string | null
  isAnonymous: boolean | null
  createdAt: string
  updatedAt: string
  userInfo: {
    id: string
    gender: string | null
    dateOfBirth: string | null
    phone: string | null
    address: string | null
  } | null
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
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid gap-0.5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value || "-"}</div>
      </div>
    </div>
  )
}

function calculateAge(dateOfBirth: string | null): string | null {
  if (!dateOfBirth) return null
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return `${age} years`
}

export default function PatientInfo() {
  const params = useParams()
  const patientId = params.id as string

  const { data: patient, isLoading } = useFetch<Patient>({
    path: `/api/admin/patients/${patientId}`,
    queryKey: ["admin-patient", patientId],
  })

  if (isLoading) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-2">
          User Details
        </Typography>
        <Card className="bg-background w-full">
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-2">
          User Details
        </Typography>
        <Card className="bg-background w-full">
          <CardContent>
            <Typography variant="p" className="text-foreground">
              Patient not found
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  }

  const age = calculateAge(patient.userInfo?.dateOfBirth || null)

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-foreground mb-2">
        User Details
      </Typography>
      <Card className="bg-background w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 border-b pb-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem icon={User} label="User name:" value={patient.name} />
            {patient.userInfo?.dateOfBirth && (
              <InfoItem
                icon={Calendar}
                label="Date of Birth:"
                value={new Date(
                  patient.userInfo.dateOfBirth
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            )}
            {age && <InfoItem icon={User} label="User Age:" value={age} />}
            {patient.userInfo?.gender && (
              <InfoItem
                icon={VenusAndMars}
                label="User Gender:"
                value={patient.userInfo.gender}
              />
            )}
            {patient.enterpriseCode && (
              <InfoItem
                icon={Building2}
                label="Enterprise Code:"
                value={patient.enterpriseCode}
              />
            )}
            {patient.employeeCode && (
              <InfoItem
                icon={Badge}
                label="Employee Code:"
                value={patient.employeeCode}
              />
            )}
          </div>
        </CardContent>

        <CardHeader className="pb-4 pt-0">
          <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem
              icon={Phone}
              label="Contact no.:"
              value={patient.phone || patient.userInfo?.phone}
            />
            <InfoItem
              icon={Mail}
              label="Contact email:"
              value={patient.email}
            />
            {patient.userInfo?.address && (
              <InfoItem
                icon={Mail}
                label="Address:"
                value={patient.userInfo.address}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
