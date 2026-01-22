"use client"

import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar"
import { Loader } from "@/components/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"

type DoctorMonthlyStats = {
  month: number
  year: number
  totalAppointments: number
  completedAppointments: number
}

export function TotalSessions() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const {
    data: stats,
    isLoading,
    error,
  } = useFetch<DoctorMonthlyStats>({
    path: `/api/appointments/doctor/stats/monthly?month=${month}&year=${year}`,
    queryKey: ["doctor", "monthly-stats", month, year],
  })

  const total = stats?.totalAppointments ?? 0
  const completed = stats?.completedAppointments ?? 0
  const completedPercent =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0
  const remainingPercent = total > 0 ? 100 - completedPercent : 0

  return (
    <Card className="w-full lg:h-[350px] bg-background space-y-2 px-6">
      <CardHeader>
        <CardTitle className="text-foreground mb-3 font-bold">
          Sessions
        </CardTitle>
        <CardDescription className="text-muted-foreground -mb-6">
          Total no. of sessions scheduled and completed this month.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[150px]">
            <Loader size="sm" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[150px]">
            <Typography variant="p" className="text-muted-foreground text-sm">
              Failed to load session stats. Please try again.
            </Typography>
          </div>
        ) : (
          <div className="w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] relative">
            <CircularProgressbarWithChildren
              value={completedPercent}
              styles={buildStyles({
                rotation: 0,
                strokeLinecap: "round",
                // Match --primary from globals.css
                pathColor: "hsl(201.99 70.31% 44.90%)",
                trailColor: "#e5e7eb",
              })}
            >
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-[-2px]">
                  Completed this month
                </p>
                <p className="text-[24px] sm:text-[28px] font-bold text-foreground">
                  {completed}
                </p>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-muted" /> Total appointments
          this month ({total})
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary" /> Completed
          sessions ({completed})
        </div>
      </CardFooter>
    </Card>
  )
}
