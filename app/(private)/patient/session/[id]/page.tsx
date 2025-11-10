import { Typography } from '@/components/ui/typography';
import { DetailsTabs } from './_components/tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session Details - Path Course Health',
  description: 'View your session details, medical information, and manage your healthcare sessions at Path Course Health.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  return (
    <main className="space-y-4 w-full">
      <Typography variant="h5" className='font-bold text-foreground'>Session Details</Typography>

      <DetailsTabs />
    </main>
  );
}