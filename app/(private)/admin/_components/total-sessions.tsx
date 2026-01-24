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

type DashboardStats = {
  totalApprovedDoctors: number
  totalPatients: number
  totalUserQueries: number
  totalSessionsThisMonth: number
  completedSessionsThisMonth: number
}

export function TotalSessions() {
  const {
    data: stats,
    isLoading,
    error,
  } = useFetch<DashboardStats>({
    path: "/api/admin/dashboard/stats",
    queryKey: ["admin-dashboard-stats"],
  })

  const total = stats?.totalSessionsThisMonth ?? 0
  const completed = stats?.completedSessionsThisMonth ?? 0
  const completedPercent =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0

  return (
    <Card className="w-full lg:h-[350px] bg-background space-y-2 px-6">
      <CardHeader>
        <CardTitle className="text-foreground mb-3 font-medium">
          Sessions
        </CardTitle>
        <CardDescription className="text-muted-foreground -mb-6">
          Total no. of Sessions this month.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center mt-4">
        {error ? (
          <div className="flex items-center justify-center min-h-[180px]">
            <Typography variant="p" className="text-sm text-muted-foreground">
              Error loading data
            </Typography>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[180px]">
            <Loader size="sm" />
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

      <CardFooter className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-muted" /> Total: {total}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary" /> Completed:{" "}
          {completed}
        </div>
      </CardFooter>
    </Card>
  )
}
