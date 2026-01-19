"use client"

import { MoreVertical, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { reviews } from "@/app/data/review-dashboard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Reviews() {
  return (
    <Card className=" w-full lg:h-[350px] bg-background px-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base font-medium">
            User Data
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-[30px] w-[30px] border-muted-foreground border-1 rounded-full"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem asChild>
                <Link href="/specialist/user-data">View all</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col space-y-2 overflow-y-auto">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="flex gap-3 border-b-1 border-muted-foreground p-2 space-y-1"
          >
            <div className="w-12 flex-shrink-0">
              <Image
                src={review.avatar}
                alt={review.name}
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>

            <div className="text-sm flex-1 min-w-0">
              <p className="text-foreground font-medium">{review.name}</p>
              <p className="text-muted-foreground text-sm">{review.message}</p>
              <div className="flex items-center gap-1 mt-1 text-primary text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={`star-${review.name}-${i}`}
                    className="w-4 h-4 fill-primary"
                  />
                ))}
                <span className="text-muted-foreground text-xs ml-1 whitespace-nowrap">
                  {review.rating.toFixed(1)} rating
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  )
}
