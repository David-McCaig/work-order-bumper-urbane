"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
}

interface WorkOrderRowProps {
  workorderStatuses: WorkOrderStatus[]
  workOrder: WorkOrder
  isSelected: boolean
  onSelectionChange: (workOrderId: string, checked: boolean) => void
}

export function WorkOrderRow({ workOrder, isSelected, onSelectionChange, workorderStatuses }: WorkOrderRowProps) {
  
    const getStatusName = (statusId: string) => {
        const status = workorderStatuses.find(status => status.workorderStatusID === statusId)
        return status?.name || "Unknown"
    }

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelectionChange(workOrder.workorderID, checked as boolean)
          }
        />
      </TableCell>
      <TableCell className="font-medium">{workOrder.workorderID}</TableCell>
      {/* <TableCell>{customerName}</TableCell> */}
      <TableCell>
        <Badge >
          {getStatusName(workOrder.workorderStatusID)}
        </Badge>
      </TableCell>
    </TableRow>
  )
} 