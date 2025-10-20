import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const data = getRestaurantData()
    const [restaurantId] = tableToken.split("-")

    const categories = data.categories.filter((c) => c.restaurantId === restaurantId)
    const menuItems = data.menuItems.filter((m) => m.restaurantId === restaurantId)

    return NextResponse.json({
      categories: categories.sort((a, b) => a.sortOrder - b.sortOrder),
      menuItems,
    })
  } catch (error) {
    console.error("[v0] Error fetching menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
