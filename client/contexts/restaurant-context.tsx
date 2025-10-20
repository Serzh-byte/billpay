"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Restaurant, Table } from "@/lib/types"

interface RestaurantContextType {
  restaurant: Restaurant | null
  table: Table | null
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  table: null,
})

export function RestaurantProvider({
  children,
  restaurant,
  table,
}: {
  children: ReactNode
  restaurant: Restaurant | null
  table: Table | null
}) {
  return <RestaurantContext.Provider value={{ restaurant, table }}>{children}</RestaurantContext.Provider>
}

export function useRestaurant() {
  return useContext(RestaurantContext)
}
