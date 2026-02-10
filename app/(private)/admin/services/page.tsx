"use client"

import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import { useFetch } from "@/hooks/use-fetch"
import { ViewServiceDetailsModal } from "./_components/view-service-details-modal"

type ServicePricing = {
  id: string
  serviceId: string
  service: {
    id: string
    name: string
  }
  duration: number
  userPrice: number
  doctorAmount: number
  platformAmount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type ServicePricingResponse = {
  pricing: ServicePricing[]
}

type TableService = {
  serviceId: string
  serviceTitle: string
  timeDurations: number // This will be the count of durations
  addedOn: string
  allPricingData: ServicePricing[] // Store all pricing entries for this service
}

const columns: Column<TableService>[] = [
  {
    key: "serviceTitle",
    header: "Service title",
  },
  {
    key: "timeDurations",
    header: "Time durations",
    render: (row) =>
      `${row.timeDurations} ${row.timeDurations === 1 ? "duration" : "durations"}`,
  },
  {
    key: "addedOn",
    header: "Added on",
  },
]

export default function ServicesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<
    ServicePricing[] | null
  >(null)
  const router = useRouter()

  const { data, isLoading, error } = useFetch<ServicePricingResponse>({
    path: "/api/service-pricing",
    queryKey: ["service-pricing"],
  })

  const tableData: TableService[] = useMemo(() => {
    if (!data?.pricing) return []

    // Group by serviceId
    const groupedByService = data.pricing.reduce(
      (acc, item) => {
        const serviceId = item.serviceId
        if (!acc[serviceId]) {
          acc[serviceId] = {
            serviceId: item.serviceId,
            serviceTitle: item.service.name,
            timeDurations: 0,
            addedOn: format(new Date(item.createdAt), "MMM dd, yyyy"),
            allPricingData: [],
          }
        }
        acc[serviceId].allPricingData.push(item)
        acc[serviceId].timeDurations = acc[serviceId].allPricingData.length
        return acc
      },
      {} as Record<string, TableService>
    )

    return Object.values(groupedByService)
  }, [data])

  const handleViewDetails = (row: TableService) => {
    setSelectedService(row.allPricingData)
    setViewModalOpen(true)
  }

  const actions: ActionMenuItem<TableService>[] = [
    {
      label: "View Details",
      onClick: (row, index) => {
        handleViewDetails(row)
      },
    },
  ]

  const totalPages = 5

  return (
    <div className="w-full">
      <DataTable
        data={tableData}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          // Refetch data
          window.location.reload()
        }}
        title="Services"
      />

      {selectedService && (
        <ViewServiceDetailsModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          service={selectedService}
        />
      )}
    </div>
  )
}
