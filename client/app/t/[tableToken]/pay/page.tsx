import { PaymentView } from "@/components/payment-view"
import { getRestaurantData } from "@/lib/mock-data"

export default async function PayPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  const mockData = getRestaurantData()
  const restaurant = mockData.restaurants[0]
  const table = mockData.tables[0]
  const bill = mockData.bills.find((b) => b.tableId === table.id) || null
  const settings = mockData.settings

  return (
    <PaymentView restaurant={restaurant} table={table} tableToken={tableToken} initialBill={bill} settings={settings} />
  )
}
