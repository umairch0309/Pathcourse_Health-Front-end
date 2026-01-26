"use client"

import axios from "axios"
import {
  ChevronRight,
  FileText,
  FileTextIcon,
  Loader,
  Stethoscope,
} from "lucide-react"
import { useEffect, useState } from "react"
import DocumentPreview from "@/components/document-preview"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"
import { env } from "@/env"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"
import { buildRequestUrl, cn } from "@/lib/utils"

type AgoraMedicalSidebarProps = {
  isOpen: boolean
  onClose: () => void
  appointmentId?: string | null
}

type AppointmentInfo = {
  id?: string
  _id?: string
  patient?: {
    id: string
    first_name?: string
    last_name?: string
    name?: string | null
    email?: string | null
    image?: string | null
    date_of_birth?: string
    gender?: string
    isAnonymous?: boolean
    employeeCode?: string | null
    userInfo?: {
      gender?: string | null
      dateOfBirth?: string | null
    }
  }
  doctor?: {
    id: string
    name?: string
    email?: string
    image?: string | null
  }
  service?: {
    name: string
  }
  appointmentDate?: string
  appointmentTime?: string
  scheduledAt?: string
  status?: string
  description?: string
  patientId?: string
  doctorId?: string
  appointmentFor?: "self" | "someone else"
  uploadId?: string | null
}

type AppointmentNotes = {
  id: string
  appointmentId: string
  doctorId: string
  notes: string
  createdAt: string
  updatedAt: string
}

export function AgoraMedicalSidebar({
  isOpen,
  onClose,
  appointmentId,
}: AgoraMedicalSidebarProps) {
  const [currentUser, setCurrentUser] = useState<{
    id?: string
    role?: string | null
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "notes">("details")
  const [notesDraft, setNotesDraft] = useState("")

  // Fetch current user session to determine role
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setCurrentUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  const { data: appointment, isLoading } = useFetch<AppointmentInfo>({
    path: appointmentId ? `/api/appointment/${appointmentId}` : "",
    queryKey: ["appointment", appointmentId],
    config: {
      enabled: !!appointmentId && !isLoadingSession,
      refetchOnWindowFocus: false,
    },
  })

  const isDoctor =
    currentUser?.role === "doctor" || currentUser?.role === "specialist"

  const notesPath = appointmentId
    ? `/api/appointment/${appointmentId}/notes`
    : "/api/appointment/placeholder/notes"

  const {
    data: notesData,
    isLoading: isLoadingNotes,
    error: notesError,
    refetch: refetchNotes,
  } = useFetch<AppointmentNotes>({
    path: notesPath,
    queryKey: ["appointment-notes", appointmentId],
    config: {
      enabled: !!appointmentId && !!isDoctor && !isLoadingSession,
      retry: false,
    },
  })

  useEffect(() => {
    if (notesData?.notes) {
      setNotesDraft(notesData.notes)
    } else if (
      notesError &&
      (notesError as any)?.response?.status === 404 &&
      !notesDraft
    ) {
      // No notes yet - keep draft empty
      setNotesDraft("")
    }
  }, [notesData, notesError])

  const { onRequest: saveNotes, isPending: isSavingNotes } = useApi<{
    notes: string
  }>({
    key: "appointment-notes",
    method: "post",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const handleSaveNotes = () => {
    if (!appointmentId || !notesDraft.trim()) return
    saveNotes({
      path: `/api/appointment/${appointmentId}/notes`,
      data: { notes: notesDraft },
      onSuccess: async () => {
        await refetchNotes()
      },
    })
  }

  // Determine if current user is viewing their own data
  const isPatient = currentUser?.role === "patient"
  const isViewingOwnData =
    isPatient && appointment?.patientId === currentUser?.id

  // Helper function to get patient display info
  const getPatientDisplayInfo = () => {
    if (!appointment?.patient) return null

    const patient = appointment.patient
    // If name, email, and image are all null/empty, treat as anonymous and show employee code
    const isAnonymous =
      (patient.isAnonymous && !isViewingOwnData) ||
      (!patient.name && !patient.email && !patient.image && !isViewingOwnData)

    // If patient is anonymous and doctor is viewing, show employee code
    if (isAnonymous) {
      return {
        name: patient.employeeCode || "—",
        email: null,
        dateOfBirth: null,
        gender: null,
      }
    }

    return {
      name:
        patient.name ||
        (patient.first_name && patient.last_name
          ? `${patient.first_name} ${patient.last_name}`
          : null),
      email: patient.email,
      dateOfBirth: patient.date_of_birth || patient.userInfo?.dateOfBirth,
      gender: patient.gender || patient.userInfo?.gender,
    }
  }

  const patientInfo = getPatientDisplayInfo()

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

  // Get file name from URL or key
  const getFileName = (keyOrUrl: string): string => {
    try {
      const urlObj = new URL(keyOrUrl)
      const pathname = urlObj.pathname
      const segments = pathname.split("/")
      return segments[segments.length - 1] || "Uploaded file"
    } catch {
      const segments = keyOrUrl.split("/")
      return segments[segments.length - 1] || "Uploaded file"
    }
  }

  const handleFilePreview = async () => {
    if (!appointment?.uploadId || appointment.uploadId === "-") return

    setIsLoadingFile(true)
    try {
      const s3Key = extractS3Key(appointment.uploadId)
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
        setFileName(getFileName(appointment.uploadId))
        setPreviewOpen(true)
      } else {
        console.error("Invalid signed URL response:", result)
      }
    } catch (error) {
      console.error("Failed to fetch signed URL:", error)
    } finally {
      setIsLoadingFile(false)
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-90 md:w-[30rem] lg:w-[40rem] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-center h-full">
          <Typography variant="p" className="text-muted-foreground">
            Loading appointment info...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-90 md:w-[30rem] lg:w-[40rem] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation()
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-[var(--secondary)]/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--sidebar-foreground)] flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Appointment
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--secondary)]/70"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {isDoctor && (
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant={activeTab === "details" ? "default" : "outline"}
                className="h-8 text-xs"
                onClick={() => setActiveTab("details")}
              >
                Info
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "notes" ? "default" : "outline"}
                className="h-8 text-xs flex items-center gap-1"
                onClick={() => setActiveTab("notes")}
              >
                <FileTextIcon className="w-3 h-3" />
                Notes
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 p-4">
          {activeTab === "details" && (
            <div className="space-y-4">
              <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Appointment Details
                </h3>
                <div className="space-y-3 text-sm">
                  {/* Patient Info */}
                  {patientInfo && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium text-gray-900">
                          {patientInfo.name || "—"}
                        </span>
                      </div>
                      {patientInfo.dateOfBirth && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(
                              patientInfo.dateOfBirth
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {patientInfo.gender && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium text-gray-900">
                            {patientInfo.gender}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Doctor Info - Only show to patients */}
                  {isPatient && appointment?.doctor && (
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium text-gray-900">
                        {appointment.doctor.name || "—"}
                      </span>
                    </div>
                  )}

                  {appointment?.appointmentFor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Appointment For:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {appointment.appointmentFor.replace("_", " ")}
                      </span>
                    </div>
                  )}
                  {(appointment?.appointmentDate ||
                    appointment?.scheduledAt) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          appointment.appointmentDate ||
                            appointment.scheduledAt ||
                            ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {appointment?.appointmentTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">
                        {appointment.appointmentTime}
                      </span>
                    </div>
                  )}
                  {appointment?.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900">
                        {appointment.status}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {appointment?.description && (
                <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
                  <h3 className="font-semibold mb-3 text-gray-900">
                    Description
                  </h3>
                  <p className="text-sm text-gray-700">
                    {appointment.description}
                  </p>
                </Card>
              )}

              {appointment?.uploadId && appointment.uploadId !== "-" && (
                <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
                  <h3 className="font-semibold mb-3 text-gray-900">
                    Uploaded File
                  </h3>
                  <div
                    className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${
                      isLoadingFile ? "opacity-50" : ""
                    }`}
                    onClick={handleFilePreview}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Uploaded file ID:
                      </div>
                      <div className="font-medium text-gray-900 truncate">
                        {getFileName(appointment.uploadId)}
                      </div>
                    </div>
                    {isLoadingFile && (
                      <div className="text-sm text-gray-500">Loading...</div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "notes" && isDoctor && appointmentId && (
            <div className="space-y-4">
              <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200/50">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Appointment Notes
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  These notes are only visible to you and other authorized
                  doctors. Patients can never see them.
                </p>
                {isLoadingNotes && !notesData && !notesError ? (
                  <Typography
                    variant="p"
                    className="text-muted-foreground text-sm"
                  >
                    Loading notes...
                  </Typography>
                ) : notesError &&
                  (notesError as any)?.response?.status !== 404 ? (
                  <Typography variant="p" className="text-red-500 text-sm mb-2">
                    Failed to load notes. You can still create new notes below.
                  </Typography>
                ) : null}

                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={8}
                  className="mt-2 resize-none text-sm"
                  placeholder="Write your internal notes for this appointment..."
                />

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    size="lg"
                    disabled={isSavingNotes || !notesDraft.trim()}
                    onClick={handleSaveNotes}
                  >
                    {isSavingNotes ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      "Save Notes"
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </ScrollArea>
      </div>

      {fileUrl && (
        <DocumentPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          fileUrl={fileUrl}
          fileName={fileName}
          label="Uploaded File"
        />
      )}
    </div>
  )
}
