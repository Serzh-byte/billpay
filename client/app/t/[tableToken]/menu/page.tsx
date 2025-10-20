import { MenuView } from "@/components/menu-view"
import { getRestaurantData } from "@/lib/mock-data"

export default async function MenuPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  const mockData = getRestaurantData()
  const restaurant = mockData.restaurants[0]
  const table = mockData.tables[0]
  const menu = {
    categories: mockData.categories,
    items: mockData.menuItems,
  }

  return <MenuView restaurant={restaurant} table={table} tableToken={tableToken} menu={menu} />
}
