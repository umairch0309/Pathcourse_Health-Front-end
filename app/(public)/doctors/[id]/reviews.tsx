/* eslint-disable unicorn/no-new-array */
"use client"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { testimonials } from "@/app/data/testimonials"
import { Button } from "@/components/ui/button"

const ITEMS_PER_SLIDE = 5

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalSlides = Math.ceil(testimonials.length / ITEMS_PER_SLIDE)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const start = currentIndex * ITEMS_PER_SLIDE
  const visibleTestimonials = testimonials.slice(start, start + ITEMS_PER_SLIDE)

  return (
    <section className="py-16 px-4 sm:px-8 bg-white mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-6xl font-medium text-gray-900">
            Listen to{" "}
            <span className="font-bold ">
              what
              <br /> they say
            </span>
          </h2>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <Button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full "
              variant="outline"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full"
              variant="outline"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          {visibleTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-b pb-6">
              {/* Avatar and Name Row */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-shrink-0">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300" />
                  )}
                </div>
                <h4 className="text-foreground font-bold">
                  {testimonial.name}
                </h4>
              </div>

              {/* Stars Row */}
              <div className="flex items-center gap-1 text-secondary mb-2">
                {[...new Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Comment Row */}
              <p className="text-gray-600 text-sm">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
