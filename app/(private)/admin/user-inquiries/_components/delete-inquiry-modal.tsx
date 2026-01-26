"use client"

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

type UserQuery = {
  id: string
  message: string
  organizationName?: string
  organizationEmail?: string
  name: string
  number: string
  email: string
  createdAt: string
}

type DeleteInquiryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiry: UserQuery | null
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteInquiryModal({
  open,
  onOpenChange,
  inquiry,
  onConfirm,
  isDeleting = false,
}: DeleteInquiryModalProps) {
  if (!inquiry) return null

  const handleDelete = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Inquiry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the inquiry from &quot;
            {inquiry.organizationName || inquiry.name}&quot;? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader size="sm" variant="default" color="white" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
