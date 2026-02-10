"use client"

import { LogOut, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperStatusLabel,
  StepperTitle,
  StepperTrigger,
  useStepper,
} from "@/components/ui/stepper"
import { Typography } from "@/components/ui/typography"
import auth from "@/lib/auth"
import ContactInfo from "./_components/contact-info"
import EducationalInfo from "./_components/education-info"
import GeneralInfo from "./_components/general-info"

const steps = [
  { id: 0, title: "Contact info" },
  { id: 1, title: "Educational info" },
  { id: 2, title: "Professional exp." },
]

function StepContent() {
  const { activeStep } = useStepper()

  switch (activeStep) {
    case 0:
      return <ContactInfo />
    case 1:
      return <EducationalInfo />
    case 2:
      return <GeneralInfo />
    default:
      return null
  }
}

export default function UpdateProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Logo in top-left corner */}
      <Link href="/" className="absolute top-4 left-4 z-50 cursor-pointer">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-cover"
        />
      </Link>

      {/* User icon and logout dropdown in top-right corner */}
      <div className="absolute top-4 right-4 z-50" ref={dropdownRef}>
        <div className="relative">
          <User
            className="w-6 h-6 text-foreground cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow-md z-50">
              <Button
                variant="secondary"
                className="w-full flex items-center gap-2"
                onClick={async () => {
                  await auth.signOut()
                  router.push("/auth/login")
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8 lg:py-10 py-4 mx-auto max-w-7xl px-2">
        <Typography
          variant="h5"
          className="font-bold text-center text-foreground"
        >
          Update Your Profile
        </Typography>

        <div className="bg-background p-4 border rounded-md h-full w-full mx-auto">
          <Stepper defaultValue={0}>
            <div className="w-full mx-auto max-w-[1100px] lg:w-[500px] px-2 sm:px-4 md:px-6">
              <div className="flex flex-nowrap gap-4 w-full mt-4 overflow-x-auto">
                {steps.map((step, index) => (
                  <StepperItem
                    key={step.id}
                    step={step.id}
                    className="not-last:flex-1 group/step"
                  >
                    <div className="flex flex-col items-center">
                      <StepperTrigger>
                        <StepperIndicator />
                      </StepperTrigger>
                      <StepperTitle>{step.title}</StepperTitle>
                      <StepperStatusLabel />
                    </div>
                    {index < steps.length - 1 && <StepperSeparator />}
                  </StepperItem>
                ))}
              </div>
            </div>

            <div className="mt-2 px-4 sm:px-6 md:px-10">
              <StepContent />
            </div>
          </Stepper>
        </div>
      </div>
    </div>
  )
}
