"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Bill } from "@/lib/types"

interface ReceiptClientProps {
  tableToken: string
  restaurant: { name: string }
  bill: Bill | null
}

export function ReceiptClient({ tableToken, restaurant, bill }: ReceiptClientProps) {
  const { t } = useLanguage()

  // If no bill data, show error
  if (!bill) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t('noBillFound')}</p>
            <Button asChild className="w-full mt-4">
              <Link href={`/t/${tableToken}`}>{t('backToHome')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('paymentSuccessful')}</h1>
            <p className="text-muted-foreground mt-1">{t('thankYou')}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('paidOn')}: {new Date().toLocaleString()}
            </p>
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
                <span>{t('subtotal')}</span>
                <span>${bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('tax')}</span>
                <span>${bill.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('serviceFee')}</span>
                <span>${bill.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('tip')}</span>
                <span>${bill.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>{t('total')}</span>
                <span>${bill.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href={`/t/${tableToken}`}>{t('backToHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
