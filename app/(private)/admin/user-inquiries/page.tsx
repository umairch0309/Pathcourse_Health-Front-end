'use client';

import { useState, useMemo } from 'react';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { DeleteInquiryModal } from './_components/delete-inquiry-modal';
import useApi from '@/hooks/use-api';

type UserQuery = {
  id: string;
  message: string;
  name: string;
  number: string;
  email: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type UserQueryResponse = {
  userQueries: UserQuery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type TableUserQuery = {
  id: string;
  name: string;
  email: string;
  number: string;
  message: string;
  sentOn: string;
  originalData: UserQuery;
};

const columns: Column<TableUserQuery>[] = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'number',
    header: 'Contact no.',
  },
  {
    key: 'message',
    header: 'Message',
    render: (row) => (
      <span className="max-w-[200px] truncate block" title={row.message}>
        {row.message}
      </span>
    ),
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<UserQuery | null>(null);
  const router = useRouter();

  const { data, isLoading, error, refetch } = useFetch<UserQueryResponse>({
    path: `/api/user-queries?page=${currentPage}&limit=10`,
    queryKey: ['user-queries', currentPage],
  });

  const { onRequest: onDeleteRequest, isPending: isDeleting } = useApi<{ id: string }>({
    key: 'delete-user-query',
    method: 'delete',
  });

  const tableData: TableUserQuery[] = useMemo(() => {
    if (!data?.userQueries) return [];
    return data.userQueries.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      number: item.number,
      message: item.message,
      sentOn: format(new Date(item.createdAt), 'MMM dd, yyyy'),
      originalData: item,
    }));
  }, [data]);

  const handleDelete = (row: TableUserQuery) => {
    setSelectedInquiry(row.originalData);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedInquiry) return;
    
    onDeleteRequest({
      path: `/api/user-queries/${selectedInquiry.id}`,
      data: {} as any, // Delete requests don't need body data
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedInquiry(null);
        refetch();
      },
    });
  };

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/user-inquiries/${(row as TableUserQuery).id}`);
      },
    },
    {
      label: 'Delete',
      onClick: (row, index) => {
        handleDelete(row as TableUserQuery);
      },
    },
  ];

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="w-full">
      <DataTable
        data={tableData}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          refetch();
        }}
        title="User Inquiries"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      {selectedInquiry && (
        <DeleteInquiryModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          inquiry={selectedInquiry}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

