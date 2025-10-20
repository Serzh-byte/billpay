import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    // First get table context to get table ID
    const contextResponse = await fetch(`${DJANGO_API_URL}/public/table-context/${tableToken}`)
    if (!contextResponse.ok) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }
    
    const context = await contextResponse.json()
    const tableId = context.tableId

    // Get the bill for this table
    const billResponse = await fetch(`${DJANGO_API_URL}/public/tables/${tableId}/bill`)
    
    if (!billResponse.ok) {
      const error = await billResponse.json()
      return NextResponse.json(error, { status: billResponse.status })
    }

    const billData = await billResponse.json()
    
    // Transform Django response to frontend format
    const bill = {
      id: billData.id?.toString() || "",
      tableId: tableId.toString(),
      items: billData.lines?.map((line: any) => ({
        id: line.id.toString(),
        menuItemId: "0", // Not tracked in line
        menuItemName: line.name_snapshot,
        quantity: line.qty,
        price: line.unit_price_cents / 100,
        lineTotal: line.line_total_cents / 100,
        options: line.options_snapshot,
      })) || [],
      subtotal: billData.subtotal_cents / 100,
      tax: billData.tax_cents / 100,
      serviceFee: billData.service_fee_cents / 100,
      tip: billData.tip_cents / 100,
      total: billData.total_cents / 100,
      status: billData.is_open ? "open" : "paid",
    }

    const settings = {
      taxPercent: context.taxRate * 100,
      serviceFeePercent: context.serviceFeeRate * 100,
      tipPresets: context.tipPresets,
    }

    return NextResponse.json({
      bill,
      settings,
    })
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const body = await request.json()
    const { itemId, quantity, options } = body

    // Get table context for table ID
    const contextResponse = await fetch(`${DJANGO_API_URL}/public/table-context/${tableToken}`)
    if (!contextResponse.ok) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }
    
    const context = await contextResponse.json()
    const tableId = context.tableId

    // Add item to bill
    const response = await fetch(`${DJANGO_API_URL}/public/tables/${tableId}/bill/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: parseInt(itemId),
        qty: quantity,
        options: options || {},
      }),
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
    console.error("Error adding item to bill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
