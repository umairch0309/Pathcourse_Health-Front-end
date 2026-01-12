"use client"
import Image from "next/image"
import { Typography } from "@/components/ui/typography"

export default function ServicesSection() {
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
            Open Ear is PathCourse Health’s on-demand listening experience,
            grounded in empathy rather than algorithms. It connects you with a
            real Specialist for a private, non-clinical conversation focused on
            presence, understanding, and perspective. No diagnosis. No
            treatment. Just a human connection when you need someone to talk to.
          </Typography>
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
