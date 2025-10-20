import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getRestaurantData } from "@/lib/mock-data"

export default async function ReceiptPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params

  const mockData = getRestaurantData()
  const restaurant = mockData.restaurants[0]

  // Mock receipt data
  const receipt = {
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 14.99 },
      { name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
    subtotal: 23.98,
    tax: 2.04,
    serviceFee: 0.72,
    tip: 3.6,
    total: 30.34,
    timestamp: new Date().toLocaleString(),
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
            <p className="text-sm text-muted-foreground">{receipt.timestamp}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Fee</span>
                <span>${receipt.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tip</span>
                <span>${receipt.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Paid</span>
                <span>${receipt.total.toFixed(2)}</span>
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
