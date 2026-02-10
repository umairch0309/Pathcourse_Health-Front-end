"use client"

import { format } from "date-fns"
import { Calendar1 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStepper } from "@/components/ui/stepper"
import { Typography } from "@/components/ui/typography"

// Schema
const contactInfoSchema = z.object({
  image: z.custom<FileList>(
    (val) => val instanceof FileList && val.length > 0,
    { message: "Please upload an image" }
  ),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  professionalPhone: z.string().min(1, "Professional phone is required"),
  professionalEmail: z.string().email("Invalid professional email"),
  about: z.string().min(1, "About is required"),
})

type ContactInfoValues = z.infer<typeof contactInfoSchema>

export default function ContactInfo() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const { nextStep } = useStepper()
  const router = useRouter()

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfilePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setProfilePreview(null)
    }
  }

  const handleSubmit = (values: ContactInfoValues) => {
    const file = values.image[0]
    console.log("Uploaded file:", file)
    console.log("Form values:", values)
    nextStep()
  }

  return (
    <FormModified
      schema={contactInfoSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        image: undefined,
        name: "",
        phone: "",
        email: "",
        address: "",
        professionalPhone: "",
        professionalEmail: "",
        about: "",
      }}
    >
      {({ components, methods }) => (
        <div className="space-y-6">
          <div className="space-y-4">
            <Typography variant="p" className="font-bold text-foreground">
              Profile Image
            </Typography>
            <components.Field name="image" formItemClassName="lg:w-[150px]">
              {(field) => (
                <div className="flex flex-col items-center justify-center bg-gray-200 w-full lg:w-[150px] lg:h-[150px] border rounded-md mb-1 text-center px-2">
                  {profilePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={profilePreview}
                        alt="Profile Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-md"
                      >
                        <Typography
                          variant="span"
                          className="font-bold text-white"
                        >
                          Change Image
                        </Typography>
                      </Label>
                    </div>
                  ) : (
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                    >
                      <Image
                        src="/upload.svg"
                        alt="Upload"
                        width={30}
                        height={30}
                        className="mb-2"
                      />
                      <div className="text-sm font-bold text-black">
                        Upload Image
                      </div>
                      <div className="text-xs text-center mt-1 text-muted-foreground">
                        Max image size allowed 50mb
                      </div>
                    </Label>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      field.onChange(e.target.files)
                      handleImageChange(file)
                    }}
                  />
                </div>
              )}
            </components.Field>
          </div>

          <Typography variant="p" className="font-bold text-foreground">
            Personal Contact Details
          </Typography>
          <div className="grid lg:grid-cols-3 gap-4">
            <components.Input
              name="name"
              placeholder="Contact Name"
              label="Contact person name."
              className="border-b p-2"
            />
            <components.Input
              name="phone"
              placeholder="Contact Number"
              label="Contact no."
              className="border-b p-2"
            />
            <components.Input
              name="email"
              placeholder="Email"
              label="Email"
              className="border-b p-2"
            />
          </div>

          <components.Input
            name="address"
            placeholder="Address"
            label="Address"
            className="border-b p-2"
            formItemClassName="mt-10"
          />

          <Typography variant="p" className="font-bold text-foreground">
            Professional Contact Details
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
          <components.Input
            name="about"
            placeholder="About"
            label="About"
            className="border-b mt-2 p-2"
          />

          <div className="flex gap-4 mt-8 mb-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/specialist")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Continue
            </Button>
          </div>
        </div>
      )}
    </FormModified>
  )
}
