"use client"

import { Bar, BarChart, Cell, XAxis } from "recharts"
import { Loader } from "@/components/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type WeeklyActivityStats = {
  weekStart: string
  weekEnd: string
  days: {
    weekday: string // 'Mon', 'Tue', ...
    date: string
    count: number
  }[]
}

const chartConfig = {
  activity: {
    label: "Activity",
    color: "hsl(201.99 70.31% 44.90%)",
  },
} satisfies ChartConfig

export function ActivityChart() {
  const { data, isLoading, error } = useFetch<WeeklyActivityStats>({
    path: "/api/appointments/patient/stats/activity",
    queryKey: ["patient", "weekly-activity"],
  })

  const chartData =
    data?.days.map((d) => ({
      day: d.weekday,
      activity: d.count,
    })) || []

  return (
    <Card className="w-full bg-background space-y-2 px-6">
      <CardHeader>
        <CardTitle className="text-base text-foreground font-normal">
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader size="sm" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Typography variant="p" className="text-muted-foreground text-sm">
              Failed to load activity stats. Please try again.
            </Typography>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full mt-20"
          >
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted"
                tick={{ fontSize: 12 }}
              />
              <Bar dataKey="activity" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.day}
                    fill={
                      entry.day === "Thu"
                        ? "hsl(201.99 70.31% 44.90%)"
                        : "hsl(203.41 71.43% 93.73%)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
