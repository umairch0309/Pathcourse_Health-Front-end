'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { transactions } from '@/app/data/transactions-table';
import { useRouter } from 'next/navigation';

type Transaction = (typeof transactions)[0];

const columns: Column<Transaction>[] = [
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
    key: 'user',
    header: 'Users',
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
    key: 'amountPaid',
    header: 'Amount paid',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      let badgeClass = '';
      switch (row.status) {
        case 'Paid':
          badgeClass = 'bg-green-100 text-green-700 hover:bg-green-100 border-0';
          break;
        case 'Pending':
          badgeClass = 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0';
          break;
        case 'Cancelled':
          badgeClass = 'bg-red-100 text-red-700 hover:bg-red-100 border-0';
          break;
        default:
          break;
      }
      return (
        <Badge className={badgeClass}>
          {row.status}
        </Badge>
      );
    },
  },
  {
    key: 'paidOn',
    header: 'Paid on',
  },
];

const filters: FilterConfig[] = [
  {
    label: 'By status',
    key: 'status',
    options: [
      { label: 'Paid', value: 'Paid' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Cancelled', value: 'Cancelled' },
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
      { label: 'Amount (Low to High)', value: 'amount-low' },
      { label: 'Amount (High to Low)', value: 'amount-high' },
    ],
  },
];

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/transactions/${row.id}`);
        console.log('View Details', row, index);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Transactions</h2>

      <DataTable
        data={transactions}
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

