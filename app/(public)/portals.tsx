'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useRouter } from 'next/navigation';

export default function PortalsSection() {
  const router = useRouter();
  return (
    <section className="bg-background py-12 md:py-10 px-4 md:px-8 lg:px-40 xl:px-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 items-start lg:gap-0 xl:gap-0 gap-10">
          {/* LEFT: Patient Portal */}
          <div className="order-1">
          <Typography as="h2" variant="h2" className="text-center md:text-left font-bold text-foreground mb-8">
            Our
            Portals
          </Typography>
            <div className="relative max-w-lg mx-auto lg:mx-0">
              {/* Blue Background Container - Responsive */}
              <div className="w-full aspect-square lg:h-[400px] lg:w-[300px] bg-gradient-to-r from-secondary/30 to-primary rounded-3xl mx-auto lg:mx-0"></div>

              {/* Image Container - Responsive positioning */}
              <div className="absolute top-[-10px] sm:top-[-20px] left-[20px] sm:left-[40px] right-[-20px] sm:right-[-40px] h-[200px] sm:h-[250px] md:h-[300px] bg-background rounded-2xl overflow-hidden shadow-lg z-10">
                <Image
                  src="/doctor-portal.png"
                  alt="Patient Portal Interface"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Section - Responsive positioning */}
              <div className="absolute top-[120px] sm:top-[130px] right-[-10px] sm:right-[-20px] lg:right-[-40px] w-[200px] sm:w-[240px] lg:w-[240px] bg-muted rounded-lg p-3 lg:p-6 shadow-lg z-20">
                <p className="text-foreground text-xs sm:text-sm leading-relaxed mb-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate.
                </p>
                <Button variant="default" className="lg:mt-27" onClick={() => router.push('/auth/signup')}>
                  Sign Up Now
                  <Image src="/MoveUpWhite.svg" alt="Move Up" width={17} height={17} className="inline-block ml-1" />
                </Button>
              </div>

              {/* Blue Title Section - Responsive */}
              <div className="absolute bottom-0 left-0 w-[180px] sm:w-[220px] lg:w-[250px] px-4 sm:px-6 py-3 sm:py-4">
                <Typography as="h3" variant="h4" className="text-lg sm:text-xl font-bold text-background">User Portal</Typography>
              </div>
            </div>
          </div>

          {/* RIGHT: Doctor Portal */}
          <div className="order-2">
            <div className="bg-primary rounded-3xl py-4 sm:py-6 shadow-2xl w-full">
              {/* Portal Title */}
              <Typography as="h3" variant="h3" className="text-xl sm:text-2xl font-bold text-background mb-4 sm:mb-6 lg:ml-6 xl:ml-6"> Specialist Portal</Typography>

              {/* Portal Interface */}
              <div className="bg-background rounded-2xl overflow-hidden lg:ml-6 xl:ml-6">
                <Image
                  src="/doctor-portal.png"
                  alt="Doctor Portal Interface"
                  width={500}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}