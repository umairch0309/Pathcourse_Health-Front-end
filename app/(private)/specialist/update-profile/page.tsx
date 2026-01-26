"use client"

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
  return (
    <div className="space-y-8">
      <Typography variant="h5" className="font-bold text-foreground">
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
  )
}
