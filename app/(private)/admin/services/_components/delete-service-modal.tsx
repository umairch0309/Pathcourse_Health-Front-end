"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Service = {
  id: string
  serviceTitle: string
  timeDurations: number
  addedOn: string
}

type DeleteServiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service
}

export function DeleteServiceModal({
  open,
  onOpenChange,
  service,
}: DeleteServiceModalProps) {
  const handleDelete = () => {
    // Handle delete logic here
    console.log("Deleting service:", service)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the service &quot;
            {service.serviceTitle}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
