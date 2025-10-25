import { buildApiUrl } from "@/lib/server-url"
import { ReceiptClient } from "@/components/receipt-client"

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

async function getTableContext(tableToken: string) {
  try {
    const apiUrl = await buildApiUrl(`/api/public/table-context/${tableToken}`)
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
    console.error("Error fetching table context:", error);
    return null;
  }
}

export default async function ReceiptPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  const contextData = await getTableContext(tableToken)
  const billData = await getBillData(tableToken)

  const restaurant = contextData?.restaurant || { name: "Restaurant" }
  const bill = billData?.bill || null

  return <ReceiptClient tableToken={tableToken} restaurant={restaurant} bill={bill} />
}
