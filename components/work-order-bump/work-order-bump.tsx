"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"

//utils
import { format } from "date-fns"

//components
import { DateSelector } from "./date-selector"
import { WorkOrderTable } from "./work-order-table"
import { ClientOnly } from "@/components/ui/client-only"

//actions
import { bumpWorkOrders } from "@/app/actions"

interface WorkOrder {
  workorderID: string
  customerID: string
  workorderStatusID: string
  etaOut: string
  note?: string
  internalNote?: string
}

interface WorkOrderStatus {
  workorderStatusID: string
  name: string
  // Add other properties as needed based on the actual data structure
}

interface WorkOrderBumpProps {
  initialWorkOrders: WorkOrder[]
  workorderStatuses: WorkOrderStatus[]
  initialFromDate?: Date
}

export function WorkOrderBump({ initialWorkOrders, workorderStatuses, initialFromDate }: WorkOrderBumpProps) {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [selectedWorkOrders, setSelectedWorkOrders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize dates on client side only to prevent hydration mismatch
  useEffect(() => {
    // Fix timezone issue: Create dates in local timezone to avoid UTC conversion
    const today = new Date()
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const localTomorrow = new Date(localToday.getFullYear(), localToday.getMonth(), localToday.getDate() + 1)
    
    setFromDate(initialFromDate || localToday)
    setToDate(localTomorrow)
    setSelectedWorkOrders(initialWorkOrders.map((wo) => wo.workorderID))
  }, [initialFromDate, initialWorkOrders])

  // Handle work order selection
  const handleWorkOrderSelection = (workOrderId: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkOrders((prev) => [...prev, workOrderId])
    } else {
      setSelectedWorkOrders((prev) => prev.filter((id) => id !== workOrderId))
    }
  }

  // Handle select all/none
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorkOrders(initialWorkOrders.map((wo) => wo.workorderID))
    } else {
      setSelectedWorkOrders([])
    }
  }

  // Bump selected work orders (placeholder for now)
  const handleBumpWorkOrders = async () => {
    if (selectedWorkOrders.length === 0) return

    setIsLoading(true)
    
    try {
      const result = await bumpWorkOrders(selectedWorkOrders, toDate!)
     
      if (result.successful > 0) {
        // Trigger confetti when bumping is successful
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        
        toast.success(`Successfully bumped ${result.successful} work order(s) to ${format(toDate!, "PPP")}`, {
          description: result.failed > 0 ? `${result.failed} work order(s) failed to bump` : undefined,
          duration: 5000 // 5 seconds
        })
      } else if (result.failed > 0) {
        toast.error(`Failed to bump ${result.failed} work order(s)`, {
          description: "Please check the console for more details"
        })
      }
    } catch (error) {
      toast.error("An error occurred while bumping work orders", {
        description: "Please try again or check the console for details"
      })
      console.error("Bump error:", error)
    } finally {
      setSelectedWorkOrders([])
      setIsLoading(false)
    }
  }

  const loadingFallback = (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Work Order Bump Tool</h1>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  )

  return (
    <ClientOnly fallback={loadingFallback}>
      {fromDate && toDate ? (
        <div className="container mx-auto p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Work Order Bump Tool</h1>
            <p className="text-muted-foreground mt-2">Select work orders from one day and bump them to another day</p>
          </div>

          <DateSelector
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />

          <WorkOrderTable
            workorderStatuses={workorderStatuses}
            workOrders={initialWorkOrders}
            fromDate={fromDate}
            selectedWorkOrders={selectedWorkOrders}
            isLoading={isLoading}
            onWorkOrderSelection={handleWorkOrderSelection}
            onSelectAll={handleSelectAll}
            onBumpWorkOrders={handleBumpWorkOrders}
          />
        </div>
      ) : (
        loadingFallback
      )}
    </ClientOnly>
  )
} 