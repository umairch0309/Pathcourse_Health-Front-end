import { Typography } from "@/components/ui/typography"
import Availability from "./_components/availability"
import { Reviews } from "./_components/reviews"
import { AppointmentsTable } from "./_components/session"
import { TotalSessions } from "./_components/total-sessions"

export default function SpecialistPage() {
  return (
    <div>
      <Typography variant="h5" className="text-foreground font-bold">
        Dashboard
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <Availability />
        <TotalSessions />

      </div>

      <div className="mt-4">
        <AppointmentsTable />
      </div>

      <div className="mt-4">
      <Reviews />
      </div>
    </div>
  )
}
