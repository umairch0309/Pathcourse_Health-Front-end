"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Service = {
  id: string
  serviceTitle: string
  timeDurations: number
  addedOn: string
}

type EditServiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service
}

export function EditServiceModal({
  open,
  onOpenChange,
  service,
}: EditServiceModalProps) {
  const [title, setTitle] = useState("")
  const [durations, setDurations] = useState("")

  useEffect(() => {
    if (open && service) {
      setTitle(service.serviceTitle)
      setDurations(service.timeDurations.toString())
    }
  }, [open, service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle update logic here
    console.log("Updating service:", { title, durations })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Service</DialogTitle>
          <DialogDescription>
            Update the service title and time durations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter service title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="durations">Time Durations</Label>
              <Input
                id="durations"
                type="number"
                value={durations}
                onChange={(e) => setDurations(e.target.value)}
                placeholder="Enter time durations"
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
