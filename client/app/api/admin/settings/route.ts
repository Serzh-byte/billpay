import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${DJANGO_API_URL}/admin/settings`, {
      headers: {
        "X-Admin-Token": adminToken,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      taxPercent: (data.tax_rate || 0.0875) * 100,
      serviceFeePercent: (data.service_fee_rate || 0.03) * 100,
      tipPresets: data.tip_presets_json || [15, 18, 20, 25],
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
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

    const response = await fetch(`${DJANGO_API_URL}/admin/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": adminToken,
      },
      body: JSON.stringify({
        tax_rate: taxPercent / 100,
        service_fee_rate: serviceFeePercent / 100,
        tip_presets_json: tipPresets,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
