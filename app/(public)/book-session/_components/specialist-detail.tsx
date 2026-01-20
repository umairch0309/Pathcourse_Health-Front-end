"use client"
import {
  Award,
  Briefcase,
  CheckCircle2,
  Languages,
  Mail,
  Phone,
  Users,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type DoctorData = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
  }
  documents?: {
    id: string
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  }
  education?: Array<{
    id: string
    degree: string
    institution_name: string
    startYear: string
    endYear: string | null
    document: string | null
  }>
  professionalExperience?: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  }
}

type SpecialistDetailProps = {
  doctorId: string
  onBack?: () => void
  onContinue?: () => void
}

export default function SpecialistDetail({
  doctorId,
  onBack,
  onContinue,
}: SpecialistDetailProps) {
  // Fetch doctor data from API
  const {
    data: doctorData,
    isLoading,
    error,
  } = useFetch<DoctorData>({
    path: `/api/doctor/${doctorId}`,
    queryKey: ["doctor", doctorId],
  })

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-background to-muted/20 min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <Typography variant="h3" className="text-foreground font-bold mb-2">
              Specialist Details
            </Typography>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          {/* Loading Content */}
          <Card className="shadow-lg border-2">
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Placeholder */}
                <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-muted animate-pulse" />

                {/* Right Column - Loading */}
                <div className="col-span-2 space-y-6">
                  <div className="space-y-3">
                    <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-1/2 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                  <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-6 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (error || !doctorData) {
    return (
      <section className="bg-gradient-to-b from-background to-muted/20 min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Typography variant="h3" className="text-foreground font-bold mb-2">
              Specialist Details
            </Typography>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
          <Card className="shadow-lg border-2">
            <CardContent className="p-12">
              <div className="text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <Typography
                  variant="h4"
                  className="text-foreground font-bold mb-2"
                >
                  Failed to Load
                </Typography>
                <Typography variant="p" className="text-muted-foreground mb-6">
                  We couldn't load the specialist details. Please try again
                  later.
                </Typography>
                {onBack && (
                  <Button variant="outline" size="lg" onClick={onBack}>
                    Go Back
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <Typography variant="h3" className="text-foreground font-bold mb-2">
            Specialist Details
          </Typography>
        </div>

        {/* Main Content Card */}
        <Card className="mb-8 shadow-none border-none">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Specialist Image */}
              <div className="lg:col-span-1">
                <div className="relative w-full h-[400px] lg:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-xl border-2 border-border/50">
                  {doctorData.user.image ? (
                    <Image
                      src={doctorData.user.image}
                      alt={doctorData.user.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
                      <div className="text-center">
                        <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <Typography
                          variant="p"
                          className="text-muted-foreground"
                        >
                          No image available
                        </Typography>
                      </div>
                    </div>
                  )}
                  {/* Availability Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    {doctorData.isAvailable ? (
                      <Badge className="bg-green-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-muted-foreground/90 text-white border-0 shadow-lg backdrop-blur-sm">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unavailable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Specialist Information */}
              <div className="lg:col-span-2 space-y-6 mt-10">
                {/* Name and Title */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Typography
                        variant="h3"
                        className="text-foreground font-bold mb-2"
                      >
                        {doctorData.user.name}
                      </Typography>
                      {doctorData.professionalExperience?.profession && (
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-lg"
                        >
                          {doctorData.professionalExperience.profession}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Typography
                        variant="span"
                        className="text-xs text-muted-foreground uppercase tracking-wide"
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-foreground font-medium"
                      >
                        {doctorData.professional_email}
                      </Typography>
                    </div>
                  </div>

                  {doctorData.professional_contact && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Typography
                          variant="span"
                          className="text-xs text-muted-foreground uppercase tracking-wide"
                        >
                          Contact
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-foreground font-medium"
                        >
                          {doctorData.professional_contact}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Details Section */}
        <Card className="mb-8 shadow-lg border-2">
          <CardContent className="p-6 lg:p-8">
            <Typography
              variant="h4"
              className="text-foreground font-bold mb-6 flex items-center gap-2"
            >
              <Briefcase className="h-6 w-6 text-primary" />
              Professional Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctorData.professionalExperience?.languages &&
                doctorData.professionalExperience.languages.length > 0 && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="h-5 w-5 text-primary" />
                      <Typography
                        variant="span"
                        className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        Languages
                      </Typography>
                    </div>
                    <Typography
                      variant="p"
                      className="text-foreground font-medium"
                    >
                      {doctorData.professionalExperience.languages.join(", ")}
                    </Typography>
                  </div>
                )}

              {doctorData.professionalExperience?.age_group && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <Typography
                      variant="span"
                      className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      Age Group
                    </Typography>
                  </div>
                  <Typography
                    variant="p"
                    className="text-foreground font-medium"
                  >
                    {doctorData.professionalExperience.age_group}
                  </Typography>
                </div>
              )}

              {doctorData.professionalExperience?.special_interest_area && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <Typography
                      variant="span"
                      className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      Special Interest Area
                    </Typography>
                  </div>
                  <Typography
                    variant="p"
                    className="text-foreground font-medium"
                  >
                    {doctorData.professionalExperience.special_interest_area}
                  </Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            variant="default"
            size="lg"
            disabled={!doctorData.isAvailable}
            onClick={onContinue}
            className="w-full sm:w-auto shadow-lg"
          >
            {doctorData.isAvailable
              ? "Select and Continue"
              : "Doctor Unavailable"}
          </Button>
        </div>
      </div>
    </section>
  )
}
