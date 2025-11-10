/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import type { Notification } from '@/app/data/patient-notification-dropdown';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { notification } from '@/app/data/patient-notification-dropdown';

export default function NotificationsDropdown({ className = '' }: { className?: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notification);

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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative cursor-pointer" onClick={() => setDropdownOpen(prev => !prev)}>
        <Bell className="w-6 h-6 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between p-4">
            <Typography variant="h5" className="text-foreground font-semibold">Notifications</Typography>
            <Button onClick={markAllAsRead} variant="link">
              Mark all as read
            </Button>
          </div>

          <div className="max-h-96 p-2 space-y-4 overflow-y-auto">
            {notifications.slice(0, 4).map(notification => (
              <div key={notification.id} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Image src={notification.icon} alt="icon" width={40} height={40} className="rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 text-center">
            <Link href={"/patient/notification" as any} onClick={() => setDropdownOpen(false)} className="text-primary">
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}