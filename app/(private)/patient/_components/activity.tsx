'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, Cell, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

const chartData = [
  { day: 'Mon', activity: 40 },
  { day: 'Tue', activity: 70 },
  { day: 'Wed', activity: 55 },
  { day: 'Thu', activity: 100 },
  { day: 'Fri', activity: 25 },
  { day: 'Sat', activity: 35 },
  { day: 'Sun', activity: 60 },
];

const chartConfig = {
  activity: {
    label: 'Activity',
    color: 'hsl(201.99 70.31% 44.90%)',
  },
} satisfies ChartConfig;

export function ActivityChart() {
  return (
    <Card className="w-full lg:h-[350px] bg-background space-y-2 px-6">
      <CardHeader>
        <CardTitle className="text-base text-foreground font-normal">
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-20">
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted"
              tick={{ fontSize: 12 }}
            />
            <Bar
              dataKey="activity"
              radius={[6, 6, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === 'Thu' ? 'hsl(201.99 70.31% 44.90%)' : 'hsl(203.41 71.43% 93.73%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}