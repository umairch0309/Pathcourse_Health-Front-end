import axios from "axios"
import { Calendar, FileText, Mail, Phone, User } from "lucide-react"
import type React from "react"
import { useState } from "react"
import DocumentPreview from "@/components/document-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { env } from "@/env"
import { buildRequestUrl } from "@/lib/utils"
import type { AppointmentForDetails } from "./tabs"

type InfoItemProps = {
  icon: React.ElementType
  label: string
  value: string | number
  onClick?: () => void
  clickable?: boolean
}

function InfoItem({
  icon: Icon,
  label,
  value,
  onClick,
  clickable,
}: InfoItemProps) {
  const content = (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
        <Icon className="h-4 w-4 text-foreground " />
      </div>
      <div className="grid gap-0.5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </>
  )

  if (clickable && onClick) {
    return (
      <button
        type="button"
        className="flex items-start gap-3 cursor-pointer hover:opacity-80 transition-opacity w-full text-left"
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return <div className="flex items-start gap-3">{content}</div>
}

type PatientInfoProps = {
  appointment: AppointmentForDetails
}

export default function PatientInfo({ appointment }: PatientInfoProps) {
  const { patient, appointmentFor, patientAge, age, uploadId } = appointment
  const [previewOpen, setPreviewOpen] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [isLoadingFile, setIsLoadingFile] = useState(false)

  const isAnonymous = patient.isAnonymous
  const displayName = isAnonymous
    ? patient.employeeCode || "Anonymous user"
    : patient.name || "Unknown user"

  const sessionFor =
    appointmentFor === "self"
      ? "My Self"
      : appointmentFor === "someone else"
        ? "Someone Else"
        : "-"

  const rawAge = patientAge ?? age
  const displayAge =
    rawAge !== null && rawAge !== undefined ? `${rawAge} years` : "-"

  const contactPhone = appointment.patient.userInfo?.phone || "-"
  const contactEmail =
    !isAnonymous && appointment.patient.email ? appointment.patient.email : "-"

  // Extract S3 key from URL or use key directly
  const extractS3Key = (keyOrUrl: string): string => {
    try {
      const urlObj = new URL(keyOrUrl)
      const pathname = urlObj.pathname
      const parts = pathname.split("/").filter(Boolean)
      if (parts[0] === "pathcourse") {
        parts.shift()
      }
      return parts.join("/")
    } catch {
      return keyOrUrl
    }
  }

  // Get file name from URL or key (decode URL encoding)
  const getFileName = (keyOrUrl: string): string => {
    try {
      const urlObj = new URL(keyOrUrl)
      const pathname = urlObj.pathname
      const segments = pathname.split("/")
      const fileName = segments[segments.length - 1] || "Uploaded file"
      // Decode URL-encoded filename
      return decodeURIComponent(fileName)
    } catch {
      const segments = keyOrUrl.split("/")
      const fileName = segments[segments.length - 1] || "Uploaded file"
      // Try to decode if it's URL-encoded
      try {
        return decodeURIComponent(fileName)
      } catch {
        return fileName
      }
    }
  }

  // Get display value for uploaded file (show filename, not full URL)
  const getUploadDisplayValue = (): string => {
    if (!uploadId || uploadId === "-") return "-"
    return getFileName(uploadId)
  }

  const uploadDisplayValue = getUploadDisplayValue()

  const handleFilePreview = async () => {
    if (!uploadId || uploadId === "-") return

    setIsLoadingFile(true)
    try {
      // Check if uploadId is already a URL (starts with http/https)
      const isUrl =
        uploadId.startsWith("http://") || uploadId.startsWith("https://")

      if (isUrl) {
        // If it's already a URL, use it directly
        setFileUrl(uploadId)
        setFileName(getFileName(uploadId))
        setPreviewOpen(true)
      } else {
        // Otherwise, fetch signed URL from S3 key
        const s3Key = extractS3Key(uploadId)
        const REQUEST_PATH = buildRequestUrl(
          env.NEXT_PUBLIC_APP_URL,
          "/api/signed-url"
        )
        const response = await axios.post(
          REQUEST_PATH,
          {
            key: s3Key,
            expiresIn: 3600, // 1 hour
          },
          {
            withCredentials: true,
          }
        )

        // Handle response structure
        const result = response.data?.data || response.data
        const signedUrl =
          result?.signedUrl || result?.url || result?.fileUrl || result

        if (signedUrl && typeof signedUrl === "string") {
          setFileUrl(signedUrl)
          setFileName(getFileName(uploadId))
          setPreviewOpen(true)
        } else {
          console.error("Invalid signed URL response:", result)
        }
      }
    } catch (error) {
      console.error("Failed to fetch signed URL:", error)
    } finally {
      setIsLoadingFile(false)
    }
  }

  return (
    <>
      <Card className="bg-background w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 border-b pb-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem icon={User} label="User name:" value={displayName} />
            <InfoItem
              icon={Calendar}
              label="Session taken for:"
              value={sessionFor}
            />
            <InfoItem icon={Calendar} label="User Age:" value={displayAge} />
          </div>
        </CardContent>

        <CardHeader className="pb-4 pt-0">
          <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem icon={Phone} label="Contact no.:" value={contactPhone} />
            <InfoItem icon={Mail} label="Contact email:" value={contactEmail} />
            <InfoItem
              icon={FileText}
              label="Uploaded file:"
              value={uploadDisplayValue}
              onClick={handleFilePreview}
              clickable={!!(uploadId && uploadId !== "-" && !isLoadingFile)}
            />
          </div>
        </CardContent>
      </Card>

      {fileUrl && (
        <DocumentPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          fileUrl={fileUrl}
          fileName={fileName}
          label="Uploaded File"
        />
      )}
    </>
  )
}
