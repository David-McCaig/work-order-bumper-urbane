"use client"

import { useState, useMemo } from "react"
import { addDays, isSameDay, parseISO, format } from "date-fns"
import { DateSelector } from "./date-selector"
import { WorkOrderTable } from "./work-order-table"

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
  const today = new Date()
  const tomorrow = addDays(today, 1)

  const [fromDate, setFromDate] = useState<Date>(initialFromDate || today)
  const [toDate, setToDate] = useState<Date>(tomorrow)
  const [selectedWorkOrders, setSelectedWorkOrders] = useState<string[]>([])
  const [allWorkOrders, setAllWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const [isLoading, setIsLoading] = useState(false)

  // Filter work orders by the selected "from" date
  const filteredWorkOrders = useMemo(() => {
    return allWorkOrders.filter((wo) => {
      const etaOutDate = parseISO(wo.etaOut)
      return isSameDay(etaOutDate, fromDate)
    })
  }, [allWorkOrders, fromDate])

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
      setSelectedWorkOrders(filteredWorkOrders.map((wo) => wo.workorderID))
    } else {
      setSelectedWorkOrders([])
    }
  }

  // Bump selected work orders (placeholder for now)
  const handleBumpWorkOrders = async () => {
    if (selectedWorkOrders.length === 0) return

    setIsLoading(true)

    // TODO: Implement actual bump functionality
    // For now, just simulate the process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Bumping work orders:", selectedWorkOrders, "to date:", toDate)
    
    setSelectedWorkOrders([])
    setIsLoading(false)
  }

  return (
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
        workOrders={filteredWorkOrders}
        fromDate={fromDate}
        selectedWorkOrders={selectedWorkOrders}
        isLoading={isLoading}
        onWorkOrderSelection={handleWorkOrderSelection}
        onSelectAll={handleSelectAll}
        onBumpWorkOrders={handleBumpWorkOrders}
        
      />
    </div>
  )
} 