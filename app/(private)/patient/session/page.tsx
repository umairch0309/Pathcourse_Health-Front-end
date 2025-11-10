'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { sessions } from '@/app/data/sessions-table';

type Session = (typeof sessions)[0];

const columns: Column<Session>[] = [
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
    key: 'dateTime',
    header: 'Date & time',
  },
  {
    key: 'paymentStatus',
    header: 'Payment status',
    render: (row) => {
      if (row.paymentStatus === 'Paid') {
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            Paid
          </Badge>
        );
      }
      if (row.paymentStatus === 'Cancelled') {
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            Cancelled
          </Badge>
        );
      }
      return (
        <Button variant="outline" size="sm" className="rounded-md bg-white text-black hover:bg-gray-100 border border-border">
          Pay Now
        </Button>
      );
    },
  },
];

const filters: FilterConfig[] = [
  {
    label: 'By service',
    key: 'service',
    options: [
      { label: 'Open Ear', value: 'Open ear' },
      { label: 'Hearing Test', value: 'Hearing Test' },
      { label: 'Consultation', value: 'Consultation' },
    ],
  },
  {
    label: 'By price',
    key: 'price',
    options: [
      { label: '$0 - $25', value: '0-25' },
      { label: '$25 - $50', value: '25-50' },
      { label: '$50+', value: '50+' },
    ],
  },
  {
    label: 'Sort by',
    key: 'sort',
    options: [
      { label: 'Date (Newest)', value: 'date-newest' },
      { label: 'Date (Oldest)', value: 'date-oldest' },
      { label: 'Price (Low to High)', value: 'price-low' },
      { label: 'Price (High to Low)', value: 'price-high' },
    ],
  },
];

export default function SessionsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/patient/session/${row.id}`);
      },
    },
    {
      label: 'View Prescription',
      onClick: (row, index) => {
        console.log('View Prescription', row, index);
      },
    },
    {
      label: 'Submit Review',
      onClick: (row, index) => {
        console.log('Submit Review', row, index);
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        data={sessions}
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
  );
}

