/* eslint-disable react/no-nested-component-definitions */
/** biome-ignore-all lint/style/noNonNullAssertion: Values are null */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: index is being used as index to suppress it */
/** biome-ignore-all lint/correctness/noChildrenProp: children is set as prop */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: do not remove */
"use client"

import { differenceInCalendarDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import type { DayPickerProps } from "react-day-picker"
import {
  DayPicker,
  labelNext,
  labelPrevious,
  useDayPicker,
} from "react-day-picker"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean

  monthsClassName?: string
  monthCaptionClassName?: string
  weekdaysClassName?: string
  weekdayClassName?: string
  monthClassName?: string
  captionClassName?: string
  captionLabelClassName?: string
  buttonNextClassName?: string
  buttonPreviousClassName?: string
  navClassName?: string
  monthGridClassName?: string
  weekClassName?: string
  dayClassName?: string
  dayButtonClassName?: string
  rangeStartClassName?: string
  rangeEndClassName?: string
  selectedClassName?: string
  todayClassName?: string
  outsideClassName?: string
  disabledClassName?: string
  rangeMiddleClassName?: string
  hiddenClassName?: string
}

type NavView = "days" | "years"

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  components,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<NavView>("days")
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.defaultMonth || new Date())
  const [displayYears, setDisplayYears] = React.useState<{
    from: number
    to: number
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear()
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      }
    }, [yearRange])
  )

  const { onNextClick, onPrevClick, startMonth, endMonth } = props

  const columnsDisplayed = navView === "years" ? 1 : numberOfMonths

  const _monthsClassName = cn("relative flex", props.monthsClassName)
  const _monthCaptionClassName = cn(
    "relative mx-12 flex h-7 items-center justify-center",
    props.monthCaptionClassName
  )
  const _weekdaysClassName = cn("flex flex-row", props.weekdaysClassName)
  const _weekdayClassName = cn(
    "w-8 text-sm font-normal text-muted-foreground",
    props.weekdayClassName
  )
  const _monthClassName = cn("w-full", props.monthClassName)
  const _captionClassName = cn(
    "relative flex items-center justify-center pt-1",
    props.captionClassName
  )
  const _captionLabelClassName = cn(
    "truncate text-sm font-medium",
    props.captionLabelClassName
  )
  const buttonNavClassName = buttonVariants({
    variant: "outline",
    className:
      "absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  })
  const _buttonNextClassName = cn(
    buttonNavClassName,
    "right-0",
    props.buttonNextClassName
  )
  const _buttonPreviousClassName = cn(
    buttonNavClassName,
    "left-0",
    props.buttonPreviousClassName
  )
  const _navClassName = cn("flex items-start", props.navClassName)
  const _monthGridClassName = cn("mx-auto mt-4", props.monthGridClassName)
  const _weekClassName = cn("mt-2 flex w-max items-start", props.weekClassName)
  const _dayClassName = cn(
    "flex size-8 flex-1 items-center justify-center p-0 text-sm",
    props.dayClassName
  )
  const _dayButtonClassName = cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100",
    props.dayButtonClassName
  )
  const buttonRangeClassName =
    "bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground"
  const _rangeStartClassName = cn(
    buttonRangeClassName,
    "day-range-start rounded-s-md",
    props.rangeStartClassName
  )
  const _rangeEndClassName = cn(
    buttonRangeClassName,
    "day-range-end rounded-e-md",
    props.rangeEndClassName
  )
  const _rangeMiddleClassName = cn(
    "bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground",
    props.rangeMiddleClassName
  )
  const _selectedClassName = cn(
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
    props.selectedClassName
  )
  const _todayClassName = cn(
    "[&>button]:bg-accent [&>button]:text-accent-foreground",
    props.todayClassName
  )
  const _outsideClassName = cn(
    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    props.outsideClassName
  )
  const _disabledClassName = cn(
    "text-muted-foreground opacity-50",
    props.disabledClassName
  )
  const _hiddenClassName = cn("invisible flex-1", props.hiddenClassName)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      style={{
        width: `${280 * (columnsDisplayed ?? 1)}px`,
      }}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
        Nav: ({ className }) => (
          <Nav
            className={className}
            displayYears={displayYears}
            navView={navView}
            setDisplayYears={setDisplayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            onPrevClick={onPrevClick}
            onNextClick={onNextClick}
            setCurrentMonth={setCurrentMonth}
          />
        ),
        CaptionLabel: (props) => (
          <CaptionLabel
            showYearSwitcher={showYearSwitcher}
            navView={navView}
            setNavView={setNavView}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            {...props}
          />
        ),

        MonthGrid: ({ className, children, ...props }) => (
          <MonthGrid
            children={children}
            className={className}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            navView={navView}
            setNavView={setNavView}
            {...props}
          />
        ),
        ...components,
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

function Nav({
  className,
  navView,
  startMonth,
  endMonth,
  displayYears,
  setDisplayYears,
  onPrevClick,
  onNextClick,
  setCurrentMonth,
}: {
  className?: string
  navView: NavView
  startMonth?: Date
  endMonth?: Date
  displayYears: { from: number; to: number }
  setDisplayYears: React.Dispatch<
    React.SetStateAction<{ from: number; to: number }>
  >
  onPrevClick?: (date: Date) => void
  onNextClick?: (date: Date) => void
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker()

  const isPreviousDisabled = (() => {
    if (navView === "years") {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            startMonth
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            endMonth
          ) > 0)
      )
    }
    return !previousMonth
  })()

  const isNextDisabled = (() => {
    if (navView === "years") {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            startMonth
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            endMonth
          ) > 0)
      )
    }
    return !nextMonth
  })()

  const handlePreviousClick = React.useCallback(() => {
    if (!previousMonth) {
      return
    }
    if (navView === "years") {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }))
      onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1
        )
      )
      return
    }
    goToMonth(previousMonth)
    setCurrentMonth(previousMonth)
    onPrevClick?.(previousMonth)
  }, [previousMonth, goToMonth, setCurrentMonth])

  const handleNextClick = React.useCallback(() => {
    if (!nextMonth) {
      return
    }
    if (navView === "years") {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }))
      onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1
        )
      )
      return
    }
    goToMonth(nextMonth)
    setCurrentMonth(nextMonth)
    onNextClick?.(nextMonth)
  }, [goToMonth, nextMonth, setCurrentMonth])
  return (
    <nav className={cn("flex items-center", className)}>
      <Button
        variant="outline"
        className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === "years"
            ? `Go to the previous ${
                displayYears.to - displayYears.from + 1
              } years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === "years"
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

function CaptionLabel({
  children,
  showYearSwitcher,
  navView,
  setNavView,
  displayYears,
  startMonth,
  endMonth,
  currentMonth,
  setCurrentMonth,
  ...props
}: {
  showYearSwitcher?: boolean
  navView: NavView
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
  displayYears: { from: number; to: number }
  startMonth?: Date
  endMonth?: Date
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
} & React.HTMLAttributes<HTMLSpanElement>) {
  const { goToMonth } = useDayPicker()
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Generate year range (100 years back and forward from current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 200 }, (_, i) => currentYear - 100 + i)

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1)
    if (startMonth && newDate < startMonth) return
    if (endMonth && newDate > endMonth) return
    setCurrentMonth(newDate)
    goToMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1)
    if (startMonth && newDate < startMonth) return
    if (endMonth && newDate > endMonth) return
    setCurrentMonth(newDate)
    goToMonth(newDate)
  }
  
  // Update currentMonth when calendar navigation changes
  React.useEffect(() => {
    // Parse children to get current month if available
    if (typeof children === 'string') {
      // Try to extract month/year from formatted string
      const dateMatch = children.match(/(\w+)\s+(\d{4})/)
      if (dateMatch) {
        const monthName = dateMatch[1]
        const year = parseInt(dateMatch[2])
        const monthIndex = monthNames.findIndex(m => m.startsWith(monthName))
        if (monthIndex !== -1) {
          const newDate = new Date(year, monthIndex, 1)
          if (newDate.getTime() !== currentMonth.getTime()) {
            setCurrentMonth(newDate)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  if (!showYearSwitcher) {
    return <span {...props}>{children}</span>
  }

  if (navView === "years") {
    return (
      <Button
        className="h-7 w-full truncate text-sm font-medium"
        variant="ghost"
        size="sm"
        onClick={() => setNavView((prev) => (prev === "days" ? "years" : "days"))}
      >
        {`${displayYears.from} - ${displayYears.to}`}
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 w-full px-2">
      <Select
        value={String(currentMonth.getMonth())}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="h-7 w-[140px] text-sm font-medium border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {monthNames.map((month, index) => (
            <SelectItem key={index} value={String(index)}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(currentMonth.getFullYear())}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="h-7 w-[90px] text-sm font-medium border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function MonthGrid({
  className,
  children,
  displayYears,
  startMonth,
  endMonth,
  navView,
  setNavView,
  ...props
}: {
  className?: string
  children: React.ReactNode
  displayYears: { from: number; to: number }
  startMonth?: Date
  endMonth?: Date
  navView: NavView
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
} & React.TableHTMLAttributes<HTMLTableElement>) {
  if (navView === "years") {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    )
  }
  return (
    <table className={className} {...props}>
      {children}
    </table>
  )
}

function YearGrid({
  className,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  navView,
  ...props
}: {
  className?: string
  displayYears: { from: number; to: number }
  startMonth?: Date
  endMonth?: Date
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
  navView: NavView
} & React.HTMLAttributes<HTMLDivElement>) {
  const { goToMonth, selected } = useDayPicker()

  return (
    <div className={cn("grid grid-cols-4 gap-y-2", className)} {...props}>
      {Array.from(
        { length: displayYears.to - displayYears.from + 1 },
        (_, i) => {
          const isBefore =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 11, 31),
              startMonth!
            ) < 0

          const isAfter =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 0, 0),
              endMonth!
            ) > 0

          const isDisabled = isBefore || isAfter
          return (
            <Button
              key={i}
              className={cn(
                "h-7 w-full text-sm font-normal text-foreground",
                displayYears.from + i === new Date().getFullYear() &&
                  "bg-accent font-medium text-accent-foreground"
              )}
              variant="ghost"
              onClick={() => {
                setNavView("days")
                goToMonth(
                  new Date(
                    displayYears.from + i,
                    (selected as Date | undefined)?.getMonth() ?? 0
                  )
                )
              }}
              disabled={navView === "years" ? isDisabled : undefined}
            >
              {displayYears.from + i}
            </Button>
          )
        }
      )}
    </div>
  )
}

export { Calendar }
