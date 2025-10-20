import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData, updateSettings } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = getRestaurantData()

    return NextResponse.json(data.settings)
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
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
    const { taxPercent, serviceFeePercent, tipPresets } = body

    // In a real app, this would update the database
    updateSettings({ taxPercent, serviceFeePercent, tipPresets })

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
