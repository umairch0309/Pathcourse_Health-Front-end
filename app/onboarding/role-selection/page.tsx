"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"

type RoleType = "practitioner" | "patient"
type ApiRoleType = "doctor" | "patient"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null)

  const { onRequest, isPending } = useApi<{ role: ApiRoleType }>({
    key: "select-role",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const handleContinue = () => {
    if (selectedRole) {
      // Map practitioner to doctor for API
      const apiRole: ApiRoleType =
        selectedRole === "practitioner" ? "doctor" : "patient"

      onRequest({
        path: "/api/user/select-role",
        data: { role: apiRole },
        onSuccess: () => {
          // Navigate to extra-info with role parameter on success
          router.push(`/onboarding/extra-info?role=${selectedRole}`)
        },
        onError: (error) => {
          console.error("Error selecting role:", error)
        },
      })
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Logo in top corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={32}
            priority
            className="w-16 h-8 sm:w-20 sm:h-10"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <Typography
              as="h4"
              variant="h4"
              className="font-bold text-foreground"
            >
              Select Your Account Type
            </Typography>
            <Typography
              variant="span"
              className="text-foreground max-w-2xl mx-auto"
            >
              Choose whether you're setting up a Specialist or User account.
              This helps us personalise your experience and show the right tools
              for your needs.
            </Typography>
          </div>

          {/* Role Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Practitioner Card */}
            <Card
              className={`
                w-full sm:w-[280px] lg:w-[320px] p-6 transition-all duration-300
                ${
                  selectedRole === "practitioner"
                    ? "ring-2 ring-primary shadow-lg border-primary"
                    : "border-border hover:shadow-md"
                }
                ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => !isPending && setSelectedRole("practitioner")}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] relative flex items-center justify-center">
                  <Image
                    src="/doctor-role.svg"
                    alt="Practitioner"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Typography
                  variant="h5"
                  className="text-foreground font-semibold text-lg"
                >
                  Specialist
                </Typography>
              </div>
            </Card>

            {/* Patient Card */}
            <Card
              className={`
                w-full sm:w-[280px] lg:w-[320px] p-6 transition-all duration-300
                ${
                  selectedRole === "patient"
                    ? "ring-2 ring-primary shadow-lg border-primary"
                    : "border-border hover:shadow-md"
                }
                ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => !isPending && setSelectedRole("patient")}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] relative flex items-center justify-center">
                  <Image
                    src="/patient-role.svg"
                    alt="Patient"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Typography
                  variant="h5"
                  className="text-foreground font-semibold text-lg"
                >
                  User
                </Typography>
              </div>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedRole || isPending}
              className="w-full sm:w-auto min-w-[200px] px-8"
            >
              {isPending ? (
                <>
                  <Loader
                    size="sm"
                    variant="default"
                    color="white"
                    className="mr-2"
                  />
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
