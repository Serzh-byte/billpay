import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData, updateMenu } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = getRestaurantData()
    const [restaurantId] = adminToken.split("-admin")

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

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { categories, menuItems } = body

    // In a real app, this would update the database
    updateMenu(categories, menuItems)

    return NextResponse.json({
      success: true,
      message: "Menu updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
