"use client"

import { MoreVertical } from "lucide-react"
import Link from "next/link"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFetch } from "@/hooks/use-fetch"

type UserQuery = {
  id: string
  message: string
  organizationName: string
  organizationEmail: string
  name: string
  number: string
  email: string
  userId: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  } | null
}

type LastUserQueriesResponse = {
  userQueries: UserQuery[]
}

export function Inquiries() {
  const { data, isLoading, error, refetch } = useFetch<LastUserQueriesResponse>(
    {
      path: "/api/admin/dashboard/last-user-queries?limit=5",
      queryKey: ["admin-last-user-queries"],
    }
  )

  const queries = data?.userQueries || []

  return (
    <Card className="lg:h-[350px] p-0 w-full bg-background">
      <CardHeader className="pb-3 p-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-sm font-medium">
            Inquiries
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem asChild>
                <Link href="/admin/user-inquiries">View all</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0 px-4">
        {error ? (
          <div className="py-4">
            <ErrorCard error={error} onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="sm" />
          </div>
        ) : queries.length === 0 ? (
          <div className="py-4">
            <EmptyCard message="No inquiries found yet." />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[280px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {queries.map((query) => {
              const displayName =
                query.organizationName || query.name || "Unknown"

              return (
                <div
                  key={query.id}
                  className="flex gap-3 py-3 border-b border-border last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium mb-1">
                      {displayName}
                    </div>
                    <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                      {query.message}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
