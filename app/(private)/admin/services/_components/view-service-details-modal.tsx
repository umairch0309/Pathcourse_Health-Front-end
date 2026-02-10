"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type ServicePricing = {
  id: string
  serviceId: string
  service: {
    id: string
    name: string
  }
  duration: number
  userPrice: number
  doctorAmount: number
  platformAmount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type ViewServiceDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: ServicePricing[] | null
}

export function ViewServiceDetailsModal({
  open,
  onOpenChange,
  service,
}: ViewServiceDetailsModalProps) {
  if (!service || service.length === 0) return null

  const firstService = service[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
          <DialogDescription>
            View detailed information about the service pricing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Service Name</Label>
            <p className="text-sm text-muted-foreground">
              {firstService.service.name}
            </p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Total Durations</Label>
            <p className="text-sm text-muted-foreground">
              {service.length} {service.length === 1 ? "duration" : "durations"}
            </p>
          </div>

          <div className="grid gap-4">
            <Label className="text-sm font-semibold">Pricing Details</Label>
            <div className="space-y-4">
              {service.map((pricing, index) => (
                <div
                  key={pricing.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      Duration {index + 1}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-medium">
                        {pricing.duration}{" "}
                        {pricing.duration === 1 ? "minute" : "minutes"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">User Price:</span>
                      <p className="font-medium">
                        ${pricing.userPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Doctor Amount:
                      </span>
                      <p className="font-medium">
                        ${pricing.doctorAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Platform Amount:
                      </span>
                      <p className="font-medium">
                        ${pricing.platformAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
