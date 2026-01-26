"use client"
import { MoveUpRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function InfoSection() {
  const router = useRouter()
  return (
    <section className="bg-muted py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start`}
        >
          {/* Left side - Images */}
          <div className="space-y-4 sm:space-y-6">
            {/* Top image - Medical professional with mask */}
            <div className="relative">
              <Image
                src="/mask.png"
                alt="Medical professional with protective gear"
                width={800}
                height={500}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* Bottom image - Doctor with child */}
            <div className="relative">
              <Image
                src="/doc-child.png"
                alt="Doctor examining child patient"
                className="w-full sm:w-3/4 lg:w-1/2 h-64 sm:h-72 lg:h-80 object-cover rounded-xl sm:rounded-2xl"
                width={800}
                height={500}
              />

              {/* Purple overlay with experience badge */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl flex items-center justify-center sm:ml-16 lg:ml-20">
                <div className="bg-secondary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-left">
                  <Typography
                    variant="h2"
                    className="text-2xl sm:text-3xl lg:text-4xl text-background"
                  >
                    20
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-xs sm:text-sm text-background"
                  >
                    Years Experience
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className={`space-y-6 pt-0`}>
            <Typography
              as="h1"
              variant="h1"
              className={`text-balance text-3xl lg:text-5xl text-foreground`}
            >
              We Are Always <br /> Ensure Best Therapy Treatment
            </Typography>

            <Typography variant="span" className="text-lg text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit metus ex, id ullamcorper massa accumsan volutpat. Etiam
              viverra pharetra dui, nec aliquet nisi consequat sit amet. 
            </Typography>

            {/* Profile images and testimonial */}
            <div className="relative border border-muted-foreground/30 p-6 rounded-xl shadow-sm">
              {/* Overlapping Avatars */}
              <div className={`absolute -top-5 left-0 flex -space-x-2`}>
                <Image
                  src="/doc1.svg"
                  alt="Doctor profile"
                  className="w-11 h-11 rounded-full border-0"
                  width={44}
                  height={44}
                />
                <Image
                  src="/doc2.svg"
                  alt="Medical professional profile"
                  className="w-12 h-12 rounded-full border-2 border-green-500"
                  width={48}
                  height={48}
                />
              </div>

              {/* Quote */}
              <blockquote className="space-y-3 mt-2">
                <p className="text-foreground italic leading-relaxed">
                  ““Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Etiam hendrerit metus ex, id ullamcorper massa accumsan
                  volutpat. Etiam viverra pharetra dui, nec aliquet nisi
                  consequat sit amet.””
                </p>

                {/* Role */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/info-vector.svg"
                    alt="info-vector"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                  <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                    Vice Director of Wellness <br /> Hospital
                  </span>
                </div>
              </blockquote>
            </div>

            <Button
              variant="outline"
              className="mt-6 border-primary bg-transparent"
              onClick={() => router.push("/about")}
            >
              More About Us
              <Image
                src="/MoveUp.svg"
                alt=""
                width={11}
                height={11}
                className="inline-block ml-1"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
