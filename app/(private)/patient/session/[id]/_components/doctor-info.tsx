"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import type { FC } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import type { AppointmentData } from "../page"

export type DoctorInfoProps = {
  appointment: AppointmentData
}

const DoctorInfo: FC<DoctorInfoProps> = ({ appointment }) => {
  const { doctor } = appointment
  const profile = doctor.doctor
  const professionalExperience = profile?.professionalExperience

  const languages =
    professionalExperience?.languages &&
    professionalExperience.languages.length > 0
      ? professionalExperience.languages.join(", ")
      : "Not specified"

  const specialInterest =
    professionalExperience?.special_interest_area || "Not specified"

  const serviceDelivery = professionalExperience?.age_group || "Not specified"

  const profession = professionalExperience?.profession || "Specialist"

  const doctorImage = doctor.image || "/avatar.svg?height=300&width=300"

  return (
    <main className="min-h-screen space-y-4">
      <Card className="rounded-2xl w-full py-4 bg-background">
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="mx-auto lg:h-[300px] lg:w-[500px] h-[250px] w-[250px] overflow-hidden rounded-xl md:mx-0 relative">
              <Image
                src={doctorImage}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <Typography variant="h5" className="font-bold text-foreground">
                {doctor.name}
              </Typography>
              <div>
                <Badge
                  variant="default"
                  className="gap-1.5 px-4 py-2 rounded-full bg-accent text-foreground"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{profession}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl w-full bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Provider Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-xs font-medium tracking-wide text-primary">
                Languages
              </div>
              <div className="text-sm text-muted-foreground">{languages}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium tracking-wide text-primary">
                Special interest area
              </div>
              <div className="text-sm text-muted-foreground">
                {specialInterest}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium tracking-wide text-primary">
                Service delivery / Age group
              </div>
              <div className="text-sm text-muted-foreground">
                {serviceDelivery}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default DoctorInfo
