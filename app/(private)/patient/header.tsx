'use client';

import { LogOut, Search, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotificationsDropdown from '@/app/(private)/patient/notification-dropdown';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center px-4 py-2 bg-background border-b shadow-sm h-[60px] shrink-0 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden text-foreground" />
        {' '}
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-cover" />
        </Link>
      </div>
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <Search className="w-6 h-6 text-foreground cursor-pointer" />
        <NotificationsDropdown />

        <div className="relative">
          <User className="w-6 h-6 text-foreground cursor-pointer" onClick={() => setDropdownOpen(prev => !prev)} />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow-md z-50">
              <Button variant="secondary" className="w-full flex items-center gap-2" onClick={() => router.push('/auth/login')}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}