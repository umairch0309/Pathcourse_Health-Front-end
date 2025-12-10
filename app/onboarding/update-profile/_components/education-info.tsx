"use client"

import { addYears, format, parse } from "date-fns"
import { Calendar1, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import FormModified from "@/components/ui/form-modified"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStepper } from "@/components/ui/stepper"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"
import { cn } from "@/lib/utils"

const educationSchema = z.object({
  education: z
    .array(
      z
        .object({
          degreeTitle: z.string().min(1, "Degree title is required"),
          instituteName: z.string().min(1, "Institute name is required"),
          startDate: z.string().min(1, "Start date is required"),
          completionDate: z.string().optional(), // Optional for ongoing education
          transcript: z.string().optional(), // S3 key
        })
        .refine(
          (data) => {
            // If completion date is not provided (ongoing education), skip validation
            if (!data.startDate || !data.completionDate) return true
            const start = parse(data.startDate, "yyyy-MM-dd", new Date())
            const completion = parse(
              data.completionDate,
              "yyyy-MM-dd",
              new Date()
            )
            const minCompletion = addYears(start, 2)
            return completion >= minCompletion
          },
          {
            message:
              "Completion date must be at least 2 years after start date",
            path: ["completionDate"],
          }
        )
    )
    .min(1, "At least one education entry is required"),
})

type EducationValues = z.infer<typeof educationSchema>

type EducationData = {
  id: string
  doctorId: string
  degree: string
  startYear: string
  endYear: string | null
  document: string | null
  institution_name: string
  createdAt: string
  updatedAt: string
}

type EducationApiResponse = {
  educations: EducationData[]
}

type EducationApiRequest = {
  educations: Array<{
    degree: string
    startYear: string
    endYear?: string | null
    document?: string | null
    institution_name: string
  }>
}

type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string | null
}

export default function EducationalInfo() {
  const { nextStep } = useStepper()
  const [entries, setEntries] = useState([0])
  const router = useRouter()
  const [calendarOpen, setCalendarOpen] = useState<Record<string, boolean>>({})
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user as User)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingSession(false)
      }
    }
    fetchSession()
  }, [])

  // Fetch existing education data
  const { data: educationData } = useFetch<EducationApiResponse>({
    path: "/api/education",
    queryKey: ["education", "current"],
    config: {
      enabled: !isLoadingSession && !!user,
      retry: false,
    },
  })

  // API hook for submitting education data
  const { onRequest, isPending: isSubmitting } = useApi<EducationApiRequest>({
    key: "education-create",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  // Update entries when education data loads
  useEffect(() => {
    if (educationData?.educations && educationData.educations.length > 0) {
      setEntries(educationData.educations.map((_, index) => index))
    }
  }, [educationData])

  const handleSubmit = (values: EducationValues) => {
    // Convert form values to API format
    const educations = values.education.map((edu) => {
      // Convert startDate from yyyy-MM-dd to ISO 8601
      const startYearISO = edu.startDate
        ? new Date(edu.startDate + "T00:00:00.000Z").toISOString()
        : ""

      // Convert completionDate from yyyy-MM-dd to ISO 8601 (optional)
      const endYearISO = edu.completionDate
        ? new Date(edu.completionDate + "T00:00:00.000Z").toISOString()
        : null

      // S3FileUpload passes S3 KEYS (not URLs) - store the key directly
      // Extract key from URL if it's a URL (backward compatibility with old data)
      let documentKey: string | null = null
      if (edu.transcript?.trim()) {
        if (edu.transcript.startsWith("http")) {
          // Extract S3 key from URL (for backward compatibility)
          try {
            const url = new URL(edu.transcript)
            const pathname = url.pathname
            const parts = pathname.split("/").filter(Boolean)
            // Remove bucket name (pathcourse or international.hc)
            if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
              parts.shift()
            }
            documentKey = parts.join("/")
          } catch {
            // Fallback: try regex extraction
            const match = edu.transcript.match(
              /\/pathcourse\/(.+)|international\.hc\/(.+)/
            )
            documentKey = match ? match[1] || match[2] : edu.transcript
          }
        } else {
          // Value is already a key - use it directly
          documentKey = edu.transcript
        }
      }

      return {
        degree: edu.degreeTitle,
        startYear: startYearISO,
        endYear: endYearISO,
        document: documentKey, // Store S3 key (not URL) in database
        institution_name: edu.instituteName,
      }
    })

    onRequest({
      path: "/api/education",
      data: { educations },
      onSuccess: () => {
        nextStep()
      },
      onError: (error) => {
        console.error("Error submitting education info:", error)
      },
    })
  }

  const addAnother = () => {
    setEntries((prev) => [...prev, prev.length])
  }

  const removeEntry = (indexToRemove: number) => {
    if (entries.length > 1) {
      setEntries((prev) => prev.filter((_, index) => index !== indexToRemove))
      // Clean up calendar state for removed entry
      const newCalendarOpen = { ...calendarOpen }
      delete newCalendarOpen[`start-${indexToRemove}`]
      delete newCalendarOpen[`completion-${indexToRemove}`]
      setCalendarOpen(newCalendarOpen)
    }
  }

  const getCalendarKey = (type: "start" | "completion", index: number) =>
    `${type}-${index}`

  // Helper function to extract S3 key from URL or return key as-is
  const extractDocumentKey = (
    documentValue: string | null | undefined
  ): string => {
    if (!documentValue) return ""

    // If it's a URL, extract the key
    if (documentValue.startsWith("http")) {
      try {
        const url = new URL(documentValue)
        const pathname = url.pathname
        const parts = pathname.split("/").filter(Boolean)
        // Remove bucket name (pathcourse or international.hc)
        if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
          parts.shift()
        }
        return parts.join("/")
      } catch {
        // Fallback: try regex extraction
        const match = documentValue.match(
          /\/pathcourse\/(.+)|international\.hc\/(.+)/
        )
        return match ? match[1] || match[2] : documentValue
      }
    }

    // If it's already a key, return as-is
    return documentValue
  }

  // Helper function to convert ISO 8601 to yyyy-MM-dd
  const isoToDateString = (isoString: string | null | undefined): string => {
    if (!isoString) return ""
    try {
      const date = new Date(isoString)
      return format(date, "yyyy-MM-dd")
    } catch {
      return ""
    }
  }

  // Prepare default values
  const getDefaultValues = (): EducationValues => {
    if (educationData?.educations && educationData.educations.length > 0) {
      return {
        education: educationData.educations.map((edu) => ({
          degreeTitle: edu.degree || "",
          instituteName: edu.institution_name || "",
          startDate: isoToDateString(edu.startYear),
          completionDate: isoToDateString(edu.endYear),
          transcript: extractDocumentKey(edu.document), // Store KEY in form field (S3FileUpload will display it correctly)
        })),
      }
    }

    return {
      education: entries.map(() => ({
        degreeTitle: "",
        instituteName: "",
        startDate: "",
        completionDate: "",
        transcript: "",
      })),
    }
  }

  return (
    <FormModified
      schema={educationSchema}
      onSubmit={handleSubmit}
      defaultValues={getDefaultValues()}
      formKey={educationData?.educations?.length || entries.length}
    >
      {({ components, methods }) => (
        <div className="space-y-6">
          <Typography variant="p" className="font-bold text-foreground">
            Educational
          </Typography>

          {entries.map((entry, index) => (
            <div key={entry} className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <components.Input
                  name={`education.${index}.degreeTitle`}
                  placeholder="Degree title"
                  label="Degree title"
                  className="border-b p-2"
                />
                <components.Input
                  name={`education.${index}.instituteName`}
                  placeholder="Institute name"
                  label="Institute name"
                  className="border-b p-2"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <components.Field
                  name={`education.${index}.startDate`}
                  label="Start date"
                  labelClassName="text-sm mb-2"
                >
                  {(field) => {
                    const startDateValue = field.value
                      ? parse(field.value, "yyyy-MM-dd", new Date())
                      : undefined
                    const calendarKey = getCalendarKey("start", index)
                    return (
                      <Popover
                        open={calendarOpen[calendarKey] || false}
                        onOpenChange={(open) =>
                          setCalendarOpen((prev) => ({
                            ...prev,
                            [calendarKey]: open,
                          }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm",
                              !startDateValue && "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">
                              {startDateValue
                                ? format(startDateValue, "PPP")
                                : "Select start date"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setCalendarOpen((prev) => ({
                                  ...prev,
                                  [calendarKey]: false,
                                }))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                </components.Field>

                <components.Field
                  name={`education.${index}.completionDate`}
                  label="Completion date (optional)"
                  labelClassName="text-sm mb-2"
                >
                  {(field) => {
                    const completionDateValue = field.value
                      ? parse(field.value, "yyyy-MM-dd", new Date())
                      : undefined
                    const calendarKey = getCalendarKey("completion", index)
                    const startDateValue = methods.watch(
                      `education.${index}.startDate`
                    )
                    const minDate = startDateValue
                      ? addYears(
                          parse(startDateValue, "yyyy-MM-dd", new Date()),
                          2
                        )
                      : undefined
                    return (
                      <Popover
                        open={calendarOpen[calendarKey] || false}
                        onOpenChange={(open) =>
                          setCalendarOpen((prev) => ({
                            ...prev,
                            [calendarKey]: open,
                          }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm",
                              !completionDateValue && "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">
                              {completionDateValue
                                ? format(completionDateValue, "PPP")
                                : "Select completion date (optional)"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={completionDateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setCalendarOpen((prev) => ({
                                  ...prev,
                                  [calendarKey]: false,
                                }))
                              }
                            }}
                            disabled={(date) =>
                              minDate ? date < minDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                </components.Field>
              </div>

              <components.S3FileUpload
                name={`education.${index}.transcript`}
                singleItem={true}
                fileType="documents"
                maxSize={10 * 1024 * 1024} // 10MB
                placeholder="Upload transcript/degree"
              />

              <div className="flex">
                {entries.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeEntry(index)}
                    variant="link"
                    className="text-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Education
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={addAnother}
                  variant="link"
                  className="text-foreground"
                >
                  <Plus className="w-4 h-4" />
                  Add Another
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-8 mb-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/specialist")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? <Loader size="sm" color="white" /> : "Continue"}
            </Button>
          </div>
        </div>
      )}
    </FormModified>
  )
}
