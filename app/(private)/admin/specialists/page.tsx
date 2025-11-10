'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { specialists } from '@/app/data/specialists-table';
import { useRouter } from 'next/navigation';

type Specialist = (typeof specialists)[0];

const columns: Column<Specialist>[] = [
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
    key: 'email',
    header: 'Email',
  },
  {
    key: 'contactNo',
    header: 'Contact no.',
  },
  {
    key: 'specialistIn',
    header: 'Specialist in',
  },
  {
    key: 'addedOn',
    header: 'Added on',
  },
];

const filters: FilterConfig[] = [
  {
    label: 'By service',
    key: 'service',
    options: [
      { label: 'Open Ear', value: 'open ear' },
      { label: 'Hearing Test', value: 'hearing test' },
      { label: 'Consultation', value: 'consultation' },
    ],
  },
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

export default function SpecialistsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('registered');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const totalPages = 5;

  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const registeredActions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/specialists/${row.id}` as any);
      },
    },
  ];

  const newRequestsActions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/admin/specialists/detail/${row.id}` as any);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Specialists</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="space-x-4">
            <TabsTrigger className='text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="registered">Registered</TabsTrigger>
            <TabsTrigger className='text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="new-requests">New Requests</TabsTrigger>
          </TabsList>
          
          {/* Filter Dropdowns */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={filterValues[filter.key] || undefined}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="w-full sm:w-[140px] data-[placeholder]:text-foreground [&_*[data-slot=select-value]]:font-semibold">
                    <SelectValue placeholder={filter.placeholder || filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="registered" className="mt-0">
          <DataTable
            data={specialists}
            columns={columns}
            filters={filters}
            actions={registeredActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            customButton={
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/admin/specialists/add')}>
                Add Specialist
              </Button>
            }
            pagination={{
              currentPage,
              totalPages,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>

        <TabsContent value="new-requests" className="mt-0">
          <DataTable
            data={specialists}
            columns={columns}
            filters={filters}
            actions={newRequestsActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            customButton={
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/admin/specialists/add')}>
                Add Specialist
              </Button>
            }
            pagination={{
              currentPage,
              totalPages,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

