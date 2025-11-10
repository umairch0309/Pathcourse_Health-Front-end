'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function DashboardStats() {
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
          6346
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card className="lg:h-[170px] h-auto w-full bg-background space-y-4">
        <CardHeader>
          <CardTitle className="text-foreground mb-2">
            Total Users
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-[-30px]">
            Total no of users registered on platform to avail services.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-foreground text-4xl font-bold mt-1">
          +420K
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}