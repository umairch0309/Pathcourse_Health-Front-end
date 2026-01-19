'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { ratings } from '@/app/data/ratings-reviews-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Rating = (typeof ratings)[0];

const columns: Column<Rating>[] = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'specialist',
    header: 'Specialist',
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
    key: 'service',
    header: 'Service',
  },
  {
    key: 'session',
    header: 'Session',
  },
  {
    key: 'rating',
    header: 'Review',
    render: (row) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-primary text-primary" />
        <span className="text-sm">{row.rating}</span>
      </div>
    ),
  },
  {
    key: 'submittedOn',
    header: 'Submitted on',
  },
];

const filters: FilterConfig[] = [
  {
    label: 'By service',
    key: 'service',
    options: [
      { label: 'Skin Care', value: 'Skin Care' },
      { label: 'Mental Appt.', value: 'Mental Appt.' },
      { label: 'Physical Appt.', value: 'Physical Appt.' },
      { label: 'Body Movement', value: 'Body Movement' },
    ],
  },
  {
    label: 'By clinic',
    key: 'clinic',
    options: [
      { label: 'Main Clinic', value: 'main' },
      { label: 'Branch Clinic', value: 'branch' },
    ],
  },
  {
    label: 'Sort by',
    key: 'sort',
    options: [
      { label: 'Date (Newest)', value: 'date-newest' },
      { label: 'Date (Oldest)', value: 'date-oldest' },
      { label: 'Rating (High to Low)', value: 'rating-high' },
      { label: 'Rating (Low to High)', value: 'rating-low' },
    ],
  },
];

export default function RatingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [selectedReview, setSelectedReview] = useState<Rating | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        setSelectedReview(row);
        setIsDialogOpen(true);
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        data={ratings}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        title="User Data"
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
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
                <span className="ml-2 text-base font-medium">
                  {selectedReview.rating.toFixed(1)} rating
                </span>
              </div>
              <div className="text-sm text-foreground leading-relaxed">
                {selectedReview.reviewText || 'No review text available.'}
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
  );
}

