"use client"

import { useState } from "react"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import useApi from "@/hooks/use-api"

type SessionReason =
  | "LETTING_OFF_STEAM"
  | "TALKING_THROUGH_STRESS_OR_UNCERTAINTY"
  | "NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD"

type SessionReasonModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string | null
  onSubmitted?: () => void
}

const SESSION_REASONS: Array<{
  value: SessionReason
  label: string
  description: string
}> = [
  {
    value: "LETTING_OFF_STEAM",
    label: "Letting Off Steam",
    description:
      "Patient needs to vent or express frustrations without seeking solutions",
  },
  {
    value: "TALKING_THROUGH_STRESS_OR_UNCERTAINTY",
    label: "Talking Through Stress or Uncertainty",
    description:
      "Patient is dealing with stress or uncertainty and needs guidance",
  },
  {
    value: "NEEDING_PERSPECTIVE_DURING_A_DEMANDING_PERIOD",
    label: "Needing Perspective During a Demanding Period",
    description:
      "Patient needs professional insight during a challenging situation",
  },
]

export function SessionReasonModal({
  open,
  onOpenChange,
  appointmentId,
  onSubmitted,
}: SessionReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<SessionReason | null>(
    null
  )

  const { onRequest: submitSessionReason, isPending: isSubmitting } = useApi<{
    reason: SessionReason
  }>({
    key: "submit-session-reason",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = () => {
    if (!selectedReason || !appointmentId) return

    submitSessionReason({
      path: `/api/appointment/${appointmentId}/session-reason`,
      data: { reason: selectedReason },
      onSuccess: () => {
        setSelectedReason(null)
        onOpenChange(false)
        onSubmitted?.()
      },
    })
  }

  const handleSkip = () => {
    setSelectedReason(null)
    onOpenChange(false)
    onSubmitted?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Session Reason</DialogTitle>
          <DialogDescription>
            Please select the primary reason for this session to help improve
            our services and analytics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {SESSION_REASONS.map((reason) => (
            <button
              key={reason.value}
              type="button"
              onClick={() => setSelectedReason(reason.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedReason === reason.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              disabled={isSubmitting}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedReason === reason.value
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedReason === reason.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{reason.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {reason.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? (
              <Loader size="sm" variant="default" color="white" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
