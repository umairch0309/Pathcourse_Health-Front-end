'use client';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { payments } from '@/app/data/payment-dashboard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function PaymentsTable() {
  return (
    <div className="bg-background border rounded-md p-4 w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography variant="span" className="pl-1 text-foreground">Payments</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-[30px] w-[30px] border-muted-foreground border-1 rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem asChild>
              <Link href="/specialist/payments">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">User</TableHead>
              <TableHead className="whitespace-nowrap">Date invoice</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Payment status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{p.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center truncate gap-2">
                    <Image
                      src={p.doctor.image}
                      alt={p.doctor.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    {p.doctor.name}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{p.dateInvoice}</TableCell>
                <TableCell className="whitespace-nowrap">{p.amount}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {p.status === 'Paid' ? (
                    <Badge className="bg-secondary/30 text-primary">Paid</Badge>
                  ) : (
                    <Badge className='bg-red-100 text-red-700 hover:bg-red-100 border-0'>pending</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}