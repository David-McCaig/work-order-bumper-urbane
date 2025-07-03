import { redirect } from "next/navigation"

export default function WorkOrderBumpPage() {
  // Get current date in a server-side consistent way
  const now = new Date()
  const today = now.toISOString().split('T')[0] // YYYY-MM-DD format
  redirect(`/work-order-bump/${today}`)
} 