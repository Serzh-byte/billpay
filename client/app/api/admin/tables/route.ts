import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = getRestaurantData()
    const [restaurantId] = adminToken.split("-admin")

    const restaurant = data.restaurants.find((r) => r.id === restaurantId)
    const tables = data.tables.filter((t) => t.restaurantId === restaurantId)

    return NextResponse.json({
      restaurant,
      tables,
    })
  } catch (error) {
    console.error("[v0] Error fetching tables:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
