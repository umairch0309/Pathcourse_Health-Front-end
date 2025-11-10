'use client';

import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { reviews } from '@/app/data/admin-inquiries';

export function Inquiries() {
  return (
    <Card className="lg:h-[350px] p-0 w-full bg-background">
      <CardHeader className="pb-3 p-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-sm font-medium">
            Inquiries
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem asChild>
                <Link href={"/admin/inquiries" as any}>View all</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0 px-4">
        <div className="overflow-y-auto max-h-[280px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {reviews.map((review, index) => (
            <div key={index} className="flex gap-3 py-3 border-b border-border last:border-b-0">
              <div className="flex-shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm font-medium mb-1">{review.name}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">
                  {review.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}