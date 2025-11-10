'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function DashboardStats2() {
  return (
    <div >
      <Card className="lg:h-[350px] h-auto w-full bg-background space-y-4">
        <CardHeader>
          <CardTitle className="text-foreground mb-6 mt-4 font-medium">
            Inquiries
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-[-30px]">
            Total Doctor registered on platform including individual & linked with clinics.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-foreground text-4xl font-bold mt-8">
          355
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}