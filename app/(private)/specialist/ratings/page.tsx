"use client"

import { Star } from "lucide-react"
import { useState } from "react"
import { specialistRatings } from "@/app/data/specialist-ratings-table"
import { Button } from "@/components/ui/button"
import {
  type ActionMenuItem,
  type Column,
  DataTable,
  type FilterConfig,
} from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SpecialistRating = (typeof specialistRatings)[0]

const columns: Column<SpecialistRating>[] = [
  {
    key: "user",
    header: "User",
  },
  {
    key: "sessionReason",
    header: "Session Reason",
  },
  {
    key: "submittedOn",
    header: "Submitted on",
  },
]

const filters: FilterConfig[] = [
  {
    label: "By rating",
    key: "rating",
    options: [
      { label: "5 Stars", value: "5" },
      { label: "4 Stars", value: "4" },
      { label: "3 Stars", value: "3" },
      { label: "2 Stars", value: "2" },
      { label: "1 Star", value: "1" },
    ],
  },
  {
    label: "Sort by",
    key: "sort",
    options: [
      { label: "Date (Newest)", value: "date-newest" },
      { label: "Date (Oldest)", value: "date-oldest" },
      { label: "Rating (High to Low)", value: "rating-high" },
      { label: "Rating (Low to High)", value: "rating-low" },
    ],
  },
]

export default function RatingsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  const [selectedReview, setSelectedReview] = useState<SpecialistRating | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const actions: ActionMenuItem<SpecialistRating>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        setSelectedReview(row)
        setIsDialogOpen(true)
      },
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        User Data
      </h2>

      <DataTable
        data={specialistRatings}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-left">Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`star-${selectedReview.user}-${i}`}
                    className="h-5 w-5 fill-blue-600 text-blue-600"
                  />
                ))}
                <span className="ml-2 text-base font-medium">
                  {selectedReview.rating.toFixed(1)} rating
                </span>
              </div>
              <div className="text-sm text-foreground leading-relaxed">
                {selectedReview.reviewText || "No review text available."}
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
