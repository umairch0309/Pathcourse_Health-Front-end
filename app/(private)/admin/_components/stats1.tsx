"use client"
import { Loader } from "@/components/loader"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type DashboardStats = {
  totalApprovedDoctors: number
  totalPatients: number
  totalUserQueries: number
  totalSessionsThisMonth: number
  completedSessionsThisMonth: number
}

export function DashboardStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useFetch<DashboardStats>({
    path: "/api/admin/dashboard/stats",
    queryKey: ["admin-dashboard-stats"],
  })

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:flex-col md:grid md:grid-cols-1">
      <Card className="lg:h-[170px] h-auto w-full bg-background space-y-4">
        <CardHeader>
          <CardTitle className="text-foreground mb-2 font-medium">
            Specialists
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-[-30px]">
            Total Specialists registered on platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-foreground text-4xl mt-1 font-bold">
          {error ? (
            <Typography variant="p" className="text-sm text-muted-foreground">
              Error loading data
            </Typography>
          ) : (
            (stats?.totalApprovedDoctors ?? "-")
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card className="lg:h-[170px] h-auto w-full bg-background space-y-4">
        <CardHeader>
          <CardTitle className="text-foreground mb-2">Total Users</CardTitle>
          <CardDescription className="text-muted-foreground mb-[-30px]">
            Total no of users registered on platform to avail services.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-foreground text-4xl font-bold mt-1">
          {error ? (
            <Typography variant="p" className="text-sm text-muted-foreground">
              Error loading data
            </Typography>
          ) : (
            (stats?.totalPatients ?? "-")
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}
