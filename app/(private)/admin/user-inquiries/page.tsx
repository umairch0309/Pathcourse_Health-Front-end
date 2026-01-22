"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { userInquiries } from "@/app/data/user-inquiries-table"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"

type UserInquiry = (typeof userInquiries)[0]

const columns: Column<UserInquiry>[] = [
  {
    key: "user",
    header: "User",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "message",
    header: "Message",
  },
  {
    key: "sentOn",
    header: "Sent on",
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

export default function UserInquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const router = useRouter()

  const actions: ActionMenuItem<UserInquiry>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/user-inquiries/${row.user}`)
        console.log("View Details", row)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        User Inquiries
      </h2>

      <DataTable
        data={userInquiries}
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
