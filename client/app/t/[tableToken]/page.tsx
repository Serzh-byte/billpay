import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function getTableContext(tableToken: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/public/table-context/${tableToken}`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching table context:", error)
  }
  return null
}

export default async function TableLandingPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params
  const context = await getTableContext(tableToken)

  // Invalid token - show error
  if (!context) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8 px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Table</AlertTitle>
              <AlertDescription>
                This table could not be found. Please scan the QR code at your table or check the URL.
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p><strong>Token used:</strong> {tableToken}</p>
              <p className="mt-4">
                <strong>For testing, use:</strong>
                <br />
                <Link href="/t/table1abc" className="text-primary hover:underline">
                  /t/table1abc
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const restaurant = context.restaurant

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 pb-8 px-6">
          <div className="flex flex-col items-center gap-6">
            {restaurant.logo ? (
              <img
                src={restaurant.logo || "/placeholder.svg"}
                alt={restaurant.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-primary" />
              </div>
            )}

            <div className="text-center">
              <h1 className="text-3xl font-bold text-balance">{restaurant.name}</h1>
              <p className="text-muted-foreground mt-2">Welcome to your table</p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-4">
              <Button asChild size="lg" className="w-full">
                <Link href={`/t/${tableToken}/menu`}>
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  View Menu
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                <Link href={`/t/${tableToken}/pay`}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay Bill
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
