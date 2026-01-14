import { Typography } from '@/components/ui/typography';

type Doctor = {
  user: {
    email: string
  }
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
}

type ContactInfoProps = {
  doctor: Doctor
}

export default function ContactInfo({ doctor }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <Typography variant="p" className="font-bold text-foreground">Personal Contact Info</Typography>
        <div className="grid lg:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Email:</div>
            <div className="text-md text-foreground">{doctor.user.email || "-"}</div>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <Typography variant="p" className="font-bold text-foreground">Professional Contact Info</Typography>
        <div className="grid lg:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Contact no.</div>
            <div className="text-foreground">{doctor.professional_contact || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email:</div>
            <div className="text-foreground">{doctor.professional_email || "-"}</div>
          </div>
          {doctor.secondary_contact && (
            <div>
              <div className="text-sm text-muted-foreground">Secondary Contact:</div>
              <div className="text-foreground">{doctor.secondary_contact}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}