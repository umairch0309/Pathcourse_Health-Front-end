import { Typography } from "@/components/ui/typography"

type Doctor = {
  education: Array<{
    id: string
    degree: string
    institution_name: string
    startYear: string
    endYear: string
  }>
}

type EducationInfoProps = {
  doctor: Doctor
}

export default function EducationInfo({ doctor }: EducationInfoProps) {
  if (!doctor.education || doctor.education.length === 0) {
    return (
      <div className="space-y-6">
        <Typography variant="p" className="text-foreground">
          No education information available.
        </Typography>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {doctor.education.map((edu, index) => (
        <div key={edu.id} className="bg-muted rounded-lg p-4 space-y-4">
          <Typography variant="p" className="font-bold text-foreground">
            Degree {String(index + 1).padStart(2, "0")}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Title</div>
              <div className="text-md text-foreground">{edu.degree || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Institute:</div>
              <div className="text-md text-foreground">
                {edu.institution_name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Start date:</div>
              <div className="text-md text-foreground">
                {edu.startYear
                  ? new Date(edu.startYear).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Completion date
              </div>
              <div className="text-md text-foreground">
                {edu.endYear
                  ? new Date(edu.endYear).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
