"use client"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { reviews } from "@/app/data/reviews"

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 3 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1))
  }

  return (
    <section className="bg-background py-12 md:py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12">
          {/* Heading */}
          <div className="mb-6 sm:mb-0">
            <Typography
              as="h2"
              variant="h1"
              className="font-bold text-foreground"
            >
              Listen what they say
            </Typography>
            <Typography
              as="h2"
              variant="h1"
              className="font-bold text-foreground"
            >
              About us
            </Typography>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 bg-background hover:bg-muted"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 bg-background hover:bg-muted"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(currentIndex, currentIndex + 3).map((review) => (
            <Card
              key={review.id}
              className="bg-background border-gray-200 rounded-xl p-6"
            >
              {/* Avatar, Name and Stars */}
              <div className="flex items-start gap-3 mb-4">
                {/* Avatar Placeholder */}
                <div className="size-14 bg-muted-foreground/90 rounded-md flex-shrink-0" />

                {/* Name and Stars */}
                <div className="flex-1">
                  <Typography
                    as="h3"
                    variant="h6"
                    className="font-bold text-foreground mb-2"
                  >
                    {review.name}
                  </Typography>
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <Typography
                as="span"
                variant="span"
                className="text-foreground text-sm leading-relaxed"
              >
                {review.text}
              </Typography>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
