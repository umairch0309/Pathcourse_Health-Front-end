'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { specialistPayments } from '@/app/data/specialist-payments-table';
import { useRouter } from 'next/navigation';

type SpecialistPayment = (typeof specialistPayments)[0];

const columns: Column<SpecialistPayment>[] = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'receivedFrom',
    header: 'Received from',
    render: (row) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.receivedFrom.image}
          alt={row.receivedFrom.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{row.receivedFrom.name}</span>
      </div>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
  },
  {
    key: 'sessionFor',
    header: 'Session for',
  },
  {
    key: 'receivedOn',
    header: 'Received on',
  },
];

const filters: FilterConfig[] = [
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
      { label: 'Amount (Low to High)', value: 'amount-low' },
      { label: 'Amount (High to Low)', value: 'amount-high' },
    ],
  },
];

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/specialist/payments/${row.id}` as any);
        console.log('View Details', row, index);
      },
    },
  ];

  return (
    <div className="w-full">

      <DataTable
        data={specialistPayments}
        columns={columns}
        filters={filters}
        actions={actions}
        title='Payments'
        searchPlaceholder="Search"
        showAllButton={false}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
}

