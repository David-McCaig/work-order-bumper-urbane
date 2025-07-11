"use client"

import { format } from "date-fns"
import { CalendarIcon, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ClientOnly } from "@/components/ui/client-only"

interface DateSelectorProps {
  fromDate: Date
  toDate: Date
  onFromDateChange: (date: Date) => void
  onToDateChange: (date: Date) => void
}

export function DateSelector({ fromDate, toDate, onFromDateChange, onToDateChange }: DateSelectorProps) {
  const router = useRouter()

  const handleFromDateChange = (date: Date | undefined) => {
    if (date) {
      // react-day-picker creates dates in local timezone, so we can use them directly
      onFromDateChange(date)
      // Navigate to the new date URL
      const formattedDate = format(date, "yyyy-MM-dd")
      router.push(`/work-order-bump/${formattedDate}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* From Date Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            From Date
          </CardTitle>
          <CardDescription>Select the date to view work orders (Default: Today)</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={handleFromDateChange}
            className="rounded-md border"
          />
          <ClientOnly fallback={<div className="mt-4 text-sm text-muted-foreground">Loading...</div>}>
            <div className="mt-4 text-sm text-muted-foreground">Selected: {format(fromDate, "PPP")}</div>
          </ClientOnly>
        </CardContent>
      </Card>

      {/* To Date Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            To Date
          </CardTitle>
          <CardDescription>Select the target date to bump work orders (Default: Tomorrow)</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={(date) => {
              if (date) {
                // react-day-picker creates dates in local timezone, so we can use them directly
                onToDateChange(date)
              }
            }}
            className="rounded-md border"
          />
          <ClientOnly fallback={<div className="mt-4 text-sm text-muted-foreground">Loading...</div>}>
            <div className="mt-4 text-sm text-muted-foreground">Selected: {format(toDate, "PPP")}</div>
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  )
} 