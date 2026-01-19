import { Typography } from "@/components/ui/typography";
import { ActivityChart } from "./_components/activity";
import { TotalSessions } from "./_components/total-sessions";
import { Reviews } from "./_components/reviews";
import { AppointmentsTable } from "./_components/session";

export default function PatientPage() {
  return (
    <div >
      <Typography variant="h5" className="text-foreground font-bold">Dashboard</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TotalSessions />
        <ActivityChart />
        <Reviews />
      </div>

      <div className="mt-4">
        <AppointmentsTable />
      </div>
    </div>
  );
}

