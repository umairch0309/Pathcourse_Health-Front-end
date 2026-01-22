"use client"
import { useState } from "react"
import z from "zod"
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
  professionalExperience: {
    id: string
    doctorId: string
    age_group: string
    languages: string[]
    profession: string
    special_interest_area: string
  } | null
}

const professionalExperienceSchema = z.object({
  profession: z.string().min(1, "Profession is required"),
  age_group: z.string().min(1, "Age group is required"),
  languages: z.string().min(1, "At least one language is required"),
  special_interest_area: z.string().min(1, "Special interest area is required"),
})

type ProfessionalExperienceFormData = z.infer<
  typeof professionalExperienceSchema
>

type UpdateProfessionalExperienceRequest = {
  profession?: string
  age_group?: string
  languages?: string[]
  special_interest_area?: string
}

export default function ProfessionalExperience() {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useFetch<CompleteProfile>({
    path: "/api/doctor/profile/complete",
    queryKey: ["doctor-profile-complete"],
  })

  const { onRequest, isPending } = useApi<UpdateProfessionalExperienceRequest>({
    key: "update-professional-experience",
    showSuccessToast: true,
    showErrorToast: true,
    method: "put",
  })

  const handleSubmit = (data: ProfessionalExperienceFormData) => {
    const languagesArray = data.languages
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0)

    const requestData: UpdateProfessionalExperienceRequest = {
      profession: data.profession,
      age_group: data.age_group,
      languages: languagesArray,
      special_interest_area: data.special_interest_area,
    }

    onRequest({
      path: "/api/doctor/profile/professional-experience",
      data: requestData,
      onSuccess: () => {
        setIsEditOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to update professional experience:", error)
      },
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">
              Professional Experience
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </CardContent>
      </Card>
    )
  }

  const professionalData = profileData?.professionalExperience

  if (!professionalData) {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">
              Professional Experience
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:space-y-8">
          <Typography variant="p" className="text-center text-muted-foreground">
            No professional experience data available. Please add your
            professional experience.
          </Typography>
          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
            >
              Add Professional Experience
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>
            <div className="text-foreground font-bold">
              Professional Experience
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:space-y-8">
          <div>
            <div className="block lg:hidden space-y-4">
              <div>
                <div className="text-foreground mb-2">Profession</div>
                <div className="text-muted-foreground border-b pb-2">
                  {professionalData.profession}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Age group</div>
                <div className="text-muted-foreground border-b pb-2">
                  {professionalData.age_group}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Language</div>
                <div className="text-muted-foreground border-b pb-2">
                  {professionalData.languages.join(", ")}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">
                  Special interest area
                </div>
                <div className="text-muted-foreground border-b pb-2">
                  {professionalData.special_interest_area}
                </div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2">
              <div className="space-y-6">
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Profession
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Age group
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Language
                </div>
                <div className="text-foreground border-b p-2 font-medium text-sm">
                  Special interest area
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b p-2 text-sm">
                  {professionalData.profession}
                </div>
                <div className="border-b p-2 text-sm">
                  {professionalData.age_group}
                </div>
                <div className="border-b p-2 text-sm">
                  {professionalData.languages.join(", ")}
                </div>
                <div className="border-b p-2 text-sm">
                  {professionalData.special_interest_area}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pt-4">
            <Button
              className="w-full lg:w-auto"
              onClick={() => setIsEditOpen(true)}
            >
              Edit Professional Experience
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Professional Experience</DialogTitle>
          </DialogHeader>
          <FormModified
            schema={professionalExperienceSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              profession: professionalData.profession,
              age_group: professionalData.age_group,
              languages: professionalData.languages.join(", "),
              special_interest_area: professionalData.special_interest_area,
            }}
          >
            {({ components }) => (
              <div className="space-y-4">
                <components.Input
                  name="profession"
                  label="Profession"
                  placeholder="e.g., Cardiologist"
                  required
                />
                <components.Input
                  name="age_group"
                  label="Age Group"
                  placeholder="e.g., Adults (18-65)"
                  required
                />
                <components.Input
                  name="languages"
                  label="Languages (comma-separated)"
                  placeholder="e.g., English, Spanish, French"
                  required
                />
                <components.Input
                  name="special_interest_area"
                  label="Special Interest Area"
                  placeholder="e.g., Heart Disease Prevention"
                  required
                />

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
                    {isPending ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      "Update Professional Experience"
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
