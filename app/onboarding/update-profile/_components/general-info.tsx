"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"
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
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

const generalInfoSchema = z.object({
  profession: z.string().min(1, "Profession is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  languages: z
    .string()
    .min(1, "At least one language is required")
    .refine(
      (value) => {
        // Split by comma and trim, filter out empty strings
        const languages = value
          .split(",")
          .map((lang) => lang.trim())
          .filter((lang) => lang.length > 0)
        return languages.length > 0
      },
      {
        message: "At least one language is required",
      }
    ),
  specialInterest: z.string().min(1, "Special interest area is required"),
  resume: z.string().optional(),
  medicalLicense: z.string().optional(),
  introductionVideo: z.string().optional(),
})

type GeneralInfoValues = z.infer<typeof generalInfoSchema>

type ProfessionalExperience = {
  id: string
  doctorId: string
  age_group: string
  languages: string[]
  profession: string
  special_interest_area: string
  createdAt: string
  updatedAt: string
}

type Documents = {
  id: string
  doctorId: string
  resume: string | null
  medicalLicense: string | null
  introductionVideo: string | null
  createdAt: string
  updatedAt: string
}

type DoctorProfileData = {
  professionalExperience: ProfessionalExperience
  documents: Documents
}

type DoctorProfileApiRequest = {
  professionalExperience: {
    age_group: string
    languages: string[]
    profession: string
    special_interest_area: string
  }
  documents: {
    resume?: string | null
    medicalLicense?: string | null
    introductionVideo?: string | null
  }
}

type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string | null
}

export default function GeneralInfo() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  const router = useRouter()

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

  // Fetch existing doctor profile data
  const { data: profileData } = useFetch<DoctorProfileData>({
    path: "/api/doctor-profile",
    queryKey: ["doctor-profile", "current"],
    config: {
      enabled: !isLoadingSession && !!user,
      retry: false,
    },
  })

  // API hook for submitting doctor profile
  const { onRequest, isPending: isSubmitting } =
    useApi<DoctorProfileApiRequest>({
      key: "doctor-profile-update",
      showSuccessToast: true,
      showErrorToast: true,
      method: "post",
    })

  const handleSubmit = (values: GeneralInfoValues) => {
    // Extract S3 keys from URLs (if any) or use keys directly
    const extractKey = (value: string | undefined): string | null => {
      if (!value?.trim()) return null

      // If it's a URL, extract the key
      if (value.startsWith("http")) {
        try {
          const url = new URL(value)
          const pathname = url.pathname
          const parts = pathname.split("/").filter(Boolean)
          // Remove bucket name (pathcourse or international.hc)
          if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
            parts.shift()
          }
          return parts.join("/")
        } catch {
          // Fallback: try regex extraction
          const match = value.match(
            /\/pathcourse\/(.+)|international\.hc\/(.+)/
          )
          return match ? match[1] || match[2] : value
        }
      }

      // If it's already a key, return as-is
      return value
    }

    // Convert comma-separated languages string to array
    const languagesArray = values.languages
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0)

    const apiData: DoctorProfileApiRequest = {
      professionalExperience: {
        age_group: values.ageGroup,
        languages: languagesArray,
        profession: values.profession,
        special_interest_area: values.specialInterest,
      },
      documents: {
        resume: extractKey(values.resume),
        medicalLicense: extractKey(values.medicalLicense),
        introductionVideo: extractKey(values.introductionVideo),
      },
    }

    onRequest({
      path: "/api/doctor-profile",
      data: apiData,
      onSuccess: () => {
        setOpen(true)
      },
      onError: (error) => {
        console.error("Error submitting doctor profile:", error)
      },
    })
  }

  // Helper to extract S3 key from URL or return key as-is
  const extractKey = (value: string | null | undefined): string => {
    if (!value) return ""

    // If it's a URL, extract the key
    if (value.startsWith("http")) {
      try {
        const url = new URL(value)
        const pathname = url.pathname
        const parts = pathname.split("/").filter(Boolean)
        // Remove bucket name (pathcourse or international.hc)
        if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
          parts.shift()
        }
        return parts.join("/")
      } catch {
        // Fallback: try regex extraction
        const match = value.match(/\/pathcourse\/(.+)|international\.hc\/(.+)/)
        return match ? match[1] || match[2] : value
      }
    }

    // If it's already a key, return as-is
    return value
  }

  // Prepare default values
  const getDefaultValues = (): GeneralInfoValues => {
    if (profileData) {
      // Convert languages array to comma-separated string
      const languagesString =
        profileData.professionalExperience?.languages.length > 0
          ? profileData.professionalExperience.languages.join(", ")
          : ""

      return {
        profession: profileData.professionalExperience?.profession || "",
        ageGroup: profileData.professionalExperience?.age_group || "",
        languages: languagesString,
        specialInterest:
          profileData.professionalExperience?.special_interest_area || "",
        resume: extractKey(profileData.documents?.resume || null),
        medicalLicense: extractKey(
          profileData.documents?.medicalLicense || null
        ),
        introductionVideo: extractKey(
          profileData.documents?.introductionVideo || null
        ),
      }
    }

    return {
      profession: "",
      ageGroup: "",
      languages: "",
      specialInterest: "",
      resume: "",
      medicalLicense: "",
      introductionVideo: "",
    }
  }

  return (
    <>
      <FormModified
        schema={generalInfoSchema}
        onSubmit={handleSubmit}
        defaultValues={getDefaultValues()}
        formKey={
          profileData?.professionalExperience?.id ||
          profileData?.documents?.id ||
          "new"
        }
      >
        {({ components }) => (
          <div className="space-y-8">
            <Typography variant="p" className="font-bold text-foreground">
              General Info
            </Typography>

            <div className="grid lg:grid-cols-3 gap-4">
              <components.Input
                name="profession"
                placeholder="Profession"
                label="Profession"
                className="border-b p-2"
              />
              <components.Input
                name="ageGroup"
                placeholder="Age group"
                label="Age group"
                className="border-b p-2"
              />
            </div>

            <components.Input
              name="languages"
              placeholder="Languages (comma-separated, e.g., English, Spanish, French)"
              label="Languages"
              className="border-b p-2"
            />

            <components.Input
              name="specialInterest"
              placeholder="Special interest area"
              label="Special interest area"
              className="border-b p-2"
            />

            <Typography variant="p" className="font-bold text-foreground">
              Upload Documents
            </Typography>

            <div className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Typography
                  variant="p"
                  className="text-sm font-medium text-muted-foreground"
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
                  className="text-sm font-medium text-muted-foreground"
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
                  className="text-sm font-medium text-muted-foreground"
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
            </div>

            <div className="flex gap-4 mt-8 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/specialist")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader size="sm" color="white" />
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </div>
        )}
      </FormModified>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Profile Updated</DialogTitle>
            <DialogDescription>
              Congratulations! Your profile details has been updated
              successfully. Now your profile is under review. You'll be notified
              soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false)
                router.push("/specialist")
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
