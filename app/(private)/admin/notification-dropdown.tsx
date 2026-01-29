"use client"

import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import EmptyCard from "@/components/empty-card"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { getNotificationIcon } from "@/lib/notification-icons"

type Notification = {
  id: string
  userId: string
  title: string
  url: string | null
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

type NotificationsResponse = {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  unreadCount: number
}

type UnreadCountResponse = {
  unreadCount: number
}

export default function NotificationsDropdown({
  className = "",
  userId,
  userRole,
}: {
  className?: string
  userId: string
  userRole?: string | null
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch unread count for badge
  const { data: unreadCountData } = useFetch<UnreadCountResponse>({
    path: "/api/notifications/unread-count",
    queryKey: ["notifications-unread-count"],
    config: {
      refetchInterval: 30000, // Poll every 30 seconds
    },
  })

  // Fetch recent notifications when dropdown opens
  const { data, isLoading, refetch } = useFetch<NotificationsResponse>({
    path: "/api/notifications?page=1&limit=5",
    queryKey: ["notifications-dropdown"],
    config: {
      enabled: dropdownOpen,
    },
  })

  const { onRequest: markAsRead } = useApi<{
    notificationId: string
  }>({
    key: "mark-notification-read",
    showSuccessToast: false,
    showErrorToast: true,
    method: "post",
  })

  const { onRequest: markAllAsRead, isPending: isMarkingAllRead } = useApi<
    Record<string, never>
  >({
    key: "mark-all-notifications-read",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkAllAsRead = () => {
    markAllAsRead({
      path: "/api/notifications/mark-all-read",
      data: {} as never,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
        queryClient.invalidateQueries({
          queryKey: ["notifications-unread-count"],
        })
        refetch()
      },
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead({
        path: "/api/notifications/mark-read",
        data: { notificationId: notification.id },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
          queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
          })
          refetch()
        },
      })
    }
    if (notification.url) {
      window.location.href = notification.url
    }
    setDropdownOpen(false)
  }

  const unreadCount = unreadCountData?.unreadCount ?? 0
  const notifications = data?.notifications || []

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="relative cursor-pointer"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <Bell className="w-6 h-6 mt-1 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background rounded-xl shadow-lg z-50 border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Typography variant="h5" className="text-foreground font-semibold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="link"
                disabled={isMarkingAllRead}
                className="h-auto p-0"
              >
                {isMarkingAllRead ? "Marking..." : "Mark all as read"}
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size="sm" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4">
                <EmptyCard message="No notifications" />
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => {
                  const { icon: Icon, className: iconClassName } =
                    getNotificationIcon(notification.title)
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      className={`w-full flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors text-left ${
                        !notification.isRead ? "bg-accent/50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`p-2 rounded-full bg-accent ${iconClassName}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !notification.isRead ? "font-semibold" : ""
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 text-center border-t border-border">
              <Link
                href="/admin/notifications"
                onClick={() => setDropdownOpen(false)}
                className="text-primary hover:underline text-sm font-medium"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
