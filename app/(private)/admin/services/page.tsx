'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { services } from '@/app/data/services-table';
import { EditServiceModal } from './_components/edit-service-modal';
import { DeleteServiceModal } from './_components/delete-service-modal';
import { useRouter } from 'next/navigation';

type Service = (typeof services)[0];

const columns: Column<Service>[] = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'serviceTitle',
    header: 'Service title',
  },
  {
    key: 'timeDurations',
    header: 'Time durations',
  },
  {
    key: 'addedOn',
    header: 'Added on',
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
      { label: 'Title (A-Z)', value: 'title-asc' },
      { label: 'Title (Z-A)', value: 'title-desc' },
    ],
  },
];

export default function ServicesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const totalPages = 5;
  const router = useRouter();

  const handleEdit = (row: Service) => {
    setSelectedService(row);
    setEditModalOpen(true);
  };

  const handleDelete = (row: Service) => {
    setSelectedService(row);
    setDeleteModalOpen(true);
  };

  const actions: ActionMenuItem[] = [
    {
      label: 'Edit',
      onClick: (row, index) => {
        handleEdit(row);
      },
    },
    {
      label: 'Delete',
      onClick: (row, index) => {
        handleDelete(row);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Services</h2>

      <DataTable
        data={services}
        columns={columns}
        filters={filters}
        actions={actions}
        searchPlaceholder="Search"
        showAllButton={false}
        customButton={
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/admin/services/add')}>
            Add Service
          </Button>
        }
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      {selectedService && (
        <>
          <EditServiceModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            service={selectedService}
          />
          <DeleteServiceModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            service={selectedService}
          />
        </>
      )}
    </div>
  );
}

