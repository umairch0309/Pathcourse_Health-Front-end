"use client"

import { OTPInput, OTPInputContext } from "input-otp"
import * as React from "react"
import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      containerClassName={cn("flex items-center gap-3", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.use(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "w-14 h-14 border-b border-input bg-white text-center text-lg font-medium text-foreground",
        "flex items-center justify-center relative transition-all",
        // 'outline-none ring-0 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        // 'data-[active=true]:ring-2 data-[active=true]:ring-primary',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px bg-foreground animate-caret-blink" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-separator" role="separator" {...props} />
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
