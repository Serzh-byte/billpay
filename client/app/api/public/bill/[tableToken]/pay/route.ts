import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const body = await request.json()
    const { amount, tip, paymentMode, seats } = body

    // Get table context for table ID
    const contextResponse = await fetch(`${DJANGO_API_URL}/public/table-context/${tableToken}`)
    if (!contextResponse.ok) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }
    
    const context = await contextResponse.json()
    const tableId = context.tableId

    // Convert tip from dollars to cents and payment mode format
    const tipCents = Math.round((tip || 0) * 100)
    const mode = paymentMode || "full"

    // Create payment intent
    const response = await fetch(`${DJANGO_API_URL}/public/tables/${tableId}/payment/intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        seats: seats || 1,
        tip: tipCents,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const paymentData = await response.json()

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      paymentId: paymentData.paymentId,
      status: paymentData.status,
      billClosed: paymentData.billClosed,
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
