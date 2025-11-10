'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export default function ServicesSection() {
  const router = useRouter();
  
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <Typography
          as="h1"
          variant="h1"
          className="text-foreground font-bold"
        >
          Our Service
        </Typography>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg bg-secondary grid grid-cols-1 lg:grid-cols-5 min-h-[300px] sm:min-h-[400px]">
        {/* Left Content Section (60%) */}
        <div className="bg-secondary px-6 sm:px-8 md:px-12 lg:px-20 py-10 sm:py-12 lg:py-10 flex flex-col justify-center lg:col-span-3 space-y-4">
          <Typography
            as="h3"
            variant="h2"
            className="text-white font-bold"
          >
            Open Ear
          </Typography>
          
          <Typography
            as="p"
            variant="p"
            className="text-white"
          >
            Open Ear is a new kind of human connection.
          </Typography>

          <div className="space-y-4">
            <Typography
              as="p"
              variant="p"
              className="text-white"
            >
              When life feels heavy, uncertain, or simply too quiet, you can connect with a real person, a Specialist trained to listen, understand, and help you feel grounded again.
            </Typography>

            <Typography
              as="p"
              variant="p"
              className="text-white"
            >
              Our platform is HIPAA secure and built for privacy, but it is also deeply human, with no bots, no scripts, and no judgment.
            </Typography>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="bg-white text-foreground hover:bg-gray-100 w-fit"
            onClick={() => router.push('/book-session')}
          >
            Book Session Now
            <Image
              src="/MoveUp.svg"
              alt=""
              width={11}
              height={11}
              className="inline-block ml-1"
            />
          </Button>
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
  );
}
