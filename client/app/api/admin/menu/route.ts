import { type NextRequest, NextResponse } from "next/server"

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${DJANGO_API_URL}/admin/menu/categories`, {
      headers: {
        "X-Admin-Token": adminToken,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const categories = await response.json()

    // Transform to frontend format
    const transformedCategories = categories.map((cat: any) => ({
      id: cat.id.toString(),
      name: cat.name,
      sortOrder: cat.position,
      restaurantId: "1",
    }))

    const menuItems = categories.flatMap((cat: any) =>
      cat.items.map((item: any) => ({
        id: item.id.toString(),
        categoryId: cat.id.toString(),
        restaurantId: "1",
        name: item.name,
        description: item.description,
        price: item.price_cents / 100,
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

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.headers.get("X-Admin-Token")

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { categories, menuItems } = body

    // Update categories
    for (const category of categories) {
      if (category.id && !category.id.startsWith("temp-")) {
        // Update existing category
        await fetch(`${DJANGO_API_URL}/admin/menu/categories/${category.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Token": adminToken,
          },
          body: JSON.stringify({
            name: category.name,
            position: category.sortOrder,
          }),
        })
      } else {
        // Create new category
        await fetch(`${DJANGO_API_URL}/admin/menu/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Token": adminToken,
          },
          body: JSON.stringify({
            name: category.name,
            position: category.sortOrder,
          }),
        })
      }
    }

    // Update menu items
    for (const item of menuItems) {
      const itemData = {
        category: parseInt(item.categoryId),
        name: item.name,
        description: item.description,
        price_cents: Math.round(item.price * 100),
        image_url: item.image || "",
        available: item.available,
        options_json: item.options || {},
      }

      if (item.id && !item.id.startsWith("temp-")) {
        // Update existing item
        await fetch(`${DJANGO_API_URL}/admin/menu/items/${item.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Token": adminToken,
          },
          body: JSON.stringify(itemData),
        })
      } else {
        // Create new item
        await fetch(`${DJANGO_API_URL}/admin/menu/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Token": adminToken,
          },
          body: JSON.stringify(itemData),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Menu updated successfully",
    })
  } catch (error) {
    console.error("Error updating menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
