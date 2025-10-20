import { type NextRequest, NextResponse } from "next/server"
import { getRestaurantData, updateBillStatus } from "@/lib/mock-data"

export async function POST(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const body = await request.json()
    const { amount, tip, paymentMode } = body

    const data = getRestaurantData()
    const [restaurantId, tableNumber] = tableToken.split("-")

    const table = data.tables.find((t) => t.restaurantId === restaurantId && t.tableNumber === tableNumber)

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const bill = data.bills.find((b) => b.tableId === table.id)

    if (!bill) {
      return NextResponse.json({ error: "No bill found" }, { status: 404 })
    }

    // In a real app, this would process payment through a payment gateway
    // For MVP, we'll just mark the bill as paid
    console.log("[v0] Processing payment:", { amount, tip, paymentMode, billId: bill.id })

    // Update bill status
    updateBillStatus(bill.id, "paid", tip)

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("[v0] Error processing payment:", error)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
