import { WorkOrderBump } from "@/components/work-order-bump"
import { getWorkorderStatuses, getWorkOrders } from "@/app/data"
import { parseISO, format } from "date-fns"
import { notFound } from "next/navigation"

interface WorkOrderBumpDatePageProps {
  params: {
    date: string
  }
}

export default async function WorkOrderBumpDatePage({ params }: WorkOrderBumpDatePageProps) {
  // Parse the date from the URL parameter
  let fromDate: Date
  try {
    // Expect date in YYYY-MM-DD format
    fromDate = parseISO(params.date)
    
    // Validate that it's a valid date
    if (isNaN(fromDate.getTime())) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  const [workorderStatuses, workOrdersData] = await Promise.all([
    getWorkorderStatuses(),
    getWorkOrders(fromDate)
  ]);

  return <WorkOrderBump 
    initialWorkOrders={workOrdersData?.Workorder || []} 
    workorderStatuses={workorderStatuses || []}
    initialFromDate={fromDate}
  />
} 