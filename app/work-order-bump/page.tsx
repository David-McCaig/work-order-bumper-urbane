import { redirect } from "next/navigation"
import { format } from "date-fns"

export default function WorkOrderBumpPage() {
  // Redirect to today's date in the dynamic route
  const today = format(new Date(), "yyyy-MM-dd")
  redirect(`/work-order-bump/${today}`)
} 