/* eslint-disable react-refresh/only-export-components */
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { Slot as SlotPrimitive } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    // Tag-specific base styles
    variant: {
      h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
      h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug",
      h3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-snug",
      h4: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal leading-relaxed",
      h5: "text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed",
      h6: "text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed",
      p: "text-sm sm:text-base md:text-lg leading-relaxed",
      span: "text-sm sm:text-base text-muted-foreground",
    },
    // Additional styling variants
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-gray-500",
      danger: "text-red-600",
    },
  },
  defaultVariants: {
    variant: "p",
    color: "primary",
  },
})

export type TypographyProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  asChild?: boolean
} & Omit<React.HTMLAttributes<HTMLElement>, "color"> &
  VariantProps<typeof typographyVariants>

const Typography = ({
  as,
  asChild = false,
  className,
  variant,
  color,
  ...props
}: TypographyProps) => {
  const Component = asChild ? SlotPrimitive.Slot : as || "p"
  const stylingVariant = variant || (as as TypographyProps["variant"]) || "p"

  return (
    <Component
      className={cn(
        typographyVariants({
          variant: stylingVariant,
          color,
          className,
        })
      )}
      {...props}
    />
  )
}

Typography.displayName = "Typography"

export { Typography, typographyVariants }
