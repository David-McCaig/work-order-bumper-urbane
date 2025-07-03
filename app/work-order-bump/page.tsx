import { redirect } from "next/navigation"

export default function WorkOrderBumpPage() {
  // Get current date in a server-side consistent way with local timezone
  const now = new Date()
  const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const today = localDate.toISOString().split('T')[0] // YYYY-MM-DD format
  redirect(`/work-order-bump/${today}`)
} 