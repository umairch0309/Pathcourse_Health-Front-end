"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { useStepper } from "@/components/ui/stepper"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import auth from "@/lib/auth"

// Schema
const contactInfoSchema = z.object({
  image: z.string().optional(),
  professionalPhone: z.string().min(1, "Professional phone is required"),
  professionalEmail: z.string().email("Invalid professional email"),
})

type ContactInfoValues = z.infer<typeof contactInfoSchema>

type DoctorData = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  user?: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
  }
}

type UserInfoData = {
  id: string
  userId: string
  gender: string | null
  dateOfBirth: string | null
  phone: string | null
  address: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
  }
}

type DoctorApiRequest = {
  professional_contact: string
  professional_email: string
  image?: string
  phone?: string
  address?: string
}

type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string | null
}

export default function ContactInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const { nextStep } = useStepper()
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

  // Fetch user info
  const { data: userInfoData } = useFetch<UserInfoData>({
    path: "/api/user/info",
    queryKey: ["user-info", "current"],
    config: {
      enabled: !isLoadingSession && !!user, // Only fetch when session is loaded
      retry: false, // Don't retry on 404 (user info might not exist yet)
    },
  })

  // Fetch doctor data if exists
  const { data: doctorData } = useFetch<DoctorData>({
    path: "/api/doctor",
    queryKey: ["doctor", "current"],
    config: {
      enabled: !isLoadingSession && !!user, // Only fetch when session is loaded
      retry: false, // Don't retry on 404 (doctor might not exist yet)
    },
  })

  // API hook for submitting doctor data
  const { onRequest, isPending: isSubmitting } = useApi<DoctorApiRequest>({
    key: "doctor-update",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = (values: ContactInfoValues) => {
    // S3FileUpload passes S3 KEYS (not URLs) - store the key directly
    // Extract key from URL if it's a URL (backward compatibility with old data)
    // Otherwise use the value as-is (it's already a key)
    let imageKey: string | undefined
    if (values.image?.trim()) {
      if (values.image.startsWith("http")) {
        // Extract S3 key from URL (for backward compatibility with old data)
        try {
          const url = new URL(values.image)
          const pathname = url.pathname
          // Remove leading slash and bucket name
          const parts = pathname.split("/").filter(Boolean)
          // Remove bucket name (pathcourse or international.hc)
          if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
            parts.shift()
          }
          imageKey = parts.join("/")
          console.log("Extracted key from URL:", imageKey)
        } catch {
          // If URL parsing fails, try to extract from pathname directly
          const match = values.image.match(
            /\/pathcourse\/(.+)|international\.hc\/(.+)/
          )
          imageKey = match ? match[1] || match[2] : values.image
          console.log("Extracted key from URL (fallback):", imageKey)
        }
      } else {
        // Value is already a key - use it directly
        imageKey = values.image
        console.log("Image value is already a key:", imageKey)
      }
    }

    const apiData: DoctorApiRequest = {
      professional_contact: values.professionalPhone,
      professional_email: values.professionalEmail,
    }

    // Store the S3 key (not URL) in the database
    if (imageKey) {
      apiData.image = imageKey
      console.log("Image key added to API data:", imageKey)
    }

    onRequest({
      path: "/api/doctor",
      data: apiData,
      onSuccess: () => {
        nextStep()
      },
      onError: (error) => {
        console.error("Error submitting doctor info:", error)
      },
    })
  }

  // Helper function to extract S3 key from URL or return key as-is
  // For display purposes, we need to construct a URL from the key
  const extractImageKey = (imageValue: string | null | undefined): string => {
    if (!imageValue) return ""

    // If it's a URL, extract the key
    if (imageValue.startsWith("http")) {
      try {
        const url = new URL(imageValue)
        const pathname = url.pathname
        const parts = pathname.split("/").filter(Boolean)
        // Remove bucket name (pathcourse or international.hc)
        if (parts[0] === "pathcourse" || parts[0] === "international.hc") {
          parts.shift()
        }
        return parts.join("/")
      } catch {
        // Fallback: try regex extraction
        const match = imageValue.match(
          /\/pathcourse\/(.+)|international\.hc\/(.+)/
        )
        return match ? match[1] || match[2] : imageValue
      }
    }

    // If it's already a key, return as-is
    return imageValue
  }

  // Helper to construct URL from key for display in S3FileUpload
  const constructImageUrl = (key: string): string => {
    if (!key) return ""
    if (key.startsWith("http")) return key // Already a URL
    return `https://s3.eu-north-1.amazonaws.com/pathcourse/${key}`
  }

  // Prepare default values
  const getDefaultValues = (): ContactInfoValues => {
    const imageValue =
      doctorData?.user?.image || userInfoData?.user?.image || user?.image || ""

    // Extract key from URL or use as-is if already a key
    const imageKey = extractImageKey(imageValue)
    // Construct URL for S3FileUpload component display
    const imageUrl = constructImageUrl(imageKey)

    console.log(
      "Default values - imageValue:",
      imageValue,
      "extracted key:",
      imageKey,
      "constructed URL:",
      imageUrl
    )

    return {
      image: imageKey, // Store KEY in form field (S3FileUpload will display it correctly)
      professionalPhone: doctorData?.professional_contact || "",
      professionalEmail: doctorData?.professional_email || "",
    }
  }

  return (
    <FormModified
      schema={contactInfoSchema}
      onSubmit={handleSubmit}
      defaultValues={getDefaultValues()}
      formKey={doctorData?.id || userInfoData?.id || user?.id || "new"} // Reset form when data changes
    >
      {({ components }) => (
        <div className="space-y-6">
          <div className="space-y-4">
            <Typography variant="p" className="font-bold text-foreground">
              Profile Image
            </Typography>
            <components.S3FileUpload
              name="image"
              singleItem={true}
              fileType="images"
              maxSize={50 * 1024 * 1024} // 50MB
              formItemClassName="lg:w-[550px]"
              placeholder="Upload Image (Max 50MB)"
            />
          </div>

          <Typography variant="p" className="font-bold text-foreground">
            Secondary Contact Details
          </Typography>
          <div className="grid lg:grid-cols-3 gap-4">
            <components.Input
              name="professionalPhone"
              placeholder="Contact Number"
              label="Contact no."
              className="border-b mt-2 p-2"
            />
            <components.Input
              name="professionalEmail"
              placeholder="Email"
              label="Contact Email"
              className="border-b mt-2 p-2"
            />
          </div>

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
