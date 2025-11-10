'use client';

import { Typography } from '@/components/ui/typography';
import { DetailsTabs } from './_components/tabs';

export default function SessionDetailsPage() {
  return (
    <main className="space-y-4 w-full">
      <Typography variant="h5" className='font-bold text-foreground'>Session Details</Typography>

      <DetailsTabs />
    </main>
  );
}

