"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import { useFetch } from "@/hooks/use-fetch"

type Patient = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  onboardingStage: string | null
  enterpriseCode: string | null
  employeeCode: string | null
  isAnonymous: boolean | null
  createdAt: string
  updatedAt: string
  userInfo: {
    id: string
    gender: string | null
    dateOfBirth: string | null
    phone: string | null
    address: string | null
  } | null
}

type PatientsResponse = {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type TablePatient = {
  id: string
  user: {
    name: string
    image: string | null
  }
  email: string
  enterpriseCode: string | null
  employeeCode: string | null
  createdAt: string
}

const columns: Column<TablePatient>[] = [
  {
    key: "user",
    header: "User",
    render: (row) => {
      const initials = row.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={row.user.image || undefined}
              alt={row.user.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{row.user.name}</span>
        </div>
      )
    },
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "enterpriseCode",
    header: "Enterprise Code",
    render: (row) => row.enterpriseCode || "-",
  },
  {
    key: "employeeCode",
    header: "Employee Code",
    render: (row) => row.employeeCode || "-",
  },
  {
    key: "createdAt",
    header: "Created on",
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
]

const filters: FilterConfig[] = [
  {
    label: "Sort by",
    key: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
    ],
  },
]

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const patientsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    return `/api/admin/patients?${params.toString()}`
  }, [currentPage])

  const { data: patientsData, isLoading } = useFetch<PatientsResponse>({
    path: patientsPath,
    queryKey: ["admin-patients", currentPage],
  })

  const transformedPatients = useMemo(() => {
    if (!patientsData?.patients) return []
    return patientsData.patients.map((patient) => ({
      id: patient.id,
      user: {
        name: patient.name,
        image: patient.image,
      },
      email: patient.email,
      enterpriseCode: patient.enterpriseCode,
      employeeCode: patient.employeeCode,
      createdAt: patient.createdAt,
    }))
  }, [patientsData])

  const actions: ActionMenuItem<TablePatient>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/users/${row.id}` as never)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Users
      </h2>

      <DataTable
        data={transformedPatients}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading}
        pagination={
          patientsData?.pagination
            ? {
                currentPage: patientsData.pagination.page,
                totalPages: patientsData.pagination.totalPages,
                onPageChange: (page) => setCurrentPage(page),
              }
            : undefined
        }
      />
    </div>
  )
}
