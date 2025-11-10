'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { payments } from '@/app/data/payment-history-table';
import { useRouter } from 'next/navigation';

type Payment = (typeof payments)[0];

const columns: Column<Payment>[] = [
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
    key: 'amount',
    header: 'Amount',
  },
  {
    key: 'dateInvoice',
    header: 'Date invoice',
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
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
          Unpaid
        </Badge>
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
      { label: 'Price (Low to High)', value: 'price-low' },
      { label: 'Price (High to Low)', value: 'price-high' },
    ],
  },
];

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'Pay Now',
      onClick: (row, index) => {
        if (row.paymentStatus === 'Unpaid') {
          console.log('Pay Now', row, index);
        }
      },
    },
    {
      label: 'View Invoice',
      onClick: (row, index) => {
        router.push(`/patient/payments/${row.id}`);
        console.log('View Invoice', row, index);
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        data={payments}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        title="Payment History"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
}

