import { PaymentView } from "@/components/payment-view"
import { buildApiUrl } from "@/lib/server-url"

async function getBillData(tableToken: string) {
  try {
    const apiUrl = await buildApiUrl(`/api/public/bill/${tableToken}`)
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bill:", error);
    return null;
  }
}

export default async function PayPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params
  const data = await getBillData(tableToken)

  const bill = data?.bill || null
  const settings = data?.settings || {
    taxPercent: 8.75,
    serviceFeePercent: 3,
    tipPresets: [0.15, 0.18, 0.20, 0.25],
  }

  // Mock restaurant and table data for now (would come from context API)
  const restaurant = { id: "1", name: "Demo Restaurant" }
  const table = { id: "1", restaurantId: "1", tableNumber: tableToken }

  return (
    <PaymentView restaurant={restaurant} table={table} tableToken={tableToken} initialBill={bill} settings={settings} />
  )
}
