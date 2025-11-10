'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { doctors } from '@/app/data/doctors';

type SpecialistDetailProps = {
  doctorId: number;
  onBack?: () => void;
  onContinue?: (duration: number) => void;
};

export default function SpecialistDetail({ doctorId, onBack, onContinue }: SpecialistDetailProps) {
  const [readMore, setReadMore] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];
  
  // Extended description for read more functionality
  const shortDescription = 'Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan';
  const fullDescription = `${shortDescription} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

  const durations = [15, 30, 45, 60];
  const services = ["Men's Health", "Women's Health", "Sextual Health", "Skin Care"];

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <Typography variant="h3" className="text-foreground font-bold mb-8">
          Specialist Details
        </Typography>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 lg:mb-12">
          {/* Left Column - Specialist Image with Play Button */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden col-span-1">
              <Image
                src='/doctor-detail.jpg'
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>

          {/* Right Column - Specialist Information */}
          <div className="col-span-2 mt-4 lg:mt-0">
            {/* Name */}
            <Typography variant="h4" className="text-foreground font-bold">
            Specialist Name Here
            </Typography>

            {/* Description with Read More */}
            <Typography variant="span" className="text-foreground">
              {readMore ? fullDescription : `${shortDescription.substring(0, 200)}...`}
              {' '}
              <button
                onClick={() => setReadMore(!readMore)}
                className="text-destructive hover:underline text-sm cursor-pointer"
              >
                {readMore ? 'Read less' : 'Read more'}
              </button>
            </Typography>

            {/* Starting Price */}
            <div className='mt-2'>
              <Typography variant="span" className="text-foreground">
                Starting:{' '}
                <span className="font-semibold text-2xl">$200.00</span>
              </Typography>
            </div>

            <div className='grid lg:grid-cols-2 gap-10 mt-6'>
              {/* Feedback Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Feedback</CardTitle>
                  <Typography variant="span" className="text-foreground mt-4">
                    Ratings & Reviews
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Typography variant="p" className="text-foreground font-bold mt-[-25]">
                    4.8 / 5
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Select Time Duration Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Select Time Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {durations.map((duration) => (
                      <Button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        variant="outline"
                        className={`
                          bg-muted text-foreground hover:bg-muted/80 border-border
                          ${selectedDuration === duration 
                            ? 'ring-2 ring-primary bg-accent' 
                            : ''
                          }
                        `}
                      >
                        {duration} min
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            

            {/* Services */}
            <div className='mt-4'>
              <Typography variant="p" className="text-muted-foreground font-semibold mb-3">
                Services
              </Typography>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-muted text-foreground hover:bg-muted/80 border-border"
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

          
          </div>
        </div>

        {/* Other Details Section */}
        <div className="mb-12 bg-muted p-6 rounded-2xl lg:mt-0 mt-4">
          <Typography variant="h5" className="text-foreground font-semibold mb-4">
            Other Details
          </Typography>
          <div className="space-y-3">
            <div>
              <Typography variant="span" className="text-muted-foreground">
                Language:{' '}
              </Typography>
              <Typography variant="span" className="text-foreground">
                English, Spanish
              </Typography>
            </div>
            <div>
              <Typography variant="span" className="text-muted-foreground">
                Special interest area:{' '}
              </Typography>
              <Typography variant="span" className="text-foreground">
                Developmental Language Disorder (DLD), Literacy, Articulation, Supporting autistic individuals, Parent and caregiver coaching, Early language supports, Social Skills
              </Typography>
            </div>
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
            disabled={selectedDuration === null}
            onClick={() => selectedDuration !== null && onContinue?.(selectedDuration)}
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}

