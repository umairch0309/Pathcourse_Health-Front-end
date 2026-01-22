"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { users } from "@/app/data/users-table"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"

type User = (typeof users)[0]

const columns: Column<User>[] = [
  {
    key: "user",
    header: "User",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "serviceAvailed",
    header: "Service availed",
  },
  {
    key: "availedOn",
    header: "Availed on",
  },
]

const filters: FilterConfig[] = [
  {
    label: "By service",
    key: "service",
    options: [
      { label: "Open Ear", value: "Open ear" },
      { label: "Hearing Test", value: "Hearing Test" },
      { label: "Consultation", value: "Consultation" },
    ],
  },
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
  const totalPages = 5
  const router = useRouter()

  const actions: ActionMenuItem<User>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/users/${row.user}`)
        console.log("View Details", row)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Users
      </h2>

      <DataTable
        data={users}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  )
}
