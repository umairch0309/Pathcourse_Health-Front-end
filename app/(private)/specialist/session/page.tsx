'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, type Column, type FilterConfig, type ActionMenuItem } from '@/components/ui/data-table';
import { availableSessions, attendedSessions } from '@/app/data/specialist-sessions-table';
import { useRouter } from 'next/navigation';

type SpecialistSession = (typeof availableSessions)[0];

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
      { label: 'Name (A-Z)', value: 'name-asc' },
      { label: 'Name (Z-A)', value: 'name-desc' },
    ],
  },
];

export default function SessionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('available');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const totalPages = 5;
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const availableColumns: Column<SpecialistSession>[] = [
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
      key: 'sessionDuration',
      header: 'Session Duration',
    },
    {
      key: 'sessionLink',
      header: 'Session Link',
      render: (row) => (
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          onClick={() => {
            router.push('/specialist/session/join-session' as any);
          }}
        >
          Join Now
        </Button>
      ),
    },
  ];

  const attendedColumns: Column<SpecialistSession>[] = [
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
  ];

  const availableActions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/specialist/session/${row.id}` as any);
      },
    },
  ];

  const attendedActions: ActionMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row, index) => {
        router.push(`/specialist/session/${row.id}` as any);
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Sessions</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="space-x-4">
            <TabsTrigger className='text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="available">Available</TabsTrigger>
            <TabsTrigger className='text-foreground font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="attended">Attended</TabsTrigger>
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

        <TabsContent value="available" className="mt-0">
          <DataTable
            data={availableSessions}
            columns={availableColumns}
            filters={filters}
            actions={availableActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>

        <TabsContent value="attended" className="mt-0">
          <DataTable
            data={attendedSessions}
            columns={attendedColumns}
            filters={filters}
            actions={attendedActions}
            searchPlaceholder="Search"
            showAllButton={false}
            hideFilters={true}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
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

