"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import auth from "@/lib/auth"

export default function ServicesSection() {
  const router = useRouter()
  const [isPatient, setIsPatient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user && session.data.user.role === "patient") {
          setIsPatient(true)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleBookAppointment = () => {
    router.push("/book-session")
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <Typography as="h1" variant="h1" className="text-foreground font-bold">
          Our Service
        </Typography>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg bg-secondary grid grid-cols-1 lg:grid-cols-5 min-h-[300px] sm:min-h-[400px]">
        {/* Left Content Section (60%) */}
        <div className="bg-secondary px-6 sm:px-8 md:px-12 lg:px-20 py-10 sm:py-12 lg:py-10 flex flex-col justify-center lg:col-span-3 space-y-4">
          <Typography as="h3" variant="h2" className="text-white font-bold">
            Open Ear
          </Typography>

          <Typography as="p" variant="p" className="text-white">
            Open Ear is PathCourse Health's on-demand listening experience,
            grounded in empathy rather than algorithms. It connects you with a
            real Specialist for a private, non-clinical conversation focused on
            presence, understanding, and perspective. No diagnosis. No
            treatment. Just a human connection when you need someone to talk to.
          </Typography>

          {!isLoading && isPatient && (
            <div className="pt-2">
              <Button
                onClick={handleBookAppointment}
                size="lg"
                variant="outline"
              >
                Book Appointment
                <Image
                  src="/MoveUp.svg"
                  alt="Move Up"
                  width={12}
                  height={12}
                  className="inline-block ml-1"
                />
              </Button>
            </div>
          )}
        </div>

        {/* Right Image Section (40%) */}
        <div className="relative lg:col-span-2 overflow-hidden">
          <Image
            src="/service.jpg"
            alt="Video call with a specialist"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}
