import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const data = getRestaurantData()
    const [restaurantId, tableNumber] = tableToken.split("-")

    const table = data.tables.find((t) => t.restaurantId === restaurantId && t.tableNumber === tableNumber)

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const bill = data.bills.find((b) => b.tableId === table.id)
    const settings = data.settings

    if (!bill) {
      // Return empty bill if none exists
      return NextResponse.json({
        bill: {
          id: "",
          tableId: table.id,
          items: [],
          subtotal: 0,
          tax: 0,
          serviceFee: 0,
          tip: 0,
          total: 0,
          status: "open",
        },
        settings,
      })
    }

    return NextResponse.json({
      bill,
      settings,
    })
  } catch (error) {
    console.error("[v0] Error fetching bill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
