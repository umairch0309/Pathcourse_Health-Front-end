'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { userInquiries } from '@/app/data/user-inquiries-table';
import { useRouter } from 'next/navigation';

type UserInquiry = (typeof userInquiries)[0];

const columns: Column<UserInquiry>[] = [
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
    key: 'contactNo',
    header: 'Contact no.',
  },
  {
    key: 'message',
    header: 'Message',
  },
  {
    key: 'sentOn',
    header: 'Sent on',
  },
];

const filters: FilterConfig[] = [
  {
    label: 'Sort by',
    key: 'sort',
    options: [
      { label: 'Date (Newest)', value: 'date-newest' },
      { label: 'Date (Oldest)', value: 'date-oldest' },
      { label: 'Name (A-Z)', value: 'name-asc' },
      { label: 'Name (Z-A)', value: 'name-desc' },
    ],
  },
];

export default function UserInquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter()

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/user-inquiries/${row.id}`)
        console.log('View Details', row, index);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">User Inquiries</h2>

      <DataTable
        data={userInquiries}
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

