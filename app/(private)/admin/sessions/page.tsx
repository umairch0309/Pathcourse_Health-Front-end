'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { adminSessions } from '@/app/data/admin-sessions-table';

type AdminSession = (typeof adminSessions)[0];

const columns: Column<AdminSession>[] = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'user',
    header: 'User',
    render: (row) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.user.image}
          alt={row.user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{row.user.name}</span>
      </div>
    ),
  },
  {
    key: 'sessionFor',
    header: 'Session for',
  },
  {
    key: 'dateTime',
    header: 'Date & time',
  },
  {
    key: 'location',
    header: 'Location',
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
      if (row.paymentStatus === 'Pending') {
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">
            Pending
          </Badge>
        );
      }
      return <span>{row.paymentStatus}</span>;
    },
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
      { label: 'Status', value: 'status' },
    ],
  },
];

export default function SessionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/sessions/${row.id}` as any);
      },
    },
  ];

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
  );
}

