import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  try {
    const response = await fetch(`${DJANGO_API_URL}/public/menu/${tableToken}`)
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const categories = await response.json()
    
    // Transform Django response to frontend format
    const transformedCategories = categories.map((cat: any) => ({
      id: cat.id.toString(),
      name: cat.name,
      sortOrder: cat.position,
      restaurantId: "1", // Would be from context
    }))
    
    const menuItems = categories.flatMap((cat: any) => 
      cat.items.map((item: any) => ({
        id: item.id.toString(),
        categoryId: cat.id.toString(),
        restaurantId: "1",
        name: item.name,
        description: item.description,
        price: item.price_cents / 100, // Convert cents to dollars for display
        image: item.image_url,
        available: item.available,
        options: item.options_json,
      }))
    )

    return NextResponse.json({
      categories: transformedCategories,
      menuItems,
    })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
