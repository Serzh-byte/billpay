export interface Restaurant {
  id: string
  name: string
  logo?: string
}

export interface Table {
  id: string
  restaurantId: string
  tableNumber: string
}

export interface Category {
  id: string
  name: string
  sortOrder: number
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image?: string
  available: boolean
}

export interface BillItem {
  id: string
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
  lineTotal: number
  options?: Record<string, any>
  sessionId?: string
  orderedAt?: string
}

export interface Bill {
  id: string
  tableId: string
  items: BillItem[]
  subtotal: number
  tax: number
  serviceFee: number
  tip: number
  total: number
  status: "open" | "paid"
}

export interface Settings {
  taxPercent: number
  serviceFeePercent: number
  tipPresets: number[]
}

export interface DashboardStats {
  openChecks: number
  todayRevenue: number
}

export type PaymentMode = "full" | "split_even" | "mine_only"
