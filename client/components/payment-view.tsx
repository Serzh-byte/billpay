"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Restaurant, Table, Bill, Settings, PaymentMode } from "@/lib/types"

interface PaymentViewProps {
  restaurant: Restaurant
  table: Table
  tableToken: string
  initialBill: Bill | null
  settings: Settings
}

export function PaymentView({ restaurant, table, tableToken, initialBill, settings }: PaymentViewProps) {
  const router = useRouter()
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("full")
  const [tipPercent, setTipPercent] = useState(15)
  const [customTip, setCustomTip] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!initialBill) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No bill found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const subtotal = initialBill.subtotal
  const tax = initialBill.tax
  const serviceFee = initialBill.serviceFee

  let amountToPay = subtotal + tax + serviceFee

  if (paymentMode === "split_even") {
    // For demo, assume 2 people
    amountToPay = amountToPay / 2
  } else if (paymentMode === "mine_only") {
    // For demo, use half the items
    amountToPay = amountToPay / 2
  }

  const tipAmount = customTip ? Number.parseFloat(customTip) : (amountToPay * tipPercent) / 100
  const total = amountToPay + tipAmount

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      router.push(`/t/${tableToken}/receipt`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/t/${tableToken}/menu`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Payment</h1>
            <p className="text-sm text-muted-foreground">{restaurant.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Payment Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMode} onValueChange={(value) => setPaymentMode(value as PaymentMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="flex-1 cursor-pointer">
                  Pay Full Bill
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="split_even" id="split_even" />
                <Label htmlFor="split_even" className="flex-1 cursor-pointer">
                  Split Evenly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mine_only" id="mine_only" />
                <Label htmlFor="mine_only" className="flex-1 cursor-pointer">
                  My Items Only
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Bill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${amountToPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax ({settings.taxPercent}%)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service Fee ({settings.serviceFeePercent}%)</span>
              <span>Included</span>
            </div>
          </CardContent>
        </Card>

        {/* Tip */}
        <Card>
          <CardHeader>
            <CardTitle>Add Tip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {settings.tipPresets.map((preset) => (
                <Button
                  key={preset}
                  variant={tipPercent === preset && !customTip ? "default" : "outline"}
                  onClick={() => {
                    setTipPercent(preset)
                    setCustomTip("")
                  }}
                >
                  {preset}%
                </Button>
              ))}
            </div>
            <div>
              <Label htmlFor="custom-tip">Custom Amount</Label>
              <Input
                id="custom-tip"
                type="number"
                placeholder="0.00"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>Tip Amount</span>
              <span className="font-semibold">${tipAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-bold">${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Confirm Payment"}
        </Button>
      </div>
    </div>
  )
}
