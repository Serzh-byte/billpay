"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, ShoppingBag, Plus, Minus, X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { translateCategoryName, translateMenuItemName, translateMenuItemDescription } from "@/lib/translations"
import { getSessionId } from "@/lib/session"
import type { Restaurant, Table, MenuItem, Category, Bill } from "@/lib/types"

interface MenuViewProps {
  restaurant: Restaurant
  table: Table
  tableToken: string
  menu: { categories: Category[]; items: MenuItem[] }
}

export function MenuView({ restaurant, table, tableToken, menu }: MenuViewProps) {
  const { t, language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [bill, setBill] = useState<Bill | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch bill on mount
  useEffect(() => {
    fetchBill()
  }, [tableToken])

  const fetchBill = async () => {
    try {
      const response = await fetch(`/api/public/bill/${tableToken}`)
      if (response.ok) {
        const data = await response.json()
        setBill(data.bill)
      }
    } catch (error) {
      console.error("Error fetching bill:", error)
    }
  }

  const filteredItems = selectedCategory
    ? menu.items.filter((item) => item.categoryId === selectedCategory && item.available)
    : menu.items.filter((item) => item.available)

  const handleAddToBill = async () => {
    if (!selectedItem) return
    setIsLoading(true)

    try {
      const sessionId = getSessionId() // Get or create session ID
      
      const response = await fetch(`/api/public/bill/${tableToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          quantity,
          options: {},
          sessionId, // Send session ID with the order
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBill(data.bill)
        setSelectedItem(null)
        setQuantity(1)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Failed to add item to bill:", response.status, errorData)
        alert(`Failed to add item: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error adding item to bill:", error)
      alert(`Error adding item: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromBill = async (lineId: string) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const response = await fetch(`/api/public/bill/${tableToken}/items/${lineId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const data = await response.json()
        setBill(data.bill)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Failed to remove item:", response.status, errorData)
        alert(`Failed to remove item: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error removing item:", error)
      alert(`Error removing item: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const billItemCount = bill?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/t/${tableToken}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground">{t('menu')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex gap-2 p-4 overflow-x-auto">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            {t('all')}
          </Button>
          {menu.categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {translateCategoryName(language, category.name)}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                {item.image && (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-pretty">{translateMenuItemName(language, item.name)}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{translateMenuItemDescription(language, item.description)}</p>
                  <p className="font-semibold text-primary mt-2">${item.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bill Drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="fixed bottom-4 right-4 left-4 shadow-lg h-14">
            <ShoppingBag className="mr-2 h-5 w-5" />
            {t('viewBill')} {billItemCount > 0 && `(${billItemCount})`}
            {bill && <span className="ml-auto font-bold">${bill.total.toFixed(2)}</span>}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle>{t('yourBill')}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {bill?.items && bill.items.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {bill.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{translateMenuItemName(language, item.menuItemName)}</p>
                        <p className="text-xs text-muted-foreground">{t('qty')}: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm whitespace-nowrap">
                          ${(item.lineTotal || (item.price * item.quantity)).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => handleRemoveFromBill(item.id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>{t('total')}</span>
                    <span>${bill.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href={`/t/${tableToken}/pay`}>{t('goToPayment')}</Link>
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{t('noItemsYet')}</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? translateMenuItemName(language, selectedItem.name) : ''}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.image && (
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-full h-48 rounded-lg object-cover"
                />
              )}
              <p className="text-muted-foreground text-pretty">{translateMenuItemDescription(language, selectedItem.description)}</p>
              <p className="text-2xl font-bold text-primary">${selectedItem.price.toFixed(2)}</p>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToBill} disabled={isLoading}>
                {isLoading ? t('adding') : `${t('addToBill')} - $${(selectedItem.price * quantity).toFixed(2)}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
