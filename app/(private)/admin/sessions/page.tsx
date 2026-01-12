"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { adminSessions } from "@/app/data/admin-sessions-table"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"

type AdminSession = (typeof adminSessions)[0]

const columns: Column<AdminSession>[] = [
  {
    key: "user",
    header: "User",
  },
  {
    key: "date",
    header: "Date",
  },
  {
    key: "time",
    header: "Time",
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

export default function SessionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const router = useRouter()

  const actions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/sessions/${row.user}`)
      },
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        data={adminSessions}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        title="Sessions"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  )
}
