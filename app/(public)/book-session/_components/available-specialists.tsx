"use client"
import Image from "next/image"
import { useState } from "react"
import { Loader } from "@/components/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"

type AvailableSpecialistsProps = {
  onContinue: (doctorId: string) => void
}

type AvailableDoctor = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  isAvailable: boolean
  isInMeeting: boolean
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
  }
  professionalExperience: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type AvailableDoctorsResponse = {
  doctors: AvailableDoctor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AvailableSpecialists({
  onContinue,
}: AvailableSpecialistsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  // Fetch available doctors
  const { data: doctorsData, isLoading } = useFetch<AvailableDoctorsResponse>({
    path: "/api/doctors/available",
    queryKey: ["available-doctors"],
  })

  const availableDoctors =
    doctorsData?.doctors?.filter(
      (doctor) => doctor.isAvailable && !doctor.isInMeeting
    ) || []

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground font-bold">
              Our available specialists
            </Typography>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        </div>
      </section>
    )
  }

  if (availableDoctors.length === 0) {
    return (
      <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground font-bold">
              Our available specialists
            </Typography>
          </div>
          <div className="text-center py-12">
            <Typography variant="p" className="text-muted-foreground">
              No specialists are currently available. Please check back later.
            </Typography>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground font-bold">
            Our available specialists
          </Typography>
        </div>

        {/* Specialist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {availableDoctors.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => setSelectedDoctor(doctor.id)}
              className={`
                bg-muted rounded-2xl py-6 px-8 text-center items-center shadow-sm cursor-pointer transition-all duration-300 w-full
                ${
                  selectedDoctor === doctor.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }
              `}
            >
              {/* Doctor Image with Decorative Border */}
              <div className="relative mb-6 mx-auto size-50 flex items-center justify-center">
                {/* Top dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
                  <div className="w-2" />
                  <Image src="/dot.svg" alt="" width={10} height={10} />
                  <div className="w-2" />
                </div>

                {/* Circular border */}
                <div className="w-full h-full rounded-full border-2 border-secondary/50 p-3">
                  <div className="w-full h-full rounded-full overflow-hidden bg-accent">
                    <Avatar className="w-full h-full">
                      {doctor.user.image && (
                        <AvatarImage
                          src={doctor.user.image}
                          alt={doctor.user.name}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {getUserInitials(doctor.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Bottom dot */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 flex items-center gap-1">
                  <div className="w-2" />
                  <Image src="/dot.svg" alt="" width={10} height={10} />
                  <div className="w-2" />
                </div>
              </div>

              <Typography
                as="h3"
                variant="h5"
                className="text-center font-bold text-foreground"
              >
                {doctor.user.name}
              </Typography>

              <Typography
                variant="span"
                className="font-semibold text-center text-secondary"
              >
                {doctor.professionalExperience?.profession || "Specialist"}
              </Typography>

              {doctor.professionalExperience?.special_interest_area && (
                <Typography
                  variant="span"
                  className="text-foreground text-center text-[10px] block mt-2"
                >
                  {doctor.professionalExperience.special_interest_area}
                </Typography>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" size="lg">
            Back
          </Button>
          <Button
            variant="default"
            size="lg"
            disabled={selectedDoctor === null}
            onClick={() => selectedDoctor && onContinue(selectedDoctor)}
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  )
}
