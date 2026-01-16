"use client"
import { CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import { Loader } from "@/components/loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

  // Get description from API - use special_interest_area as the description
  const description =
    doctorData?.professionalExperience?.special_interest_area || ""

  const services = doctorData?.professionalExperience?.special_interest_area
    ? doctorData.professionalExperience.special_interest_area
        .split(",")
        .map((s) => s.trim())
    : ["Men's Health", "Women's Health", "Sextual Health", "Skin Care"]

  if (isLoading) {
    return (
      <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <Typography variant="h3" className="text-foreground font-bold mb-8">
            Specialist Details
          </Typography>

          {/* Loading Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 lg:mb-12">
            {/* Left Column - Placeholder */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden col-span-1 bg-muted animate-pulse" />

            {/* Right Column - Loading */}
            <div className="col-span-2 mt-4 lg:mt-0">
              <div className="flex items-center justify-center py-20">
                <Loader size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !doctorData) {
    return (
      <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h3" className="text-foreground font-bold mb-8">
            Specialist Details
          </Typography>
          <div className="text-center py-12">
            <Typography variant="p" className="text-muted-foreground">
              Failed to load specialist details. Please try again.
            </Typography>
            {onBack && (
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="mt-4"
              >
                Go Back
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <Typography variant="h3" className="text-foreground font-bold mb-8">
          Specialist Details
        </Typography>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 lg:mb-12">
          {/* Left Column - Specialist Image */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden col-span-1 bg-muted">
            {doctorData.user.image ? (
              <Image
                src={doctorData.user.image}
                alt={doctorData.user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Typography variant="p" className="text-muted-foreground">
                  No image available
                </Typography>
              </div>
            )}
          </div>

          {/* Right Column - Specialist Information */}
          <div className="col-span-2 mt-4 lg:mt-0">
            {/* Name and Availability Status */}
            <div className="flex items-start justify-between mb-2">
              <Typography variant="h4" className="text-foreground font-bold">
                {doctorData.user.name}
              </Typography>
              <div className="flex items-center gap-2">
                {doctorData.isAvailable ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:bg-green-500/20">
                      Available
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground"
                    >
                      Unavailable
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {description && (
              <Typography variant="span" className="text-foreground">
                {description}
              </Typography>
            )}

            {/* Professional Contact */}
            <div className="mt-2">
              <Typography variant="span" className="text-muted-foreground">
                Email:{" "}
                <span className="text-foreground">
                  {doctorData.professional_email}
                </span>
              </Typography>
              {doctorData.professional_contact && (
                <Typography
                  variant="span"
                  className="text-muted-foreground ml-4"
                >
                  Contact:{" "}
                  <span className="text-foreground">
                    {doctorData.professional_contact}
                  </span>
                </Typography>
              )}
            </div>

            {/* Services / Special Interest Areas */}
            <div className="mt-4">
              <Typography
                variant="p"
                className="text-muted-foreground font-semibold mb-3"
              >
                Special Interest Areas
              </Typography>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Badge
                    key={service}
                    variant="outline"
                    className="bg-muted text-foreground hover:bg-muted/80 border-border"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Other Details Section */}
        <div className="mb-12 bg-muted p-6 rounded-2xl lg:mt-0 mt-4">
          <Typography
            variant="h5"
            className="text-foreground font-semibold mb-4"
          >
            Other Details
          </Typography>
          <div className="space-y-3">
            {doctorData.professionalExperience?.languages &&
              doctorData.professionalExperience.languages.length > 0 && (
                <div>
                  <Typography variant="span" className="text-muted-foreground">
                    Languages:{" "}
                  </Typography>
                  <Typography variant="span" className="text-foreground">
                    {doctorData.professionalExperience.languages.join(", ")}
                  </Typography>
                </div>
              )}
            {doctorData.professionalExperience?.special_interest_area && (
              <div>
                <Typography variant="span" className="text-muted-foreground">
                  Special interest area:{" "}
                </Typography>
                <Typography variant="span" className="text-foreground">
                  {doctorData.professionalExperience.special_interest_area}
                </Typography>
              </div>
            )}
            {doctorData.professionalExperience?.age_group && (
              <div>
                <Typography variant="span" className="text-muted-foreground">
                  Age group:{" "}
                </Typography>
                <Typography variant="span" className="text-foreground">
                  {doctorData.professionalExperience.age_group}
                </Typography>
              </div>
            )}
            {doctorData.professionalExperience?.profession && (
              <div>
                <Typography variant="span" className="text-muted-foreground">
                  Profession:{" "}
                </Typography>
                <Typography variant="span" className="text-foreground">
                  {doctorData.professionalExperience.profession}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="default"
            size="lg"
            disabled={!doctorData.isAvailable}
            onClick={onContinue}
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
