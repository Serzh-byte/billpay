import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    // In a real app, this would query a database
    // For MVP, we'll use mock data and parse the token
    const data = getRestaurantData()

    // Parse table token (format: restaurantId-tableNumber)
    const [restaurantId, tableNumber] = tableToken.split("-")

    const restaurant = data.restaurants.find((r) => r.id === restaurantId)
    const table = data.tables.find((t) => t.restaurantId === restaurantId && t.tableNumber === tableNumber)

    if (!restaurant || !table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    return NextResponse.json({
      restaurant,
      table,
    })
  } catch (error) {
    console.error("[v0] Error fetching table context:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
