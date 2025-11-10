import { Typography } from '@/components/ui/typography';

export default function Banner() {
  return (
    <section className="relative flex items-center justify-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-accent"></div>
      <div className="relative container mx-auto flex justify-center align-center px-4">
        <Typography variant="h1" className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">Postpartum therapy</Typography>
      </div>
    </section>
  );
}