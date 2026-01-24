"use client"

import { useQueryClient } from "@tanstack/react-query"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
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

type NotificationGroup = {
  label: string
  notifications: Notification[]
}

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const queryClient = useQueryClient()

  const notificationsPath = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", "20")
    return `/api/notifications?${params.toString()}`
  }, [currentPage])

  const { data, isLoading, error, refetch } = useFetch<NotificationsResponse>({
    path: notificationsPath,
    queryKey: ["notifications", currentPage],
  })

  const { onRequest: markAsRead } = useApi<{ notificationId: string }>({
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

  const { onRequest: deleteNotification, isPending: isDeleting } = useApi({
    key: "delete-notification",
    showSuccessToast: true,
    showErrorToast: true,
    method: "delete",
  })

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

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead({
      path: "/api/notifications/mark-read",
      data: { notificationId },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
        queryClient.invalidateQueries({
          queryKey: ["notifications-unread-count"],
        })
        refetch()
      },
    })
  }

  const handleDelete = (notificationId: string) => {
    deleteNotification({
      path: `/api/notifications/${notificationId}`,
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
      handleMarkAsRead(notification.id)
    }
    if (notification.url) {
      router.push(notification.url as never)
    }
  }

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    if (!data?.notifications) return []

    const groups: NotificationGroup[] = []
    const today: Notification[] = []
    const yesterday: Notification[] = []
    const older: Notification[] = []

    data.notifications.forEach((notification) => {
      const date = parseISO(notification.createdAt)
      if (isToday(date)) {
        today.push(notification)
      } else if (isYesterday(date)) {
        yesterday.push(notification)
      } else {
        older.push(notification)
      }
    })

    if (today.length > 0) {
      groups.push({ label: "Today", notifications: today })
    }
    if (yesterday.length > 0) {
      groups.push({ label: "Yesterday", notifications: yesterday })
    }
    if (older.length > 0) {
      // Group older notifications by date
      const olderByDate = older.reduce(
        (acc, notification) => {
          const date = parseISO(notification.createdAt)
          const dateKey = format(date, "MMMM d, yyyy")
          if (!acc[dateKey]) {
            acc[dateKey] = []
          }
          acc[dateKey].push(notification)
          return acc
        },
        {} as Record<string, Notification[]>
      )

      Object.entries(olderByDate).forEach(([dateKey, notifications]) => {
        groups.push({ label: dateKey, notifications })
      })
    }

    return groups
  }, [data?.notifications])

  const NotificationItem = ({
    notification,
  }: {
    notification: Notification
  }) => {
    const { icon: Icon, className: iconClassName } = getNotificationIcon(
      notification.title
    )
    return (
      <div
        className={`flex items-start gap-4 py-4 border-b border-border last:border-b-0 ${
          !notification.isRead ? "bg-accent/30" : ""
        }`}
      >
        <div className="flex-shrink-0 mt-2">
          <div className={`p-2 rounded-full bg-accent ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <button
          type="button"
          className="flex-1 lg:mt-3 cursor-pointer text-left"
          onClick={() => handleNotificationClick(notification)}
        >
          <Typography
            variant="span"
            className={`text-foreground ${!notification.isRead ? "font-semibold" : ""}`}
          >
            {notification.message}
          </Typography>
          <div className="text-sm text-muted-foreground mt-1">
            {format(parseISO(notification.createdAt), "h:mm a")}
          </div>
        </button>
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(notification.id)
            }}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h5" className="p-1 text-foreground font-bold">
          Notifications
        </Typography>
        {data && data.unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="link"
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {error ? (
        <ErrorCard error={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <Loader size="sm" />
          </div>
        </div>
      ) : groupedNotifications.length === 0 ? (
        <div className="bg-background rounded-lg shadow-sm p-6">
          <EmptyCard message="No notifications found" />
        </div>
      ) : (
        <div className="bg-background rounded-lg shadow-sm">
          {groupedNotifications.map((group, groupIndex) => (
            <div
              key={group.label}
              className={groupIndex > 0 ? "p-6 border-t border-border" : "p-6"}
            >
              <Typography
                variant="h6"
                className="text-foreground font-bold mb-4"
              >
                {group.label}
              </Typography>
              <div>
                {group.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            </div>
          ))}

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <Typography variant="p" className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(data.pagination.totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
