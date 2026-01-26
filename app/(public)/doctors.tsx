"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { doctors } from "@/app/data/doctors"

export default function Doctors() {
  const router = useRouter()
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h1"
            className="font-bold text-foreground mb-4 text-center"
          >
            Meet Our Expert Specialists
          </Typography>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {doctors.slice(0, 6).map((doctor) => (
            <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
              {" "}
              {/* Doctor Image with Decorative Border */}
              <div
                key={doctor.id}
                className="bg-muted rounded-2xl py-6 px-8 text-center items-center shadow-sm"
              >
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
                      <Image
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
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
                  variant="h4"
                  className="text-center font-bold text-foreground"
                >
                  {doctor.name}
                </Typography>

                <Typography
                  variant="p"
                  className="font-semibold text-center text-secondary"
                >
                  {doctor.specialty}
                </Typography>

                <Typography
                  variant="span"
                  className="text-foreground text-center"
                >
                  {doctor.description}
                </Typography>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Doctors Button */}
        <div className="text-center">
          <Button size="lg" onClick={() => router.push("/doctors")}>
            View All Specialists
            <Image
              src="/MoveUpWhite.svg"
              alt="Move Up"
              width={17}
              height={17}
              className="inline-block ml-1"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}
