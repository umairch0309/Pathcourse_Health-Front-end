"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"
import { DeleteInquiryModal } from "./_components/delete-inquiry-modal"

type UserQuery = {
  id: string
  message: string
  organizationName: string
  organizationEmail: string
  name: string
  number: string
  email: string
  userId: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  } | null
}

type UserQueriesResponse = {
  userQueries: UserQuery[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type TableUserQuery = {
  id: string
  user: string
  organizationName: string
  organizationEmail: string
  message: string
  sentOn: string
  createdAt: string
}

const columns: Column<TableUserQuery>[] = [
  {
    key: "user",
    header: "Organization",
    render: (row) => row.organizationName || "-",
  },
  {
    key: "organizationEmail",
    header: "Organization Email",
    render: (row) => row.organizationEmail || "-",
  },
  {
    key: "message",
    header: "Message",
    render: (row) => (
      <div className="max-w-xs truncate" title={row.message}>
        {row.message}
      </div>
    ),
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
    type: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
    ],
  },
]

export default function UserInquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    sort: "date-newest",
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<TableUserQuery | null>(
    null
  )
  const router = useRouter()
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
          setUserRole(session.data.user.role || null)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
  }, [])

  // Get user permissions
  const { hasPermission } = useUserPermissions(userId, userRole)

  const queriesPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "10")
    return `/api/admin/user-queries?${params.toString()}`
  }, [currentPage])

  const {
    data: queriesData,
    isLoading,
    refetch,
  } = useFetch<UserQueriesResponse>({
    path: queriesPath,
    queryKey: ["admin-user-queries", currentPage],
  })

  const { onRequest: deleteQuery, isPending: isDeleting } = useApi({
    key: "delete-user-query",
    showSuccessToast: true,
    showErrorToast: true,
    method: "delete",
  })

  const transformedQueries = useMemo(() => {
    if (!queriesData?.userQueries) return []
    const rows = queriesData.userQueries.map((query) => ({
      id: query.id,
      user: query.user?.name || query.name || "-",
      organizationName: query.organizationName || "-",
      organizationEmail: query.organizationEmail || "-",
      message: query.message,
      sentOn: new Date(query.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      createdAt: query.createdAt,
    }))

    const sort = filterValues.sort
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      if (sort === "date-newest") return bTime - aTime
      if (sort === "date-oldest") return aTime - bTime
      return 0
    })
  }, [queriesData, filterValues.sort])

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDeleteClick = (row: TableUserQuery) => {
    setSelectedInquiry(row)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!selectedInquiry) return

    deleteQuery({
      path: `/api/user-queries/${selectedInquiry.id}`,
      data: {} as never,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-user-queries"] })
        refetch()
        setDeleteModalOpen(false)
        setSelectedInquiry(null)
      },
    })
  }

  // Build actions array based on permissions
  const actions: ActionMenuItem<TableUserQuery>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/admin/user-inquiries/${row.id}` as never)
      },
    },
  ]

  // Add Delete action only if user has permission
  if (hasPermission("user_inquiries.delete")) {
    actions.push({
      label: "Delete",
      onClick: (row) => {
        handleDeleteClick(row)
      },
    })
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        User Inquiries
      </h2>

      <DataTable
        data={transformedQueries}
        columns={columns}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading || isDeleting}
        pagination={
          queriesData?.pagination
            ? {
                currentPage: queriesData.pagination.page,
                totalPages: queriesData.pagination.totalPages,
                onPageChange: (page) => setCurrentPage(page),
              }
            : undefined
        }
      />

      <DeleteInquiryModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        inquiry={
          selectedInquiry
            ? {
                id: selectedInquiry.id,
                message: selectedInquiry.message,
                organizationName: selectedInquiry.organizationName,
                organizationEmail: selectedInquiry.organizationEmail,
                name: selectedInquiry.user,
                number: "",
                email: "",
                createdAt: "",
              }
            : null
        }
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
