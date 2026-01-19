"use client"

import { AlertTriangle, Camera, CheckCircle, Mic, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PermissionState = {
  camera: "granted" | "denied" | "prompt" | "unknown"
  microphone: "granted" | "denied" | "prompt" | "unknown"
}

type AgoraPermissionModalProps = {
  isOpen: boolean
  onClose: () => void
  onPermissionsGranted: (permissions: PermissionState) => void
  currentPermissions: PermissionState
}

export function AgoraPermissionModal({
  isOpen,
  onClose,
  onPermissionsGranted,
  currentPermissions,
}: AgoraPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [localPermissions, setLocalPermissions] = useState(currentPermissions)

  const requestPermissions = async () => {
    setIsRequesting(true)
    const newPermissions = { ...localPermissions }

    try {
      // First try to request both permissions together for a better user experience
      try {
        console.log("Requesting camera and microphone permissions together")
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        newPermissions.camera = "granted"
        newPermissions.microphone = "granted"
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach((track) => {
          track.stop()
        })
        console.log("Both permissions granted")
      } catch (error) {
        console.warn(
          "Failed to get both permissions together, trying individually:",
          error
        )

        // Try camera permission separately
        try {
          console.log("Requesting camera permission")
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          newPermissions.camera = "granted"
          videoStream.getTracks().forEach((track) => {
            track.stop()
          })
          console.log("Camera permission granted")
        } catch (videoError) {
          console.warn("Camera permission denied:", videoError)
          newPermissions.camera = "denied"
        }

        // Try microphone permission separately
        try {
          console.log("Requesting microphone permission")
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
          newPermissions.microphone = "granted"
          audioStream.getTracks().forEach((track) => {
            track.stop()
          })
          console.log("Microphone permission granted")
        } catch (audioError) {
          console.warn("Microphone permission denied:", audioError)
          newPermissions.microphone = "denied"
        }
      }

      console.log("Final permission state:", newPermissions)
      setLocalPermissions(newPermissions)
      onPermissionsGranted(newPermissions)

      // Close modal if at least one permission is granted
      if (
        newPermissions.camera === "granted" ||
        newPermissions.microphone === "granted"
      ) {
        onClose()
      }
    } catch (error) {
      console.error("Error requesting permissions:", error)
    } finally {
      setIsRequesting(false)
    }
  }

  const continueWithoutPermissions = () => {
    onPermissionsGranted(localPermissions)
    onClose()
  }

  const getPermissionIcon = (
    permission: "granted" | "denied" | "prompt" | "unknown"
  ) => {
    switch (permission) {
      case "granted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "denied":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getPermissionText = (
    permission: "granted" | "denied" | "prompt" | "unknown"
  ) => {
    switch (permission) {
      case "granted":
        return "Granted"
      case "denied":
        return "Denied"
      default:
        return "Not requested"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="lg:max-w-md max-w-sm bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Camera className="h-5 w-5" />
            PathCourse Consultation Permissions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            To join the PathCourse consultation, please allow access to your
            camera and microphone when prompted by your browser.
          </p>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-secondary dark:text-blue-300">
                <p className="font-medium">
                  When you click "Allow Permissions"
                </p>
                <p>
                  You may see browser permission prompts appear at the top of
                  your screen. Please click "Allow" on those prompts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Camera Permission */}
            <Card className="p-3 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Camera</p>
                    <p className="text-xs text-gray-500">
                      Share video with Smart Health Center provider
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPermissionIcon(localPermissions.camera)}
                  <span className="text-xs text-gray-500">
                    {getPermissionText(localPermissions.camera)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Microphone Permission */}
            <Card className="p-3 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Microphone</p>
                    <p className="text-xs text-gray-500">
                      Communicate with Smart Health Center provider
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPermissionIcon(localPermissions.microphone)}
                  <span className="text-xs text-gray-500">
                    {getPermissionText(localPermissions.microphone)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {(localPermissions.camera === "denied" ||
            localPermissions.microphone === "denied") && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Some permissions were denied</p>
                  <p>
                    You can still join the consultation, but some features may
                    be limited. You can enable permissions later from your
                    browser settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 align-middle">
            <Button
              onClick={requestPermissions}
              disabled={isRequesting}
              variant="default"
              className="w-1/2"
            >
              {isRequesting ? "Requesting..." : "Allow Permissions"}
            </Button>
            <Button
              onClick={continueWithoutPermissions}
              variant="outline"
              className="w-1/2"
            >
              Continue Anyway
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Your privacy is protected. Permissions are only used during the
            consultation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
