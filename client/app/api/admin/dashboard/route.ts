import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, validate admin token against database
    const data = getRestaurantData()
    const [restaurantId] = adminToken.split("-admin")

    // Calculate stats
    const openChecks = data.bills.filter(
      (b) => b.status === "open" && data.tables.find((t) => t.id === b.tableId)?.restaurantId === restaurantId,
    ).length

    const todayRevenue = data.bills
      .filter((b) => {
        const table = data.tables.find((t) => t.id === b.tableId)
        return b.status === "paid" && table?.restaurantId === restaurantId
      })
      .reduce((sum, bill) => sum + bill.total, 0)

    return NextResponse.json({
      openChecks,
      todayRevenue,
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
