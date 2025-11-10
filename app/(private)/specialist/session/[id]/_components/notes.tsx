'use client';

import { useState } from 'react';
import { DataTable, type Column, type ActionMenuItem } from '@/components/ui/data-table';
import { specialistNotes } from '@/app/data/specialist-notes-table';
import { useRouter } from 'next/navigation';

type SpecialistNote = (typeof specialistNotes)[0];

const columns: Column<SpecialistNote>[] = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'sessionService',
    header: 'Session service',
  },
  {
    key: 'sessionFor',
    header: 'Session for',
  },
  {
    key: 'sessionDate',
    header: 'Session date',
  },
];

export default function Notes() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const router = useRouter();

  const actions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/specialist/session/${row.id}` as any);
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        data={specialistNotes}
        columns={columns}
        actions={actions}
        showAllButton={false}
        hideFilters={true}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
}

