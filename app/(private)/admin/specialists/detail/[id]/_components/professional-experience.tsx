import { Typography } from '@/components/ui/typography';

type Doctor = {
  professionalExperience: {
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type ProfessionalExperienceProps = {
  doctor: Doctor
}

export default function ProfessionalExperience({ doctor }: ProfessionalExperienceProps) {
  if (!doctor.professionalExperience) {
    return (
      <div>
        <Typography variant="p" className="text-foreground">
          No professional experience information available.
        </Typography>
      </div>
    )
  }

  const { profession, age_group, languages, special_interest_area } =
    doctor.professionalExperience

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Profession</div>
          <div className="text-md text-foreground">{profession || "-"}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Age group</div>
          <div className="text-md text-foreground">{age_group || "-"}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Language</div>
          <div className="text-md text-foreground">
            {languages && languages.length > 0 ? languages.join(", ") : "-"}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">Special Interest area</div>
        <div className="text-md text-foreground">
          {special_interest_area || "-"}
        </div>
      </div>
    </div>
  )
}