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

export function DashboardStats2() {
  const {
    data: stats,
    isLoading,
    error,
  } = useFetch<DashboardStats>({
    path: "/api/admin/dashboard/stats",
    queryKey: ["admin-dashboard-stats"],
  })

  return (
    <div>
      <Card className="lg:h-[350px] h-auto w-full bg-background space-y-4">
        <CardHeader>
          <CardTitle className="text-foreground mb-6 mt-4 font-medium">
            Inquiries
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-[-30px]">
            Total user queries/contact forms submitted on platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-foreground text-4xl font-bold mt-8">
          {error ? (
            <Typography variant="p" className="text-sm text-muted-foreground">
              Error loading data
            </Typography>
          ) : (
            (stats?.totalUserQueries ?? "-")
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}
