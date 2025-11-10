'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  accessor?: (row: T) => string | number | React.ReactNode;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  label: string;
  key: string;
  options: FilterOption[];
  placeholder?: string;
};

export type ActionMenuItem = {
  label: string;
  onClick: (row: any, index: number) => void;
  icon?: React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  filters?: FilterConfig[];
  actions?: ActionMenuItem[];
  searchPlaceholder?: string;
  showAllButton?: boolean;
  allButtonLabel?: string;
  onAllClick?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
  renderCell?: (column: Column<T>, row: T, index: number) => React.ReactNode;
  title?: string;
  customButton?: React.ReactNode;
  hideFilters?: boolean;
  onFilterChange?: (key: string, value: string) => void;
  filterValues?: Record<string, string>;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  actions = [],
  searchPlaceholder = 'Search',
  showAllButton = true,
  allButtonLabel = 'All',
  onAllClick,
  pagination,
  className,
  renderCell,
  title,
  customButton,
  hideFilters = false,
  onFilterChange,
  filterValues: externalFilterValues,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalFilterValues, setInternalFilterValues] = useState<Record<string, string>>({});
  
  const filterValues = externalFilterValues ?? internalFilterValues;

  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    } else {
      setInternalFilterValues((prev) => ({ ...prev, [key]: value }));
    }
  };

  const filteredData = data.filter((row) => {
    // Search filter
    if (searchQuery) {
      const searchableText = columns
        .map((col) => {
          if (col.accessor) {
            const value = col.accessor(row);
            return String(value).toLowerCase();
          }
          return String(row[col.key] || '').toLowerCase();
        })
        .join(' ');
      if (!searchableText.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    // Custom filters
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value !== 'all') {
        const rowValue = String(row[key] || '').toLowerCase();
        if (!rowValue.includes(value.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  });

  const renderCellContent = (column: Column<T>, row: T, index: number) => {
    if (renderCell) {
      return renderCell(column, row, index);
    }

    if (column.render) {
      return column.render(row, index);
    }

    if (column.accessor) {
      return column.accessor(row);
    }

    return row[column.key];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Title */}
      {title && (
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">{title}</h2>
      )}
      {/* Top Filters Section */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">

        {/* Filters and All Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* All Button */}
          {showAllButton && (
            <Button
              onClick={onAllClick}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {allButtonLabel}
            </Button>
          )}

          {/* Filter Dropdowns */}
          {!hideFilters && filters.length > 0 && (
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-background shadow-md rounded-lg border p-2 sm:p-4 -mx-2 sm:mx-0">
        {!customButton && (
          <div className="relative w-full sm:w-auto mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[300px] md:w-[350px] border border-border rounded-md"
            />
          </div>
        )}
         {/* Search and Custom Button Row */}
         {customButton && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-[300px] md:w-[350px] border border-border rounded-md"
              />
            </div>
            <div className="flex-shrink-0">
              {customButton}
            </div>
          </div>
        )}
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap text-xxs lg:text-sm">
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center text-muted-foreground py-8 text-sm"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="truncate whitespace-nowrap text-xxs lg:text-sm">
                      {renderCellContent(column, row, index)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="sticky right-0 bg-background">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row, index)}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 mt-4 sm:mt-6 overflow-x-auto pb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-transparent shrink-0"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={pagination.currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => pagination.onPageChange(page)}
                  className={cn(
                    'h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-transparent shrink-0 text-xs sm:text-sm',
                    pagination.currentPage === page &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-transparent shrink-0"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  );
}

