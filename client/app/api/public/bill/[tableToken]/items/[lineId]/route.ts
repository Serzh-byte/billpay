import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tableToken: string; lineId: string }> }
) {
  const { tableToken, lineId } = await params

  try {
    // Get table context for table ID
    const contextResponse = await fetch(`${DJANGO_API_URL}/public/table-context/${tableToken}`)
    if (!contextResponse.ok) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const context = await contextResponse.json()
    const tableId = context.tableId

    // Remove item from bill
    const response = await fetch(`${DJANGO_API_URL}/public/tables/${tableId}/bill/items/${lineId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const billData = await response.json()

    // Transform response
    const bill = {
      id: billData.id.toString(),
      tableId: tableId.toString(),
      items: billData.lines.map((line: any) => ({
        id: line.id.toString(),
        menuItemId: "0",
        menuItemName: line.name_snapshot,
        quantity: line.qty,
        price: line.unit_price_cents / 100,
        lineTotal: line.line_total_cents / 100,
        options: line.options_snapshot,
      })),
      subtotal: billData.subtotal_cents / 100,
      tax: billData.tax_cents / 100,
      serviceFee: billData.service_fee_cents / 100,
      tip: billData.tip_cents / 100,
      total: billData.total_cents / 100,
      status: billData.is_open ? "open" : "paid",
    }

    return NextResponse.json({ bill })
  } catch (error) {
    console.error("Error removing item from bill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
