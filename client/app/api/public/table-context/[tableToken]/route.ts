import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const response = await fetch(`${DJANGO_API_URL}/public/table-context/${tableToken}`)
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    
    // Transform Django response to frontend format
    return NextResponse.json({
      restaurant: {
        id: data.restaurantId.toString(),
        name: "Demo Restaurant", // This would come from settings in production
      },
      table: {
        id: data.tableId.toString(),
        restaurantId: data.restaurantId.toString(),
        tableNumber: tableToken,
      },
      settings: {
        taxPercent: data.taxRate * 100,
        serviceFeePercent: data.serviceFeeRate * 100,
        tipPresets: data.tipPresets,
      },
      theme: data.theme,
    })
  } catch (error) {
    console.error("Error fetching table context:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
