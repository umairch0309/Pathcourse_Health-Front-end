"use client"
import { Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import z from "zod"
import DocumentPreview from "@/components/document-preview"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"

type CompleteProfile = {
  documents: {
    id: string
    doctorId: string
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  } | null
}

const documentsSchema = z.object({
  resume: z.string().optional().nullable(),
  medicalLicense: z.string().optional().nullable(),
  introductionVideo: z.string().optional().nullable(),
})

type DocumentsFormData = z.infer<typeof documentsSchema>

type UpdateDocumentsRequest = {
  resume?: string | null
  medicalLicense?: string | null
  introductionVideo?: string | null
}

export default function Documents() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string
    fileName: string
    label: string
  } | null>(null)

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useFetch<CompleteProfile>({
    path: "/api/doctor/profile/complete",
    queryKey: ["doctor-profile-complete"],
  })

  const { onRequest, isPending } = useApi<UpdateDocumentsRequest>({
    key: "update-documents",
    showSuccessToast: true,
    showErrorToast: true,
    method: "put",
  })

  const handleSubmit = (data: DocumentsFormData) => {
    const requestData: UpdateDocumentsRequest = {
      resume: data.resume || null,
      medicalLicense: data.medicalLicense || null,
      introductionVideo: data.introductionVideo || null,
    }

    onRequest({
      path: "/api/doctor/profile/documents",
      data: requestData,
      onSuccess: () => {
        setIsEditOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to update documents:", error)
      },
    })
  }

  const getFileName = (url: string | null | undefined): string => {
    if (!url) return "-"
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const segments = pathname.split("/")
      return segments[segments.length - 1] || "Document"
    } catch {
      return url
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

  if (isLoading) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Documents Upload</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </CardContent>
      </Card>
    )
  }

  const documents = profileData?.documents

  const documentsList = [
    {
      label: "Resume",
      file: documents?.resume || null,
      key: "resume" as const,
    },
    {
      label: "Medical License",
      file: documents?.medicalLicense || null,
      key: "medicalLicense" as const,
    },
    {
      label: "Introduction Video",
      file: documents?.introductionVideo || null,
      key: "introductionVideo" as const,
    },
  ]

  return (
    <>
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Documents Upload</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:space-y-8">
          <div>
            <div className="block lg:hidden space-y-4">
              {documentsList.map((doc) => (
                <div key={doc.label}>
                  <div className="text-foreground mb-2">{doc.label}</div>
                  <div className="flex items-center justify-between text-muted-foreground border-b pb-2">
                    {doc.file ? (
                      <button
                        type="button"
                        onClick={() =>
                          handlePreview(doc.file as string, doc.label)
                        }
                        className="text-primary hover:underline text-sm text-left"
                      >
                        {getFileName(doc.file)}
                      </button>
                    ) : (
                      <span className="text-sm">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:grid grid-cols-2">
              <div className="space-y-6">
                {documentsList.map((doc) => (
                  <div
                    key={doc.label}
                    className="text-foreground border-b p-2 pb-5 font-medium text-sm"
                  >
                    {doc.label}
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {documentsList.map((doc) => (
                  <div
                    key={doc.label}
                    className="flex items-center gap-2 border-b p-2 text-sm"
                  >
                    {doc.file ? (
                      <>
                        <Image
                          src="/pdf.svg"
                          alt="pdf"
                          width={16}
                          height={16}
                        />
                        <span className="truncate max-w-[200px]">
                          {getFileName(doc.file)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handlePreview(doc.file as string, doc.label)
                          }
                          className="h-8 w-8 p-0"
                          title="Preview document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
            >
              Edit Documents Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Documents</DialogTitle>
          </DialogHeader>
          <FormModified
            schema={documentsSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              resume: documents?.resume || "",
              medicalLicense: documents?.medicalLicense || "",
              introductionVideo: documents?.introductionVideo || "",
            }}
          >
            {({ components }) => (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground"
                  >
                    Resume
                  </Typography>
                  <components.S3FileUpload
                    name="resume"
                    singleItem={true}
                    fileType="documents"
                    maxSize={50 * 1024 * 1024} // 50MB
                    placeholder="Upload resume (Max 50MB)"
                  />
                </div>

                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground"
                  >
                    Medical License
                  </Typography>
                  <components.S3FileUpload
                    name="medicalLicense"
                    singleItem={true}
                    fileType="documents"
                    maxSize={50 * 1024 * 1024} // 50MB
                    placeholder="Upload medical license (Max 50MB)"
                  />
                </div>

                <div className="space-y-2">
                  <Typography
                    variant="p"
                    className="font-medium text-foreground"
                  >
                    Introduction Video (20-30 seconds)
                  </Typography>
                  <components.S3FileUpload
                    name="introductionVideo"
                    singleItem={true}
                    fileType="videos"
                    maxSize={200 * 1024 * 1024} // 200MB
                    placeholder="Upload introduction video (Max 200MB)"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating..." : "Update Documents"}
                  </Button>
                </div>
              </div>
            )}
          </FormModified>
        </DialogContent>
      </Dialog>

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
