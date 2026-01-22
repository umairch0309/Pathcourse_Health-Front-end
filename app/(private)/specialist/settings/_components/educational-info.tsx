"use client"
import { format, parse } from "date-fns"
import { Calendar1, Trash2 } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { cn } from "@/lib/utils"

type Education = {
  id: string
  doctorId: string
  degree: string
  startYear: string
  endYear: string | null
  document: string | null
  institution_name: string
}

type CompleteProfile = {
  education: Education[]
}

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional().nullable(),
  document: z.string().optional().nullable(),
  institution_name: z.string().min(1, "Institution name is required"),
})

type EducationFormData = z.infer<typeof educationSchema>

type AddEducationRequest = {
  degree: string
  startYear: string
  endYear?: string | null
  document?: string | null
  institution_name: string
}

export default function EducationalInfo() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(
    null
  )
  const [startCalendarOpen, setStartCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)

  const underlineInputClass =
    "flex h-9 w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary"

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useFetch<CompleteProfile>({
    path: "/api/doctor/profile/complete",
    queryKey: ["doctor-profile-complete"],
  })

  const { onRequest: addEducation, isPending: isAdding } =
    useApi<AddEducationRequest>({
      key: "add-education",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  const { onRequest: deleteEducation, isPending: isDeleting } = useApi<{
    degree?: string
    startYear?: string
    endYear?: string | null
    document?: string | null
    institution_name?: string
  }>({
    key: "delete-education",
    showSuccessToast: true,
    showErrorToast: true,
    method: "delete",
  })

  const handleAddEducation = (data: EducationFormData) => {
    const requestData: AddEducationRequest = {
      degree: data.degree,
      startYear: data.startYear
        ? parse(data.startYear, "yyyy-MM-dd", new Date()).toISOString()
        : new Date().toISOString(),
      endYear: data.endYear
        ? parse(data.endYear, "yyyy-MM-dd", new Date()).toISOString()
        : null,
      document: data.document || null,
      institution_name: data.institution_name,
    }

    addEducation({
      path: "/api/doctor/profile/education",
      data: requestData,
      onSuccess: () => {
        setIsAddOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to add education record:", error)
      },
    })
  }

  const handleConfirmDelete = () => {
    if (!educationToDelete) return
    const educationId = educationToDelete.id

    setDeletingId(educationId)
    deleteEducation({
      path: `/api/doctor/profile/education/${educationId}`,
      data: {},
      onSuccess: () => {
        setDeletingId(null)
        setEducationToDelete(null)
        setDeleteModalOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to delete education record:", error)
        setDeletingId(null)
        setEducationToDelete(null)
        setDeleteModalOpen(false)
      },
    })
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"
    try {
      return format(new Date(dateString), "PPP")
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Educational Info</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </CardContent>
      </Card>
    )
  }

  const educationData = profileData?.education || []

  return (
    <>
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">Educational Info</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:space-y-8">
          {educationData.length === 0 ? (
            <Typography
              variant="p"
              className="text-center text-muted-foreground"
            >
              No education records available. Please add your education
              information.
            </Typography>
          ) : (
            educationData.map((edu, index) => (
              <div key={edu.id} className="space-y-4">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="font-semibold text-foreground">
                    Education {index + 1}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEducationToDelete(edu)
                      setDeleteModalOpen(true)
                    }}
                    disabled={deletingId === edu.id || isDeleting}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="block lg:hidden space-y-4">
                  <div>
                    <div className="text-foreground mb-2">Degree title</div>
                    <div className="text-muted-foreground border-b pb-2">
                      {edu.degree}
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground mb-2">Institute name</div>
                    <div className="text-muted-foreground border-b pb-2">
                      {edu.institution_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground mb-2">Start date</div>
                    <div className="text-muted-foreground border-b pb-2">
                      {formatDate(edu.startYear)}
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground mb-2">Completion date</div>
                    <div className="text-muted-foreground border-b pb-2">
                      {formatDate(edu.endYear)}
                    </div>
                  </div>
                  {edu.document && (
                    <div>
                      <div className="text-foreground mb-2 font-medium">
                        Document
                      </div>
                      <div className="text-muted-foreground border-b pb-2">
                        <a
                          href={edu.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden lg:grid grid-cols-2">
                  <div className="space-y-6">
                    <div className="text-foreground border-b p-2 font-medium text-sm">
                      Degree title
                    </div>
                    <div className="text-foreground border-b p-2 font-medium text-sm">
                      Institute name
                    </div>
                    <div className="text-foreground border-b p-2 font-medium text-sm">
                      Start date
                    </div>
                    <div className="text-foreground border-b p-2 font-medium text-sm">
                      Completion date
                    </div>
                    {edu.document && (
                      <div className="text-foreground border-b p-2 font-medium text-sm">
                        Document
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="border-b p-2 text-sm">{edu.degree}</div>
                    <div className="border-b p-2 text-sm">
                      {edu.institution_name}
                    </div>
                    <div className="border-b p-2 text-sm">
                      {formatDate(edu.startYear)}
                    </div>
                    <div className="border-b p-2 text-sm">
                      {formatDate(edu.endYear)}
                    </div>
                    {edu.document && (
                      <div className="border-b p-2 text-sm">
                        <a
                          href={edu.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {index < educationData.length - 1 && (
                  <div className="border-t border-muted my-6" />
                )}
              </div>
            ))
          )}

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsAddOpen(true)}
            >
              Add Education Record
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Education Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Typography variant="p" className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {educationToDelete?.degree || "this education record"}
              </span>
              ? This action cannot be undone.
            </Typography>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!isDeleting) {
                    setDeleteModalOpen(false)
                    setEducationToDelete(null)
                  }
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader size="sm" color="white" /> : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Education Record</DialogTitle>
          </DialogHeader>
          <FormModified
            schema={educationSchema}
            onSubmit={handleAddEducation}
            defaultValues={{
              degree: "",
              startYear: "",
              endYear: "",
              document: "",
              institution_name: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-4">
                <components.Input
                  name="degree"
                  label="Degree"
                  placeholder="e.g., Doctor of Medicine (MD)"
                  className={underlineInputClass}
                  required
                />
                <components.Input
                  name="institution_name"
                  label="Institution Name"
                  placeholder="e.g., Harvard Medical School"
                  className={underlineInputClass}
                  required
                />
                <components.Field
                  name="startYear"
                  label="Start Year"
                  formItemClassName="space-y-2"
                >
                  {(field) => {
                    const dateValue = field.value
                      ? parse(field.value, "yyyy-MM-dd", new Date())
                      : undefined
                    return (
                      <Popover
                        open={startCalendarOpen}
                        onOpenChange={setStartCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              underlineInputClass,
                              "justify-between"
                            )}
                          >
                            <span className="truncate">
                              {dateValue
                                ? format(dateValue, "PPP")
                                : "Select start date"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setStartCalendarOpen(false)
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
                  name="endYear"
                  label="End Year (Optional)"
                  formItemClassName="space-y-2"
                >
                  {(field) => {
                    const dateValue = field.value
                      ? parse(field.value, "yyyy-MM-dd", new Date())
                      : undefined
                    return (
                      <Popover
                        open={endCalendarOpen}
                        onOpenChange={setEndCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              underlineInputClass,
                              "justify-between"
                            )}
                          >
                            <span className="truncate">
                              {dateValue
                                ? format(dateValue, "PPP")
                                : "Select end date (optional)"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setEndCalendarOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                </components.Field>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      "Add Education Record"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </FormModified>
        </DialogContent>
      </Dialog>
    </>
  )
}
