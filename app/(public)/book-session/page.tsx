"use client"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Header from "../header"
import AvailableSpecialists from "./_components/available-specialists"
import PersonalInformation from "./_components/personal-information"
import SpecialistDetail from "./_components/specialist-detail"

function BookSessionContent() {
  const searchParams = useSearchParams()
  const doctorIdParam = searchParams.get("doctorId")
  const stepParam = searchParams.get("step")

  const [currentStep, setCurrentStep] = useState<
    "specialists" | "details" | "personal-info"
  >("specialists")
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)

  useEffect(() => {
    if (doctorIdParam && stepParam === "details") {
      setSelectedDoctorId(doctorIdParam)
      setCurrentStep("details")
    }
  }, [doctorIdParam, stepParam])

  const handleSpecialistContinue = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    setCurrentStep("details")
  }

  const handleDetailContinue = () => {
    setCurrentStep("personal-info")
  }

  const handlePersonalInfoContinue = () => {
    // Appointment will be created in consent modal, then navigate to join session
    // This handler is kept for compatibility but won't be used
  }

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("specialists")
    } else if (currentStep === "personal-info") {
      setCurrentStep("details")
    }
  }

  return (
    <div>
      <Header />
      {currentStep === "specialists" && (
        <AvailableSpecialists onContinue={handleSpecialistContinue} />
      )}
      {currentStep === "details" && selectedDoctorId && (
        <SpecialistDetail
          doctorId={selectedDoctorId}
          onBack={handleBack}
          onContinue={handleDetailContinue}
        />
      )}
      {currentStep === "personal-info" && selectedDoctorId && (
        <PersonalInformation
          onBack={handleBack}
          onContinue={handlePersonalInfoContinue}
          doctorId={selectedDoctorId}
        />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookSessionContent />
    </Suspense>
  )
}
