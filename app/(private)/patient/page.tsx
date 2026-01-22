import { Typography } from "@/components/ui/typography"
import { ActivityChart } from "./_components/activity"
import { AppointmentsTable } from "./_components/session"
import { TotalSessions } from "./_components/total-sessions"

export default function PatientPage() {
  return (
    <div>
      <Typography variant="h5" className="text-foreground font-bold">
        Dashboard
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <TotalSessions />
        <ActivityChart />
      </div>

      <div className="mt-4">
        <AppointmentsTable />
      </div>
    </div>
  )
}
