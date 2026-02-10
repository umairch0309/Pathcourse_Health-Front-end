"use client"

import { Lock } from "lucide-react"
import { useEffect, useState } from "react"
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
import { Typography } from "@/components/ui/typography"

const ENTERPRISE_CODE_STORAGE_KEY = "enterpriseAccessCode"

export default function EnterpriseAccessModal() {
  const [open, setOpen] = useState(false)
  const [enterpriseCode, setEnterpriseCode] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if enterprise code is already in session storage
    const storedCode = sessionStorage.getItem(ENTERPRISE_CODE_STORAGE_KEY)
    if (!storedCode) {
      // Only show modal if no code is stored
      setOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!enterpriseCode.trim()) {
      setError("Please enter your enterprise unique identity")
      return
    }

    // Save to session storage
    sessionStorage.setItem(ENTERPRISE_CODE_STORAGE_KEY, enterpriseCode.trim())
    setOpen(false)
  }

  // Prevent closing the modal by clicking outside or pressing escape
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if we have a valid code
    const storedCode = sessionStorage.getItem(ENTERPRISE_CODE_STORAGE_KEY)
    if (storedCode) {
      setOpen(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg bg-blue-50/95 dark:bg-blue-950/95 backdrop-blur-sm border-blue-200 dark:border-blue-800"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold">
            Enterprise Unique Identity Required
          </DialogTitle>
          <DialogDescription className="text-foreground/80">
            Please enter your enterprise unique identity to access this
            platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter enterprise unique identity"
                  value={enterpriseCode}
                  onChange={(e) => {
                    setEnterpriseCode(e.target.value)
                    setError("")
                  }}
                  className="pl-10 border border-primary rounded-md focus:border-primary focus-visible:ring-0 focus-visible:outline-0 py-5"
                  autoFocus
                />
              </div>
              {error && (
                <Typography variant="span" className="text-sm text-destructive">
                  {error}
                </Typography>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Export utility function to get enterprise code from session storage
export function getEnterpriseCode(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(ENTERPRISE_CODE_STORAGE_KEY)
}
