"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import auth from "@/lib/auth"

export default function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <section className="relative min-h-[60vh] sm:min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/banner.png"
          alt="Medical background"
          fill
          className="w-full object-cover object-[60%_bottom] sm:object-[center_center] lg:object-center"
          sizes="(max-width: 1024px) 100vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 sm:bg-black/40 lg:bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 sm:py-20 lg:p-20 pt-24 sm:pt-28 lg:pt-80">
          {/* Left Content */}
          <div className={`text-background sm:text-white max-w-xl`}>
            <Typography
              as="h1"
              variant="h1"
              className="text-white drop-shadow-md"
            >
              Empathy not <br /> Algorithms
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-white drop-shadow mb-4"
            >
              Non-clinical human support for moments when you just need someone
              to listen.
            </Typography>
            {!isLoading && !isLoggedIn && (
              <Button
                className="rounded-lg px-5 py-4 sm:px-6 sm:py-6 text-base sm:text-lg font-medium text-foreground bg-background hover:bg-background/90"
                variant="outline"
                onClick={() => router.push("/auth/login")}
              >
                Get Started Now
                <Image
                  src="/MoveUp.svg"
                  alt=""
                  width={11}
                  height={11}
                  className="inline-block ml-1"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
