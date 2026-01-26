import { InboxIcon } from "lucide-react"
/**
 * EmptyCard component displays a card with an inbox icon and "No data available" message.
 * Used to indicate when a data set or query result is empty.
 *
 * @component
 * @returns {JSX.Element} A card component with an inbox icon and message
 */
import { cn } from "@/lib/utils"

interface EmptyCardProps {
  className?: string
  message?: string
}

export default function EmptyCard({
  className,
  message = "No data available",
}: EmptyCardProps) {
  return (
    <div
      className={cn("w-full flex items-center justify-center py-12", className)}
    >
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="rounded-full bg-muted/50 p-4">
          <InboxIcon className="size-10 text-primary font-bold" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    </div>
  )
}
