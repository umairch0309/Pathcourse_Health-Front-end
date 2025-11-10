'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="lg:py-15 py-8 lg:px-20 px-4 bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* About Smart Health Center Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <Typography variant="h2" className="text-foreground font-semibold">
              About Path Course <br /> Health
            </Typography>

            <Typography variant="span" className="text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
              tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut rhoncus tellus elit
              sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
            </Typography>

            {/* Mission and Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Our Mission */}
              <div className="space-y-3">
                <Typography variant="h3" className="text-foreground">
                  Our Mission
                </Typography>
                <Typography variant="span" className="text-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                  tellus. Sed dignissim, metus nec fringilla accumsan.
                </Typography>
              </div>

              {/* Our Vision */}
              <div className="space-y-3">
                <Typography variant="h3" className="text-foreground">
                  Our Vision
                </Typography>
                <Typography variant="span" className="text-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                  tellus. Sed dignissim, metus nec fringilla accumsan.
                </Typography>
              </div>
            </div>

            {/* Get Started Button */}
            <Button variant="outline" size="lg" className="border-primary" onClick={() => router.push('/auth/signup')}>
              Get Started Now
              <Image src="/MoveUp.svg" alt="Move Up" width={12} height={12} className="ml-2" />
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative lg:w-[700px] lg:h-[400px]">
              <Image
                src="/about.jpg"
                alt="Stethoscope - Medical Equipment"
                width={600}
                height={500}
                className="rounded-lg object-cover w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}