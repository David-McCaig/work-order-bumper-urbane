"use client";

import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkOrderRow } from "./work-order-row";
import { ClientOnly } from "@/components/ui/client-only";

interface WorkOrder {
  workorderID: string;
  customerID: string;
  workorderStatusID: string;
  etaOut: string;
  note?: string;
  internalNote?: string;
}

interface WorkOrderStatus {
  workorderStatusID: string;
  name: string;
}

interface WorkOrderTableProps {
  workorderStatuses: WorkOrderStatus[];
  workOrders: WorkOrder[];
  fromDate: Date;
  selectedWorkOrders: string[];
  isLoading: boolean;
  onWorkOrderSelection: (workOrderId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBumpWorkOrders: () => void;
}

export function WorkOrderTable({
  workorderStatuses,
  workOrders,
  fromDate,
  selectedWorkOrders,
  isLoading,
  onWorkOrderSelection,
  onSelectAll,
  onBumpWorkOrders,
}: WorkOrderTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <ClientOnly fallback="Work Orders for Loading...">
                Work Orders for {format(fromDate, "PPP")}
              </ClientOnly>
            </CardTitle>
            <CardDescription>
              {workOrders.length} work order(s) found
            </CardDescription>
          </div>
          <Button
            onClick={onBumpWorkOrders}
            disabled={selectedWorkOrders.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Bumping Work Orders...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Bump Work Orders ({selectedWorkOrders.length})
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {workOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedWorkOrders.length === workOrders.length &&
                      workOrders.length > 0
                    }
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>Work Order ID</TableHead>
                {/* <TableHead>Customer Name</TableHead> */}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((workOrder) => (
                <WorkOrderRow
                  key={workOrder.workorderID}
                  workorderStatuses={workorderStatuses}
                  workOrder={workOrder}
                  //   customerName={customerLookup[workOrder.customerID] || `Customer ${workOrder.customerID}`}
                  isSelected={selectedWorkOrders.includes(
                    workOrder.workorderID
                  )}
                  onSelectionChange={onWorkOrderSelection}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ClientOnly fallback="No work orders found for Loading...">
              No work orders found for {format(fromDate, "PPP")}
            </ClientOnly>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
