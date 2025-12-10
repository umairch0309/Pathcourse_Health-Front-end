"use client"

import * as Flags from "country-flag-icons/react/3x2"
import { Check } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type CountryCode = {
  code: string
  name: string
  isoCode: string // ISO 3166-1 alpha-2 country code
}

// Map of country codes to ISO codes
export const countryCodes: CountryCode[] = [
  { code: "+1", name: "United States", isoCode: "US" },
  { code: "+44", name: "United Kingdom", isoCode: "GB" },
  { code: "+91", name: "India", isoCode: "IN" },
  { code: "+86", name: "China", isoCode: "CN" },
  { code: "+81", name: "Japan", isoCode: "JP" },
  { code: "+49", name: "Germany", isoCode: "DE" },
  { code: "+33", name: "France", isoCode: "FR" },
  { code: "+39", name: "Italy", isoCode: "IT" },
  { code: "+34", name: "Spain", isoCode: "ES" },
  { code: "+7", name: "Russia", isoCode: "RU" },
  { code: "+61", name: "Australia", isoCode: "AU" },
  { code: "+55", name: "Brazil", isoCode: "BR" },
  { code: "+52", name: "Mexico", isoCode: "MX" },
  { code: "+82", name: "South Korea", isoCode: "KR" },
  { code: "+31", name: "Netherlands", isoCode: "NL" },
  { code: "+32", name: "Belgium", isoCode: "BE" },
  { code: "+41", name: "Switzerland", isoCode: "CH" },
  { code: "+46", name: "Sweden", isoCode: "SE" },
  { code: "+47", name: "Norway", isoCode: "NO" },
  { code: "+45", name: "Denmark", isoCode: "DK" },
  { code: "+358", name: "Finland", isoCode: "FI" },
  { code: "+353", name: "Ireland", isoCode: "IE" },
  { code: "+351", name: "Portugal", isoCode: "PT" },
  { code: "+30", name: "Greece", isoCode: "GR" },
  { code: "+48", name: "Poland", isoCode: "PL" },
  { code: "+420", name: "Czech Republic", isoCode: "CZ" },
  { code: "+36", name: "Hungary", isoCode: "HU" },
  { code: "+40", name: "Romania", isoCode: "RO" },
  { code: "+380", name: "Ukraine", isoCode: "UA" },
  { code: "+90", name: "Turkey", isoCode: "TR" },
  { code: "+20", name: "Egypt", isoCode: "EG" },
  { code: "+27", name: "South Africa", isoCode: "ZA" },
  { code: "+234", name: "Nigeria", isoCode: "NG" },
  { code: "+254", name: "Kenya", isoCode: "KE" },
  { code: "+971", name: "United Arab Emirates", isoCode: "AE" },
  { code: "+966", name: "Saudi Arabia", isoCode: "SA" },
  { code: "+972", name: "Israel", isoCode: "IL" },
  { code: "+65", name: "Singapore", isoCode: "SG" },
  { code: "+60", name: "Malaysia", isoCode: "MY" },
  { code: "+66", name: "Thailand", isoCode: "TH" },
  { code: "+84", name: "Vietnam", isoCode: "VN" },
  { code: "+62", name: "Indonesia", isoCode: "ID" },
  { code: "+63", name: "Philippines", isoCode: "PH" },
  { code: "+64", name: "New Zealand", isoCode: "NZ" },
  { code: "+1", name: "Canada", isoCode: "CA" },
  { code: "+54", name: "Argentina", isoCode: "AR" },
  { code: "+56", name: "Chile", isoCode: "CL" },
  { code: "+57", name: "Colombia", isoCode: "CO" },
  { code: "+51", name: "Peru", isoCode: "PE" },
  { code: "+58", name: "Venezuela", isoCode: "VE" },
]

// Helper function to get flag component
function getFlagComponent(isoCode: string) {
  const FlagComponent = (Flags as any)[isoCode] as
    | React.ComponentType<{ className?: string; title?: string }>
    | undefined
  return FlagComponent
}

interface CountryCodeSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function CountryCodeSelect({
  value,
  onValueChange,
  className,
  disabled,
}: CountryCodeSelectProps) {
  const selectedCountry =
    countryCodes.find((country) => country.code === value) || countryCodes[0]
  const SelectedFlag = getFlagComponent(selectedCountry.isoCode)

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-full border-0 border-b-2 border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm [&>span]:text-muted-foreground/60",
          className
        )}
      >
        <SelectValue>
          <div className="flex items-center gap-2">
            {SelectedFlag ? (
              <SelectedFlag
                className="w-5 h-4 object-cover rounded-sm"
                title={selectedCountry.name}
              />
            ) : (
              <span className="text-lg">🏳️</span>
            )}
            <span>{selectedCountry.code}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {countryCodes.map((country) => {
          const FlagComponent = getFlagComponent(country.isoCode)
          return (
            <SelectItem
              key={`${country.code}-${country.isoCode}`}
              value={country.code}
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
                <span className="text-muted-foreground">{country.code}</span>
                {value === country.code && (
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
