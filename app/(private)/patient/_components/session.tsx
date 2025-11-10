"use client";
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Typography } from '../../../../components/ui/typography';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { appointments } from '@/app/data/appointment-table';

export function AppointmentsTable() {
  return (
    <div className="bg-background border rounded-md p-2 w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography variant="span" className="pl-1 text-foreground">Session History</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-[30px] w-[30px] border-muted-foreground border-1 rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem asChild>
              <Link href="/patient/session">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Specialist</TableHead>
              <TableHead className="whitespace-nowrap">Service</TableHead>
              <TableHead className="whitespace-nowrap">Session for</TableHead>
              <TableHead className="whitespace-nowrap">Session on</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((p, index) => (
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
                <TableCell className="whitespace-nowrap">{p.service}</TableCell>
                <TableCell className="whitespace-nowrap">{p.appointmentFor}</TableCell>
                <TableCell className="whitespace-nowrap">{p.createdAt}</TableCell>
                <TableCell className="whitespace-nowrap">{p.Amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}