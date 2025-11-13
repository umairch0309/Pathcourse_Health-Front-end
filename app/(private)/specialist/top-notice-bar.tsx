'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TopNoticeBar() {
  const pathname = usePathname();
  const isOnDashboard = pathname === '/specialist' || pathname === '/specialist/';
  const router = useRouter();

  if (!isOnDashboard) return null;

  const barHeightClass = 'h-12';

  return (
    <div className={`fixed top-[60px] left-0 right-0 w-full ${barHeightClass} bg-foreground text-background z-40`}> 
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-4 xl:px-6 flex items-center justify-between w-full h-full">
        <p className="lg:text-sm text-xs">Complete your profile information for your account verification.</p>
        <Button variant="outline" className='text-foreground' onClick={() => router.push('/specialist/update-profile' as any)}>
         Update Profile
        </Button>
      </div>
    </div>
  );
}

