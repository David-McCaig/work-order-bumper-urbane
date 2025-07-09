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

interface ErrorResult {
  type: 'authentication' | 'configuration' | 'api' | 'network' | 'unknown';
  message: string;
  statusCode?: number;
  workOrderId?: string;
  details?: unknown;
}

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
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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
    if (selectedWorkOrders.length === 0) {
      toast.error("No work orders selected", {
        description: "Please select at least one work order to bump.",
        duration: Infinity,
        dismissible: true,
      });
      return;
    }

    if (!toDate) {
      toast.error("No target date selected", {
        description: "Please select a target date for the work orders.",
        duration: Infinity,
        dismissible: true,
      });
      return;
    }

    setIsLoading(true);
    setLastError(null);
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
      
      // Reset retry count on success
      setRetryCount(0);
      
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
      setLastError(error as Error);
      
      // Try to parse the error message as JSON to get structured error info
      let errorResult: ErrorResult | null = null;
      if (error instanceof Error) {
        try {
          errorResult = JSON.parse(error.message) as ErrorResult;
        } catch {
          // If parsing fails, it's not a structured error
        }
      }
      
      // Handle specific error types
      if (errorResult?.type === 'authentication') {
        toast.error("Authentication Error", {
          description: errorResult.message,
          duration: Infinity,
          dismissible: true,
        });
        console.error("Authentication error:", error);
      } else if (errorResult?.type === 'configuration') {
        toast.error("Configuration Error", {
          description: errorResult.message,
          duration: Infinity,
          dismissible: true,
        });
        console.error("Configuration error:", error);
      } else if (errorResult?.type === 'api') {
        const errorMessage = errorResult.workOrderId 
          ? `Error with work order ${errorResult.workOrderId}: ${errorResult.message}`
          : errorResult.message;
        
        // For rate limit errors, suggest retry
        if (errorResult.statusCode === 429) {
          toast.error("Rate Limit Exceeded", {
            description: `${errorMessage} You can retry in a few minutes.`,
            duration: Infinity,
            dismissible: true,
          });
        } else if (errorResult.statusCode === 403) {
          toast.error("Permission Denied", {
            description: errorMessage,
            duration: Infinity,
            dismissible: true,
          });
        } else if (errorResult.statusCode === 404) {
          toast.error("Work Order Not Found", {
            description: errorMessage,
            duration: Infinity,
            dismissible: true,
          });
        } else if (errorResult.statusCode === 500) {
          toast.error("Server Error", {
            description: errorMessage,
            duration: Infinity,
            dismissible: true,
          });
        } else {
          toast.error("API Error", {
            description: errorMessage,
            duration: Infinity,
            dismissible: true,
          });
        }
        console.error("API error:", error);
      } else if (errorResult?.type === 'network') {
        toast.error("Network Error", {
          description: errorResult.message,
          duration: Infinity,
          dismissible: true,
        });
        console.error("Network error:", error);
      } else {
        // Generic error handling
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error("An error occurred while bumping work orders", {
          description: errorMessage,
          duration: Infinity,
          dismissible: true,
        });
        console.error("Bump error:", error);
      }
    } finally {
      setSelectedWorkOrders([]);
      setIsLoading(false);
      // setProgress(0);
      setCurrentWorkOrder("");
    }
  };

  // Retry function for recoverable errors
  const handleRetry = () => {
    if (lastError) {
      let errorResult: ErrorResult | null = null;
      try {
        errorResult = JSON.parse(lastError.message) as ErrorResult;
      } catch {
        // If parsing fails, it's not a structured error
      }
      
      if (errorResult?.type === 'api' && errorResult.statusCode === 429) {
        setRetryCount(prev => prev + 1);
        toast.info("Retrying in 5 seconds...", {
          duration: 5000,
          dismissible: true,
        });
        // Add a delay before retrying
        setTimeout(() => {
          handleBumpWorkOrders();
        }, 5000); // Wait 5 seconds before retry
      }
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

          {/* Error Retry Section */}
          {lastError && (() => {
            let errorResult: ErrorResult | null = null;
            try {
              errorResult = JSON.parse(lastError.message) as ErrorResult;
            } catch {
              // If parsing fails, it's not a structured error
            }
            return errorResult?.type === 'api' && errorResult.statusCode === 429;
          })() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-yellow-800">Rate Limit Exceeded</h3>
                {retryCount > 0 && (
                  <span className="text-sm text-yellow-600">Retry attempt: {retryCount}</span>
                )}
              </div>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>You&apos;ve hit the API rate limit. You can retry the operation in a few minutes.</p>
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Retry Now"}
                </button>
              </div>
            </div>
          )}

          {/* Detailed Error Information */}
          {lastError && (() => {
            let errorResult: ErrorResult | null = null;
            try {
              errorResult = JSON.parse(lastError.message) as ErrorResult;
            } catch {
              // If parsing fails, it's not a structured error
            }
            return errorResult;
          })() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-red-800">
                  {(() => {
                    let errorResult: ErrorResult | null = null;
                    try {
                      errorResult = JSON.parse(lastError.message) as ErrorResult;
                    } catch {
                      return "Error";
                    }
                    switch (errorResult?.type) {
                      case 'authentication': return "Authentication Error";
                      case 'configuration': return "Configuration Error";
                      case 'api': return `API Error (${errorResult.statusCode})`;
                      case 'network': return "Network Error";
                      default: return "Error";
                    }
                  })()}
                </h3>
              </div>
              <div className="text-sm text-red-700 space-y-2">
                <p className="font-medium">{(() => {
                  let errorResult: ErrorResult | null = null;
                  try {
                    errorResult = JSON.parse(lastError.message) as ErrorResult;
                  } catch {
                    return lastError.message;
                  }
                  return errorResult?.message || lastError.message;
                })()}</p>
                {(() => {
                  let errorResult: ErrorResult | null = null;
                  try {
                    errorResult = JSON.parse(lastError.message) as ErrorResult;
                  } catch {
                    return null;
                  }
                  return errorResult?.workOrderId;
                })() && (
                  <p className="text-xs opacity-75">Work Order ID: {(() => {
                    let errorResult: ErrorResult | null = null;
                    try {
                      errorResult = JSON.parse(lastError.message) as ErrorResult;
                    } catch {
                      return null;
                    }
                    return errorResult?.workOrderId;
                  })()}</p>
                )}
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                      Show technical details
                    </summary>
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                      {JSON.stringify(lastError, null, 2)}
                    </pre>
                  </details>
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
