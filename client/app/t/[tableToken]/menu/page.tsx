import { MenuView } from "@/components/menu-view"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

async function getMenuData(tableToken: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/public/menu/${tableToken}`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching menu:", error)
  }
  return null
}

async function getTableContext(tableToken: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/public/table-context/${tableToken}`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching context:", error)
  }
  return null
}

export default async function MenuPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  const menuData = await getMenuData(tableToken)
  const context = await getTableContext(tableToken)

  // Invalid token or no data
  if (!context || !menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Table Not Found</AlertTitle>
              <AlertDescription>
                This table could not be found. Please scan the QR code at your table.
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p><strong>Token used:</strong> {tableToken}</p>
              <p className="mt-4">
                <strong>For testing, use:</strong>
                <br />
                <Link href="/t/table1abc/menu" className="text-primary hover:underline">
                  /t/table1abc/menu
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const restaurant = context.restaurant
  const table = context.table
  const menu = {
    categories: menuData.categories || [],
    items: menuData.menuItems || [],
  }

  return <MenuView restaurant={restaurant} table={table} tableToken={tableToken} menu={menu} />
}
