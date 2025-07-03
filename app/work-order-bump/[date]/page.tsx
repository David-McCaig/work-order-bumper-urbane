import { WorkOrderBump } from "@/components/work-order-bump"
import { getWorkorderStatuses, getWorkOrders, isTokenValid } from "@/app/data"
import { notFound, redirect } from "next/navigation"

interface WorkOrder {
  workorderID: string;
  workorderStatusID: string;
  [key: string]: unknown;
}

interface WorkOrderStatus {
  workorderStatusID: string;
  name: string;
  [key: string]: unknown;
}

export default async function Page({ params }: { params: Promise<{ date: string }> }) {
  // Parse the date from the URL parameter
  let fromDate: Date
  let dateString: string
  
  try {
    const { date } = await params
    dateString = date
    // Expect date in YYYY-MM-DD format
    // Fix timezone issue by parsing in local timezone instead of UTC
    const [year, month, day] = date.split('-').map(Number)
    fromDate = new Date(year, month - 1, day) // month is 0-indexed in Date constructor
    
    // Validate that it's a valid date
    if (isNaN(fromDate.getTime())) {
      notFound()
    }
  } catch {
    notFound()
  }

  const tokenValid = await isTokenValid()

  if (!tokenValid) {
    redirect("/login?reason=expired")
  }

  const [workorderStatuses, workOrdersData] = await Promise.all([
    getWorkorderStatuses(),
    getWorkOrders(fromDate),
  ]);

  // Ensure workOrders is always an array
  let workOrders = workOrdersData?.Workorder || []
  
  // If the API returns a single object instead of an array, convert it to an array
  if (workOrders && !Array.isArray(workOrders)) {
    workOrders = [workOrders]
  }

  //remove work orders that have status Floor Bike, Finished, Done & Paid,Appointment, Write Off, Fitting, Estimate, Class
  workOrders = workOrders.filter((workOrder: WorkOrder) => {
    const status = workorderStatuses.find((status: WorkOrderStatus) => status.workorderStatusID === workOrder.workorderStatusID)
    return status.name !== "Floor Bike" && status.name !== "Finished" && status.name !== "Done & Paid" && status.name !== "Appointment" && status.name !== "Write Off" && status.name !== "Fitting" && status.name !== "Estimate" && status.name !== "Class"
  })
  
  return <WorkOrderBump 
    initialWorkOrders={workOrders} 
    workorderStatuses={workorderStatuses || []}
    initialFromDate={dateString}
  />
} 