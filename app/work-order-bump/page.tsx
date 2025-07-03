import { redirect } from "next/navigation"

export default function WorkOrderBumpPage() {
  // Get current date in a server-side consistent way with local timezone
  const now = new Date()
  const localYear = now.getFullYear()
  const localMonth = now.getMonth()
  const localDay = now.getDate()
  
  // Create date using the local components (this ensures no timezone conversion)
  const localDate = new Date(localYear, localMonth, localDay)
  const today = localDate.toISOString().split('T')[0] // YYYY-MM-DD format
  redirect(`/work-order-bump/${today}`)
} 