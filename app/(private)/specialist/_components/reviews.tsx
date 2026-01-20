"use client"

import { MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type DoctorSessionReasonHistoryItem = {
  appointmentId: string
  doctorId: string
  patientId: string
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    employeeCode: string | null
  }
  sessionReason: {
    reason:
      | "LETTING_OFF_STEAM"
      | "TALKING_THROUGH_STRESS_OR_UNCERTAINTY"
      | "NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD"
    createdAt: string
    updatedAt: string
  }
}

const SESSION_REASON_META: Record<
  DoctorSessionReasonHistoryItem["sessionReason"]["reason"],
  { label: string; description: string }
> = {
  LETTING_OFF_STEAM: {
    label: "Letting Off Steam",
    description:
      "Patient needs to vent or express frustrations without seeking solutions",
  },
  TALKING_THROUGH_STRESS_OR_UNCERTAINTY: {
    label: "Talking Through Stress or Uncertainty",
    description:
      "Patient is dealing with stress or uncertainty and needs guidance",
  },
  NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD: {
    label: "Needing Perspective During a Demanding Period",
    description:
      "Patient needs professional insight during a challenging situation",
  },
}

export function Reviews() {
  const {
    data: sessionReasons,
    isLoading,
    error,
  } = useFetch<DoctorSessionReasonHistoryItem[]>({
    path: "/api/appointments/doctor/session-reasons?limit=3",
    queryKey: ["doctor", "session-reasons"],
  })

  return (
    <Card className="w-full lg:h-[350px] bg-background px-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base font-medium">
            User Data
          </CardTitle>
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
      </CardHeader>

      <CardContent className="flex flex-col space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="sm" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="p" className="text-muted-foreground text-sm">
              Failed to load session reasons. Please try again.
            </Typography>
          </div>
        ) : !sessionReasons || sessionReasons.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="p" className="text-muted-foreground text-sm">
              No recent session reasons found.
            </Typography>
          </div>
        ) : (
          sessionReasons.map((item) => {
            const { patient, sessionReason, endedAt } = item
            const reasonMeta = SESSION_REASON_META[sessionReason.reason]
            const isAnonymous =
              !patient.name && !patient.email && !!patient.employeeCode
            const primaryText = isAnonymous
              ? patient.employeeCode || ""
              : patient.name || "Unknown patient"
            const secondaryText = isAnonymous ? "" : patient.email || ""
            const endedAtText = endedAt
              ? new Date(endedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null

            return (
              <div
                key={item.appointmentId}
                className="flex gap-3 border-b-1 border-muted-foreground p-2"
              >
                <div className="w-12 flex-shrink-0 flex items-center justify-center">
                  {patient.image ? (
                    <Image
                      src={patient.image}
                      alt={primaryText || "Patient"}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                      {(primaryText || "P").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="text-sm flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-foreground font-medium truncate">
                      {primaryText}
                    </p>
                    {endedAtText && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {endedAtText}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-xs font-semibold text-foreground">
                      {reasonMeta?.label ?? sessionReason.reason}
                    </p>
                    {reasonMeta?.description && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {reasonMeta.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>

      <CardFooter />
    </Card>
  )
}
