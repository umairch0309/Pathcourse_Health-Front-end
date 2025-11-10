/* eslint-disable react/no-nested-component-definitions */

'use client';

import type { Notification } from '@/app/data/patient-notification-dropdown';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { notification } from '@/app/data/patient-notification-dropdown';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<{
    today: Notification[];
    yesterday: Notification[];
  }>({
    today: notification.slice(0, 4),
    yesterday: notification.slice(4, 8),
  });

  const markAllAsRead = () => {
    setNotifications(prev => ({
      today: prev.today.map(n => ({ ...n, isRead: true })),
      yesterday: prev.yesterday.map(n => ({ ...n, isRead: true })),
    }));
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className="flex items-start gap-4 py-4">
      {/* Icon */}
      <div className="">
        <Image
          src={notification.icon}
          alt="Notification icon"
          className=" rounded-full"
          width={40}
          height={40}
        />
      </div>

      <div className="flex-1 lg:mt-3">
        <Typography variant="span" className="text-foreground">{notification.message}</Typography>
      </div>
      <div className="text-sm text-muted-foreground">{notification.timestamp}</div>
    </div>
  );

  return (
    <div className="">
      <Typography variant="h5" className="p-1 text-foreground font-bold">Notifications</Typography>

      <div className="bg-background rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-foreground font-bold">Today's</Typography>
            <Button onClick={markAllAsRead} variant="link">
              Mark all as read
            </Button>
          </div>

          <div className="divide-y divide-muted">
            {notifications.today.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-muted">
          <Typography variant="h6" className="text-foreground font-bold">Yesterday</Typography>
          <div className="divide-y divide-muted">
            {notifications.yesterday.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}