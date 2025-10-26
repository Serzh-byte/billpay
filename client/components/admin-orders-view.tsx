"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translateMenuItemName } from "@/lib/translations"

interface OrderItem {
  id: string
  name: string
  qty: number
  price: number
  lineTotal: number
  orderedAt: string | null
  sessionId: string
}

interface OrderSession {
  [sessionId: string]: OrderItem[]
}

interface Order {
  billId: number
  tableNumber: string
  tableName: string
  subtotal: number
  tax: number
  serviceFee: number
  total: number
  createdAt: string
  updatedAt: string
  sessionCount: number
  sessions: OrderSession
  allItems: OrderItem[]
}

interface OrdersData {
  orders: Order[]
  totalOpenBills: number
}

export function AdminOrdersView({ adminToken }: { adminToken: string }) {
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useLanguage()

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // Use Next.js API route which will proxy to Django
      const apiUrl = '/api/admin/orders'
      
      console.log('Fetching orders from:', apiUrl)
      console.log('Admin token:', adminToken)
      
      const response = await fetch(apiUrl, {
        headers: {
          'X-Admin-Token': adminToken,
        },
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      console.log('Orders data:', data)
      setOrdersData(data)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000)
    
    return () => clearInterval(interval)
  }, [adminToken])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading && !ordersData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={fetchOrders} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('activeOrders')}</h2>
          <p className="text-muted-foreground">
            {ordersData?.totalOpenBills || 0} {ordersData?.totalOpenBills === 1 ? t('openTable') : t('openTables')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
        </div>
      </div>

      {!ordersData?.orders || ordersData.orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t('noActiveOrders')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ordersData.orders.map((order) => (
            <Card key={order.billId} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.tableName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.tableNumber}</p>
                  </div>
                  <Badge variant="secondary">
                    {order.sessionCount} {order.sessionCount === 1 ? t('customer') : t('customers')}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('startedAt')}: {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* All Items */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">{t('orderItems')}</h4>
                  <div className="space-y-2">
                    {order.allItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{translateMenuItemName(language, item.name)}</span>
                          <span className="text-muted-foreground"> x{item.qty}</span>
                          {item.orderedAt && (
                            <div className="text-xs text-muted-foreground">
                              {formatTime(item.orderedAt)}
                            </div>
                          )}
                        </div>
                        <span className="font-semibold">${item.lineTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Bill Summary */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('tax')}</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('serviceFee')}</span>
                    <span>${order.serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>{t('total')}</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Session Breakdown if multiple customers */}
                {order.sessionCount > 1 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('byCustomer')}</h4>
                      <div className="space-y-2">
                        {Object.entries(order.sessions).map(([sessionId, items], index) => (
                          <div key={sessionId} className="text-xs">
                            <div className="font-medium text-muted-foreground mb-1">
                              {t('customer')} {index + 1}:
                            </div>
                            <ul className="space-y-1 ml-2">
                              {items.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                  <span>{translateMenuItemName(language, item.name)} x{item.qty}</span>
                                  <span>${item.lineTotal.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
