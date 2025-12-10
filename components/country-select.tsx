"use client"

import * as Flags from "country-flag-icons/react/3x2"
import { Check } from "lucide-react"
import type React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { countryCodes } from "./country-code-select"

// Helper function to get flag component
function getFlagComponent(isoCode: string) {
  const FlagComponent = (
    Flags as Record<
      string,
      React.ComponentType<{ className?: string; title?: string }>
    >
  )[isoCode]
  return FlagComponent
}

interface CountrySelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function CountrySelect({
  value,
  onValueChange,
  className,
  disabled,
  placeholder = "Select country",
}: CountrySelectProps) {
  const selectedCountry =
    countryCodes.find((country) => country.name === value) || null
  const SelectedFlag = selectedCountry
    ? getFlagComponent(selectedCountry.isoCode)
    : null

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-full border-0 border-b-2 border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm text-foreground",
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              {SelectedFlag ? (
                <SelectedFlag
                  className="w-5 h-4 object-cover rounded-sm"
                  title={selectedCountry.name}
                />
              ) : (
                <span className="text-lg">🏳️</span>
              )}
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {countryCodes.map((country) => {
          const FlagComponent = getFlagComponent(country.isoCode)
          return (
            <SelectItem
              key={`${country.name}-${country.isoCode}`}
              value={country.name}
            >
              <div className="flex items-center gap-2">
                {FlagComponent ? (
                  <FlagComponent
                    className="w-5 h-4 object-cover rounded-sm"
                    title={country.name}
                  />
                ) : (
                  <span className="text-lg">🏳️</span>
                )}
                <span className="flex-1">{country.name}</span>
                {value === country.name && (
                  <Check className="h-4 w-4 text-primary ml-auto" />
                )}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
