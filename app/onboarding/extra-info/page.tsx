"use client"

import { format, subYears } from "date-fns"
import { Calendar1 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { z } from "zod"
import { CountryCodeSelect } from "@/components/country-code-select"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import FormModified from "@/components/ui/form-modified"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { cn } from "@/lib/utils"

const patientInfoSchema = z.object({
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        const dayDiff = today.getDate() - birthDate.getDate()

        // Calculate actual age considering month and day
        const actualAge =
          monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
        return actualAge >= 18
      },
      {
        message: "You must be at least 18 years old",
      }
    ),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
})

type PatientInfoFormData = z.infer<typeof patientInfoSchema>

type UserInfoApiData = {
  address: string | null
  dateOfBirth: string | null
  gender: string | null
  phone: string | null
}

function PatientInfoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "patient" // Default to patient if no role
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [countryCode, setCountryCode] = useState("+1")
  const [calendarOpen, setCalendarOpen] = useState(false)

  const { onRequest, isPending } = useApi<UserInfoApiData>({
    key: "user-info",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const handleSubmit = (data: PatientInfoFormData) => {
    // Convert date from 'yyyy-MM-dd' to ISO 8601 format (date-time)
    const dateOfBirthISO = data.date_of_birth
      ? new Date(data.date_of_birth + "T00:00:00Z").toISOString()
      : null

    // Prepare API data
    const apiData: UserInfoApiData = {
      address: data.address || null,
      dateOfBirth: dateOfBirthISO,
      gender: data.gender || null,
      phone: countryCode + data.phone || null, // Combine country code with phone number
    }

    onRequest({
      path: "/api/user/info",
      data: apiData,
      onSuccess: () => {
        // Navigate to appropriate portal based on role
        if (role === "practitioner") {
          router.push("/specialist" as any)
        } else {
          router.push("/patient" as any)
        }
      },
      onError: (error) => {
        console.error("Error submitting user info:", error)
      },
    })
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Logo in top corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={32}
            priority
            className="w-16 h-8 sm:w-20 sm:h-10"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <Typography
              as="h3"
              variant="h5"
              className="text-xl font-bold sm:text-2xl text-primary"
            >
              <span className="text-foreground">Complete Your Details</span>
            </Typography>
            <Typography variant="span" className="text-foreground">
              Please provide your additional details to complete your profile.
              This will help us to better serve you.
            </Typography>
          </div>

          <FormModified
            schema={patientInfoSchema}
            onSubmit={handleSubmit}
            disabled={isPending}
            defaultValues={{
              date_of_birth: "",
              gender: "",
              address: "",
              phone: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <components.Field
                    name="date_of_birth"
                    label="Date of Birth"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {(field) => (
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm"
                          >
                            <span
                              className={cn(
                                "truncate",
                                selectedDate
                                  ? "text-foreground"
                                  : "text-muted-foreground/60"
                              )}
                            >
                              {selectedDate
                                ? format(selectedDate, "PPP")
                                : "Select date of birth"}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 overflow-visible">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                              if (date) {
                                setCalendarOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </components.Field>

                  <components.Field
                    name="gender"
                    label="Gender"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {(field) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-0 border-b-2 border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </components.Field>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground mb-2">Phone</Label>
                  <div className="grid grid-cols-3 gap-5 sm:gap-2 mt-2">
                    <div className="col-span-1">
                      <CountryCodeSelect
                        value={countryCode}
                        onValueChange={setCountryCode}
                        disabled={isPending}
                      />
                    </div>

                    <div className="col-span-2">
                      <components.Input
                        name="phone"
                        label=""
                        type="tel"
                        placeholder="(234) 567-8900"
                        labelClassName="hidden"
                      />
                    </div>
                  </div>
                </div>

                <components.Input
                  name="address"
                  label="Address"
                  placeholder="Address"
                  labelClassName="text-xs text-muted-foreground mb-2"
                />

                <div className="flex justify-center items-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="w-full sm:w-auto min-w-[250px]"
                  >
                    {isPending ? (
                      <>
                        <Loader
                          size="sm"
                          variant="default"
                          color="white"
                          className="mr-2"
                        />
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </FormModified>
        </div>
      </div>
    </div>
  )
}

export default function PatientInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex flex-col min-h-screen">
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center">
              <Typography variant="p" className="text-foreground">
                Loading...
              </Typography>
            </div>
          </div>
        </div>
      }
    >
      <PatientInfoContent />
    </Suspense>
  )
}
