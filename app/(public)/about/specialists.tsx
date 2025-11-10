import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { doctors } from '@/app/data/doctors';

export default function Specialists() {
  const topDoctors = doctors.slice(0, 3);

  return (
    <section className="bg-background lg:py-16 py-10 lg:px-20 px-4">
      <div className="container mx-auto">

      <Typography variant="h1" className="text-foreground font-normal">
              Our <span className="text-foreground font-bold">Specialists</span>
            </Typography>
        {/* Header */}
        <div className="flex items-start justify-between gap-20 mb-8 sm:mb-10">
          <Typography variant="span" className="text-foreground mt-3">
              Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos.
            </Typography>
          <Button asChild variant="default" className="shrink-0 hidden sm:inline-flex mt-4">
            <Link href="#">View All <Image src="/MoveUpWhite.svg" alt="Move Up" width={17} height={17} /></Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topDoctors.map(doctor => (
            <Link href={`/`} key={doctor.id}>
              <div key={doctor.id} className="bg-muted rounded-2xl py-6 px-8 text-center items-center shadow-sm">
                {/* Doctor Image with Decorative Border */}
                <div className="relative mb-6 mx-auto size-50 flex items-center justify-center">
                  {/* Top dot */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
                    <div className="w-2" />
                    <Image
                      src="/dot.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                    <div className="w-2" />
                  </div>
                  
                  {/* Circular border */}
                  <div className="w-full h-full rounded-full border-2 border-secondary/50 p-3">
                    <div className="w-full h-full rounded-full overflow-hidden bg-accent">
                      <Image
                        src={doctor.image || '/placeholder.svg'}
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
                    <Image
                      src="/dot.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                    <div className="w-2" />
                  </div>
                </div>

                <Typography as="h3" variant="h4" className="text-center font-bold text-foreground">
                  {doctor.name}
                </Typography>

                <Typography variant="p" className="font-semibold text-center text-secondary">
                  {doctor.specialty}
                </Typography>

                <Typography variant="span" className="text-foreground text-center">
                  {doctor.description}
                </Typography>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden flex justify-center">
          <Button asChild variant="outline">
            <Link href="#">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


