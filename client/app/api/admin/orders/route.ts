import { NextRequest, NextResponse } from 'next/server'

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api'

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get('X-Admin-Token')
    
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Admin token required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${DJANGO_API_URL}/admin/orders`, {
      headers: {
        'X-Admin-Token': adminToken,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
