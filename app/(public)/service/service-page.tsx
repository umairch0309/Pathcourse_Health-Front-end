import Image from 'next/image';
import { Typography } from '@/components/ui/typography';

export default function ServicePage() {
  return (
    <section className="bg-background py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-8">
          {/* Left Column - Text Content */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <Typography
              variant="h2"
              className="text-foreground font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            >
              You&apos;re Not Alone in This{' '}
              <span className="block">Journey</span>
            </Typography>

            <Typography
              variant="span"
              className="text-foreground leading-relaxed text-sm sm:text-base"
            >
              Becoming a mother is one of life&apos;s most profound experiences,
              but it can also bring unexpected challenges. Our specialized
              postpartum therapy provides the support you need during this
              transformative time. Whether you&apos;re experiencing baby blues,
              postpartum depression, anxiety, or simply need someone to talk to,
              we&apos;re here to help you thrive.
            </Typography>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-full sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px]">
              <Image
                src="/service-page.jpg"
                alt="Doctor, mother, and baby in consultation"
                width={600}
                height={500}
                className="rounded-lg object-cover w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

