import { Typography } from "@/components/ui/typography";
import { TotalSessions } from "./_components/total-sessions";
import { Reviews } from "./_components/reviews";
import { PaymentsTable } from "./_components/payments";
import { AppointmentsTable } from "./_components/session";
import Availability from "./_components/availability";

export default function SpecialistPage() {
  return (
    <div >
      <Typography variant="h5" className="text-foreground font-bold">Dashboard</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TotalSessions />
        <Availability />
        <Reviews />
      </div>

      <div className="mt-4">
        <PaymentsTable />
      </div>

      <div className="mt-4">
        <AppointmentsTable />
      </div>
    </div>
  );
}

