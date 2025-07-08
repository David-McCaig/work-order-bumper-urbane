"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

//utils
import { format } from "date-fns";

//components
import { DateSelector } from "./date-selector";
import { WorkOrderTable } from "./work-order-table";
import { ClientOnly } from "@/components/ui/client-only";

//actions
import { bumpWorkOrders } from "@/app/actions";

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
  // Add other properties as needed based on the actual data structure
}

interface WorkOrderBumpProps {
  initialWorkOrders: WorkOrder[];
  workorderStatuses: WorkOrderStatus[];
  initialFromDate?: string;
}

export function WorkOrderBump({
  initialWorkOrders,
  workorderStatuses,
  initialFromDate,
}: WorkOrderBumpProps) {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedWorkOrders, setSelectedWorkOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<string>("");

  // Initialize dates on client side only to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    // Fix timezone issue: Use date components directly to avoid any timezone conversion
    const today = new Date();
    const localYear = today.getFullYear();
    const localMonth = today.getMonth();
    const localDay = today.getDate();

    // Create dates using the local components (this ensures no timezone conversion)
    const localToday = new Date(localYear, localMonth, localDay);
    const localTomorrow = new Date(localYear, localMonth, localDay + 1);

    // Parse the initial date string if provided, otherwise use today
    let parsedFromDate = localToday;
    if (initialFromDate) {
      const [year, month, day] = initialFromDate.split("-").map(Number);
      parsedFromDate = new Date(year, month - 1, day); // month is 0-indexed
    }

    setFromDate(parsedFromDate);
    setToDate(localTomorrow);
    setSelectedWorkOrders(initialWorkOrders.map((wo) => wo.workorderID));
  }, [initialFromDate, initialWorkOrders]);

  // Handle work order selection
  const handleWorkOrderSelection = (workOrderId: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkOrders((prev) => [...prev, workOrderId]);
    } else {
      setSelectedWorkOrders((prev) => prev.filter((id) => id !== workOrderId));
    }
  };

  // Handle select all/none
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorkOrders(initialWorkOrders.map((wo) => wo.workorderID));
    } else {
      setSelectedWorkOrders([]);
    }
  };

  // Bump selected work orders (placeholder for now)
  const handleBumpWorkOrders = async () => {
    if (selectedWorkOrders.length === 0) return;

    setIsLoading(true);
    // setProgress(0);
    setCurrentWorkOrder("");

    try {
      // Set up progress tracking
      // const totalWorkOrders = selectedWorkOrders.length;
      // const estimatedTimePerWorkOrder = 2000; // 4 seconds per work order
      // const totalEstimatedTime = totalWorkOrders * estimatedTimePerWorkOrder;
      
      // Update progress every 100ms
      // setInterval(() => {
      //   setProgress(() => {
      //     // Calculate what percent through we should be based on elapsed time
      //     const elapsedTime = Date.now() - startTime;
      //     const estimatedProgress = Math.min((elapsedTime / totalEstimatedTime) * 100, 99);
      //     return estimatedProgress;
      //   });
      // }, 100);

      // const startTime = Date.now();


      const result = await bumpWorkOrders(selectedWorkOrders, toDate!);
      if (result.successful > 0) {
        // Trigger confetti when bumping is successful
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Use ClientOnly to ensure date formatting only happens on client
        const formattedDate = format(toDate!, "PPP");
        toast.success(
          `Successfully bumped ${result.successful} work order(s) to ${formattedDate}`,
          {
            description:
              result.failed > 0
                ? `${result.failed} work order(s) failed to bump`
                : undefined,
            duration: 5000, // 5 seconds
          }
        );
      } else if (result.failed > 0) {
        toast.error(`Failed to bump ${result.failed} work order(s)`, {
          description: "Please check the console for more details",
        });
      }
    } catch (error) {
      toast.error("An error occurred while bumping work orders", {
        description: "Please try again or check the console for details",
      });
      console.error("Bump error:", error);
    } finally {
      setSelectedWorkOrders([]);
      setIsLoading(false);
      // setProgress(0);
      setCurrentWorkOrder("");
    }
  };

  const loadingFallback = (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Work Order Bump Tool</h1>
        <p className="text-muted-foreground mt-2">
          Select work orders from one day and bump them to another day
        </p>
      </div>
      <div className="text-center">
        <p>Loading...</p>
      </div>
    </div>
  );

  // Don't render anything until we're on the client side
  if (!isClient) {
    return loadingFallback;
  }

  return (
    <ClientOnly fallback={loadingFallback}>
      {fromDate && toDate ? (
        <div className="container mx-auto p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Work Order Bump Tool</h1>
            <p className="text-muted-foreground mt-2">
              Select work orders from one day and bump them to another day
            </p>
          </div>

          <DateSelector
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />

          {/* Progress Section */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium ">Processing Work Orders</h3>
                {/* <span className="text-sm ">{Math.round(progress)}%</span> */}
              </div>

              {/* <Progress value={progress} className="w-full" /> */}

              <div className="text-sm  space-y-1">
                {
                  <p>
                    Due to Lightspeed&apos;s heavy rate limiting, this process may
                    between 5 to 10 minutes to complete.
                  </p>
                }
                <p>
                  Each work order requires a wait period to respect
                  API limits.
                </p>
                {currentWorkOrder && (
                  <p className="font-medium">
                    Currently processing: work order#{currentWorkOrder}
                  </p>
                )}
              </div>
            </div>
          )}

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
  );
}
