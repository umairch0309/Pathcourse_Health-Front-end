"use client"

import { Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import DocumentPreview from "@/components/document-preview"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

type Doctor = {
  documents: {
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  } | null
}

type ProfessionalDocumentsProps = {
  doctor: Doctor
}

export default function ProfessionalDocuments({
  doctor,
}: ProfessionalDocumentsProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string
    fileName: string
    label: string
  } | null>(null)
  if (!doctor.documents) {
    return (
      <div className="space-y-6">
        <Typography variant="p" className="text-foreground">
          No documents available.
        </Typography>
      </div>
    )
  }

  const { resume, medicalLicense, introductionVideo } = doctor.documents

  const documents = [
    { label: "Resume", file: resume },
    { label: "Medical License", file: medicalLicense },
    { label: "Introduction Video", file: introductionVideo },
  ].filter((doc) => doc.file)

  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        <Typography variant="p" className="text-foreground">
          No documents available.
        </Typography>
      </div>
    )
  }

  const getFileName = (url: string | null): string => {
    if (!url) return "Unknown file"
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const segments = pathname.split("/")
      return segments[segments.length - 1] || "Unknown file"
    } catch {
      const segments = url.split("/")
      return segments[segments.length - 1] || "Unknown file"
    }
  }

  const handlePreview = (url: string, label: string) => {
    setSelectedDocument({
      url,
      fileName: getFileName(url),
      label,
    })
    setPreviewOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
          {documents.map((doc) => {
            if (!doc.file) return null
            const fileUrl = doc.file
            return (
              <div
                key={`${doc.label}-${fileUrl}`}
                className="flex flex-col items-start"
              >
                <div className="text-xs text-muted-foreground">{doc.label}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Image src="/pdf.svg" alt="pdf" width={40} height={40} />
                  <div className="text-sm text-foreground truncate max-w-[200px]">
                    {getFileName(fileUrl)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(fileUrl, doc.label)}
                    className="h-8 w-8 p-0"
                    title="Preview document"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDocument && (
        <DocumentPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          fileUrl={selectedDocument.url}
          fileName={selectedDocument.fileName}
          label={selectedDocument.label}
        />
      )}
    </>
  )
}
