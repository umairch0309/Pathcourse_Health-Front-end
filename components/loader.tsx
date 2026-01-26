"use client"

import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "pulse" | "spinner"
  color?: "primary" | "white" | "current"
}

export function Loader({
  className,
  size = "md",
  variant = "default",
  color = "primary",
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const colorClasses = {
    primary: "bg-primary",
    white: "bg-white",
    current: "bg-current",
  }

  const borderColorClasses = {
    primary: "border-primary/20 border-t-primary",
    white: "border-white/20 border-t-white",
    current: "border-current/20 border-t-current",
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative">
          <div
            className={cn(
              "rounded-full animate-pulse",
              colorClasses[color],
              sizeClasses[size]
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full animate-ping",
              colorClasses[color],
              sizeClasses[size],
              "opacity-30"
            )}
          />
        </div>
      </div>
    )
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "border-4 rounded-full animate-spin",
            borderColorClasses[color],
            sizeClasses[size]
          )}
        />
      </div>
    )
  }

  // Default variant - heartbeat/pulse effect
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "rounded-full animate-heartbeat",
            colorClasses[color],
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
                ? "w-2.5 h-2.5"
                : "w-3 h-3"
          )}
          style={{
            animationDelay: "0s",
          }}
        />
        <div
          className={cn(
            "rounded-full animate-heartbeat",
            colorClasses[color],
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
                ? "w-2.5 h-2.5"
                : "w-3 h-3"
          )}
          style={{
            animationDelay: "0.2s",
          }}
        />
        <div
          className={cn(
            "rounded-full animate-heartbeat",
            colorClasses[color],
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
                ? "w-2.5 h-2.5"
                : "w-3 h-3"
          )}
          style={{
            animationDelay: "0.4s",
          }}
        />
      </div>
    </div>
  )
}
