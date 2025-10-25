"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

interface TableLandingClientProps {
  tableToken: string
  restaurant: {
    name: string
    logo?: string
  } | null
}

export function TableLandingClient({ tableToken, restaurant }: TableLandingClientProps) {
  const { t } = useLanguage()

  // Invalid token - show error
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8 px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('invalidTable')}</AlertTitle>
              <AlertDescription>
                {t('invalidTableDesc')}
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p><strong>{t('tokenUsed')}:</strong> {tableToken}</p>
              <p className="mt-4">
                <strong>{t('forTesting')}:</strong>
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
              <p className="text-muted-foreground mt-2">{t('welcomeToTable')}</p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-4">
              <Button asChild size="lg" className="w-full">
                <Link href={`/t/${tableToken}/menu`}>
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  {t('viewMenu')}
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                <Link href={`/t/${tableToken}/pay`}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {t('payBill')}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
