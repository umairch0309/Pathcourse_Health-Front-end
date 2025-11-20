import axios from "axios"
import { AlertCircle, RefreshCcw } from "lucide-react"
/**
 * ErrorCard component displays error messages with appropriate actions based on the error type.
 * Handles different error scenarios including unauthorized access, network errors, and general errors.
 *
 * @component
 * @param {object} props - Component props
 * @param {unknown} props.error - The error object to be handled
 * @param {boolean} [props.isLoading] - Optional flag indicating if a retry action is in progress
 * @param {() => void} [props.onRetry] - Optional callback function to retry the failed action
 * @returns {JSX.Element} A card component displaying the error message and appropriate action buttons
 */
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ErrorCard({
  error,
  onRetry,
  isLoading,
}: {
  error: unknown
  isLoading?: boolean
  onRetry?: () => void
}) {
  async function onLogout() {
    // Add Logout logic here
  }

  /**
   * Checks if the error is an unauthorized (401) error
   * @param {unknown} err - The error to check
   * @returns {boolean} True if the error is an unauthorized error
   */
  const isUnauthorized = useCallback((err: unknown): boolean => {
    if (axios.isAxiosError(err)) {
      return err.response?.status === 401
    }

    return false
  }, [])

  /**
   * Checks if the error is a network connectivity error
   * @param {unknown} err - The error to check
   * @returns {boolean} True if the error is a network error
   */
  const isNetworkError = useCallback((err: unknown): boolean => {
    if (axios.isAxiosError(err)) {
      return !err.response && err.code === "ERR_NETWORK"
    }

    return false
  }, [])

  /**
   * Extracts a user-friendly error message from the error object
   * @param {unknown} err - The error to process
   * @returns {string} A user-friendly error message
   */
  const getErrorMessage = useCallback((err: unknown): string => {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.message) {
        return err.response.data.message
      }
      // Otherwise a generic server error

      return "An error occurred while communicating with the server."
    }
    if (err instanceof Error) {
      return err.message
    }
    // Fallback

    return "An unexpected error occurred."
  }, [])

  const [message] = useState<string>(getErrorMessage(error))

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="size-10 text-destructive font-bold" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Something went wrong</h3>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
        
        {/* Show different buttons depending on the error */}
        {isUnauthorized(error) ? (
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="mt-2"
          >
            Logout
          </Button>
        ) : isNetworkError(error) ? (
          onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="mt-2"
            >
              <RefreshCcw
                className={cn("mr-2 h-4 w-4", {
                  "animate-spin": isLoading,
                })}
              />
              No Network – Try Again
            </Button>
          )
        ) : (
          onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="mt-2"
            >
              <RefreshCcw
                className={cn("mr-2 h-4 w-4", {
                  "animate-spin": isLoading,
                })}
              />
              Try Again
            </Button>
          )
        )}
      </div>
    </div>
  )
}
