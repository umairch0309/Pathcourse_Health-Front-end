import { Typography } from "@/components/ui/typography"

export default function Banner() {
  return (
    <section className="relative flex items-center justify-center h-[350px] overflow-hidden">
      <div className="absolute inset-0 bg-accent"></div>
      <div className="relative container mx-auto flex flex-col justify-center items-center px-4 gap-6">
        <Typography variant="h1" className="text-foreground mt-6">
          Open Ear
        </Typography>
      </div>
    </section>
  )
}
