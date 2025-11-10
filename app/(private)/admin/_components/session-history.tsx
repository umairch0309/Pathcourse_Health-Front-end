'use client';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { sessionHistory } from '@/app/data/session-history-dashboard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SessionHistoryTable() {
  return (
    <div className="bg-background border rounded-md p-4 w-full shadow-md">
      <div className="flex items-center justify-between p-2">
        <Typography variant="span" className="pl-1 text-foreground">Session history</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-[30px] w-[30px] border-muted-foreground border-1 rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem asChild>
              <Link href="/admin/sessions">View all</Link>
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
              <TableHead className="whitespace-nowrap">User</TableHead>
              <TableHead className="whitespace-nowrap">Service</TableHead>
              <TableHead className="whitespace-nowrap">Registered on</TableHead>
              <TableHead className="whitespace-nowrap">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionHistory.map((session, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{session.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center truncate gap-2">
                    <Image
                      src={session.specialist.image}
                      alt={session.specialist.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    {session.specialist.name}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center truncate gap-2">
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    {session.user.name}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{session.service}</TableCell>
                <TableCell className="whitespace-nowrap">{session.registeredOn}</TableCell>
                <TableCell className="whitespace-nowrap">{session.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

