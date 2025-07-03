import { WorkOrderBump } from "@/components/work-order-bump"
import { getWorkorderStatuses, getWorkOrders, isTokenValid } from "@/app/data"
import { parseISO, format } from "date-fns"
import { notFound, redirect } from "next/navigation"

interface WorkOrderBumpDatePageProps {
  params: {
    date: string
  }
}

export default async function WorkOrderBumpDatePage({ params }: WorkOrderBumpDatePageProps) {
  // Parse the date from the URL parameter
  let fromDate: Date
  
  try {
    const { date } = await params
    // Expect date in YYYY-MM-DD format
    fromDate = parseISO(date)
    
    // Validate that it's a valid date
    if (isNaN(fromDate.getTime())) {
      notFound()
    }
  } catch (error) {
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

  workOrders = workOrders.filter((workOrder:any) => {
    const status = workorderStatuses.find((status:any) => status.workorderStatusID === workOrder.workorderStatusID)
    return status.name !== "Floor Bike" && status.name !== "Finished" && status.name !== "Done & Paid" && status.name !== "Appointment" && status.name !== "Write Off" && status.name !== "Fitting" && status.name !== "Estimate" && status.name !== "Class"
  })
  
  return <WorkOrderBump 
    initialWorkOrders={workOrders} 
    workorderStatuses={workorderStatuses || []}
    initialFromDate={fromDate}
  />
} 