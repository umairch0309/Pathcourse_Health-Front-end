'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { users } from '@/app/data/users-table';
import { useRouter } from 'next/navigation';

type User = (typeof users)[0];

const columns: Column<User>[] = [
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
    key: 'email',
    header: 'Email',
  },
  {
    key: 'serviceAvailed',
    header: 'Service availed',
  },
  {
    key: 'amountPaid',
    header: 'Amount paid',
  },
  {
    key: 'availedOn',
    header: 'Availed on',
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
    label: 'Sort by',
    key: 'sort',
    options: [
      { label: 'Date (Newest)', value: 'date-newest' },
      { label: 'Date (Oldest)', value: 'date-oldest' },
      { label: 'Amount (Low to High)', value: 'amount-low' },
      { label: 'Amount (High to Low)', value: 'amount-high' },
      { label: 'Name (A-Z)', value: 'name-asc' },
      { label: 'Name (Z-A)', value: 'name-desc' },
    ],
  },
];

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/users/${row.id}`);
        console.log('View Details', row, index);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Users</h2>

      <DataTable
        data={users}
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
  );
}

