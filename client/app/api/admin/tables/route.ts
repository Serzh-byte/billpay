import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${DJANGO_API_URL}/admin/tables`, {
      headers: {
        "X-Admin-Token": adminToken,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const tables = await response.json()

    // Transform to frontend format
    const transformedTables = tables.map((table: any) => ({
      id: table.id.toString(),
      restaurantId: "1",
      tableNumber: table.name,
      qrCode: table.qr_data,
      dinerUrl: table.diner_url,
    }))

    return NextResponse.json({
      restaurant: {
        id: "1",
        name: "Demo Restaurant",
      },
      tables: transformedTables,
    })
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
