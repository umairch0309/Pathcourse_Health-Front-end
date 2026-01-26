"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFetch } from "@/hooks/use-fetch"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

type ApprovedDoctor = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    phone: string | null
    banned: boolean
    banReason: string | null
    banExpires: string | null
    onboardingStage: string
    createdAt: string
  }
  documents: {
    id: string
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  } | null
  education: Array<{
    id: string
    degree: string
    institution_name: string
    startYear: string
    endYear: string
    document: string | null
  }>
  professionalExperience: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type ApprovedDoctorsResponse = {
  doctors: ApprovedDoctor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type Specialist = {
  id: string
  specialist: {
    name: string
    image: string
  }
  email: string
  contactNo: string
  specialistIn: string
  addedOn: string
}

type DoctorRequest = {
  id: string
  userid: string
  professional_contact: string
  professional_email: string
  secondary_contact: string | null
  isAvailable: boolean
  isInMeeting: boolean
  rejectReason: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    onboardingStage: string
    createdAt: string
  }
  documents: {
    id: string
    resume: string | null
    medicalLicense: string | null
    introductionVideo: string | null
  } | null
  education: Array<{
    id: string
    degree: string
    institution_name: string
    startYear: string
    endYear: string
  }>
  professionalExperience: {
    id: string
    profession: string
    special_interest_area: string
    age_group: string
    languages: string[]
  } | null
}

type DoctorRequestsResponse = {
  doctors: DoctorRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const columns: Column<Specialist>[] = [
  {
    key: "specialist",
    header: "Specialist",
    render: (row) => {
      const initials = row.specialist.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={row.specialist.image} alt={row.specialist.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{row.specialist.name}</span>
        </div>
      )
    },
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "contactNo",
    header: "Contact no.",
  },
  {
    key: "specialistIn",
    header: "Specialist in",
  },
  {
    key: "addedOn",
    header: "Added on",
  },
]

const filters: FilterConfig[] = [
  {
    label: "Sort by",
    key: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
      { label: "Name (A-Z)", value: "name-asc" },
      { label: "Name (Z-A)", value: "name-desc" },
    ],
  },
]

export default function SpecialistsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("registered")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
  }, [])

  // Get user permissions
  const { hasPermission } = useUserPermissions(userId)

  // Fetch approved doctors for Registered tab
  const approvedDoctorsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    return `/api/admin/doctors/approved?${params.toString()}`
  }, [currentPage])

  const { data: approvedDoctorsData, isLoading: isLoadingApproved } =
    useFetch<ApprovedDoctorsResponse>({
      path: approvedDoctorsPath,
      queryKey: ["approved-doctors", currentPage],
      config: {
        enabled: activeTab === "registered",
      },
    })

  // Fetch doctor requests for New Requests tab
  const doctorRequestsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    return `/api/admin/doctor-requests?${params.toString()}`
  }, [currentPage])

  const { data: doctorRequestsData, isLoading: isLoadingRequests } =
    useFetch<DoctorRequestsResponse>({
      path: doctorRequestsPath,
      queryKey: ["doctor-requests", currentPage],
      config: {
        enabled: activeTab === "new-requests",
      },
    })

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
  }

  // Transform approved doctors to table format
  const transformedApprovedDoctors = useMemo(() => {
    if (!approvedDoctorsData?.doctors) return []
    return approvedDoctorsData.doctors.map((doctor) => ({
      id: doctor.id,
      specialist: {
        name: doctor.user.name,
        image: doctor.user.image || "/doc-1.svg",
      },
      email: doctor.user.email,
      contactNo: doctor.professional_contact || "-",
      specialistIn: doctor.professionalExperience?.profession || "-",
      addedOn: new Date(doctor.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }))
  }, [approvedDoctorsData])

  // Transform doctor requests to table format
  const transformedDoctorRequests = useMemo(() => {
    if (!doctorRequestsData?.doctors) return []
    return doctorRequestsData.doctors.map((doctor) => ({
      id: doctor.id,
      specialist: {
        name: doctor.user.name,
        image: doctor.user.image || "/doc-1.svg",
      },
      email: doctor.user.email,
      contactNo: doctor.professional_contact || "-",
      specialistIn: doctor.professionalExperience?.profession || "-",
      addedOn: new Date(doctor.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }))
  }, [doctorRequestsData])

  const registeredActions: ActionMenuItem<Specialist>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/specialists/${row.id}` as never)
      },
    },
  ]

  const newRequestsActions: ActionMenuItem<Specialist>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/specialists/detail/${row.id}` as never)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Specialists
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="space-x-4">
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="registered"
            >
              Registered
            </TabsTrigger>
            <TabsTrigger
              className="text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2"
              value="new-requests"
            >
              New Requests
            </TabsTrigger>
          </TabsList>

          {/* Filter Dropdowns */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={filterValues[filter.key] || undefined}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[140px] data-[placeholder]:text-foreground [&_*[data-slot=select-value]]:font-semibold">
                    <SelectValue
                      placeholder={filter.placeholder || filter.label}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="registered" className="mt-0">
          <DataTable
            data={transformedApprovedDoctors}
            columns={columns}
            filters={filters}
            actions={registeredActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            customButton={
              hasPermission("specialists.add") ? (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push("/admin/specialists/add")}
                >
                  Add Specialist
                </Button>
              ) : undefined
            }
            isLoading={isLoadingApproved}
            pagination={
              approvedDoctorsData?.pagination
                ? {
                    currentPage: approvedDoctorsData.pagination.page,
                    totalPages: approvedDoctorsData.pagination.totalPages,
                    onPageChange: (page) => setCurrentPage(page),
                  }
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="new-requests" className="mt-0">
          <DataTable
            data={transformedDoctorRequests}
            columns={columns}
            filters={filters}
            actions={newRequestsActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            isLoading={isLoadingRequests}
            pagination={
              doctorRequestsData?.pagination
                ? {
                    currentPage: doctorRequestsData.pagination.page,
                    totalPages: doctorRequestsData.pagination.totalPages,
                    onPageChange: (page) => setCurrentPage(page),
                  }
                : undefined
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
