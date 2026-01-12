"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { transactions } from "@/app/data/transactions-table"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"

type Transaction = (typeof transactions)[0]

const columns: Column<Transaction>[] = [
  {
    key: "specialist",
    header: "Specialist",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.specialist.image}
          alt={row.specialist.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{row.specialist.name}</span>
      </div>
    ),
  },
  {
    key: "user",
    header: "Users",
  },
  {
    key: "sessionDate",
    header: "Session Date",
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

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const router = useRouter()

  const actions: ActionMenuItem[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/transactions/${row.user}`)
        console.log("View Details", row)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Transactions
      </h2>

      <DataTable
        data={transactions}
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
