import { Typography } from '@/components/ui/typography';

export default function Banner() {
  return (
    <section className="relative flex  items-center justify-center h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-accent"></div>
      <div className="relative container mx-auto flex justify-center align-center px-4">
        <Typography variant="h1" className="text-foreground">About Us</Typography>
      </div>
    </section>
  );
}