'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { doctors } from '@/app/data/doctors';

type AvailableSpecialistsProps = {
  onContinue: (doctorId: number) => void;
};

export default function AvailableSpecialists({ onContinue }: AvailableSpecialistsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const displayedDoctors = doctors.slice(0, 4);

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
          {displayedDoctors.map(doctor => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor.id)}
              className={`
                bg-muted rounded-2xl py-6 px-8 text-center items-center shadow-sm cursor-pointer transition-all duration-300
                ${selectedDoctor === doctor.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
                }
              `}
            >
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

                <Typography as="h3" variant="h5" className="text-center font-bold text-foreground">
                  {doctor.name}
                </Typography>

                <Typography variant="span" className="font-semibold text-center text-secondary">
                  {doctor.specialty}
                </Typography>

                <Typography variant="span" className="text-foreground text-center text-[10px]">
                  {doctor.description}
                </Typography>
            </div>
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
  );
}

