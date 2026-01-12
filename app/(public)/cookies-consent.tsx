"use client"

import { XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "cookies-consent-accepted"

export default function CookiesConsent() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem(STORAGE_KEY)
    if (!hasAccepted) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setIsOpen(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300",
        "bg-background border-t shadow-lg"
      )}
    >
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Typography variant="h6" className="font-semibold">
              Cookies & Terms of Use
            </Typography>
            <Typography
              variant="p"
              className="text-sm text-muted-foreground max-w-3xl"
            >
              We use cookies to enhance your browsing experience, analyze site
              traffic, and personalize content. By continuing to use this
              website, you consent to our use of cookies and agree to our{" "}
              <a
                href="/policies"
                className="text-primary underline hover:text-primary/80"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/policies"
                className="text-primary underline hover:text-primary/80"
              >
                Privacy Policy
              </a>
              .
            </Typography>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-initial"
            >
              Decline
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-initial"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAccept}
              className="sm:hidden"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
