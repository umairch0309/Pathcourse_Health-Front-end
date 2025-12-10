"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const COOKIE_CONSENT_KEY = "cookie-consent"

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setShow(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setShow(false)
  }

  const handleClose = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "dismissed")
    setShow(false)
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-background border-2 border-border shadow-2xl p-6 sm:p-8 backdrop-blur-sm relative">
          {/* Close button in top-right corner */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Close cookie consent"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Text content centered */}
          <div className="text-center space-y-3 mb-6 pr-8">
            <h3 className="text-2xl font-bold text-foreground">
              We use cookies
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mx-auto max-w-5xl">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking
              &quot;Accept All&quot;, you consent to our use of cookies.{" "}
              <Link
                href="/"
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Buttons on bottom line */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDecline}
              className="whitespace-nowrap px-6 py-6 text-base font-semibold w-full sm:w-auto"
            >
              Decline
            </Button>
            <Button
              size="lg"
              onClick={handleAccept}
              className="whitespace-nowrap px-8 py-6 text-base font-semibold w-full sm:w-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
