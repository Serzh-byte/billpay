import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
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

  const restaurant = contextData ? { name: "Demo Restaurant" } : { name: "Restaurant" }
  const bill = billData?.bill
  const settings = billData?.settings

  // If no bill data, show error
  if (!bill) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No receipt found</p>
            <Button asChild className="w-full mt-4">
              <Link href={`/t/${tableToken}`}>Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-muted-foreground mt-1">Thank you for dining with us</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {bill.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.menuItemName}
                  </span>
                  <span>${(item.lineTotal || (item.price * item.quantity)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${bill.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Fee</span>
                <span>${bill.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tip</span>
                <span>${bill.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Paid</span>
                <span>${bill.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href={`/t/${tableToken}`}>Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
