import type { Restaurant, Table, Category, MenuItem, Bill, Settings } from "./types"

// Mock data store (in a real app, this would be a database)
const mockData = {
  restaurants: [
    {
      id: "rest1",
      name: "The Golden Fork",
      logo: "/restaurant-logo.png",
    },
  ] as Restaurant[],
  tables: [
    { id: "table1", restaurantId: "rest1", tableNumber: "1" },
    { id: "table2", restaurantId: "rest1", tableNumber: "2" },
    { id: "table3", restaurantId: "rest1", tableNumber: "3" },
    { id: "table4", restaurantId: "rest1", tableNumber: "4" },
    { id: "table5", restaurantId: "rest1", tableNumber: "5" },
  ] as Table[],
  categories: [
    { id: "cat1", restaurantId: "rest1", name: "Appetizers", sortOrder: 0 },
    { id: "cat2", restaurantId: "rest1", name: "Main Courses", sortOrder: 1 },
    { id: "cat3", restaurantId: "rest1", name: "Desserts", sortOrder: 2 },
    { id: "cat4", restaurantId: "rest1", name: "Beverages", sortOrder: 3 },
  ] as (Category & { restaurantId: string })[],
  menuItems: [
    {
      id: "item1",
      restaurantId: "rest1",
      categoryId: "cat1",
      name: "Bruschetta",
      description: "Toasted bread with tomatoes, garlic, and basil",
      price: 8.99,
      image: "/classic-bruschetta.png",
      available: true,
    },
    {
      id: "item2",
      restaurantId: "rest1",
      categoryId: "cat1",
      name: "Calamari",
      description: "Crispy fried squid with marinara sauce",
      price: 12.99,
      image: "/fried-calamari.png",
      available: true,
    },
    {
      id: "item3",
      restaurantId: "rest1",
      categoryId: "cat2",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon butter sauce",
      price: 24.99,
      image: "/grilled-salmon-plate.png",
      available: true,
    },
    {
      id: "item4",
      restaurantId: "rest1",
      categoryId: "cat2",
      name: "Ribeye Steak",
      description: "12oz prime ribeye with garlic mashed potatoes",
      price: 32.99,
      image: "/grilled-ribeye.png",
      available: true,
    },
    {
      id: "item5",
      restaurantId: "rest1",
      categoryId: "cat3",
      name: "Tiramisu",
      description: "Classic Italian dessert with espresso and mascarpone",
      price: 7.99,
      image: "/classic-tiramisu.png",
      available: true,
    },
    {
      id: "item6",
      restaurantId: "rest1",
      categoryId: "cat4",
      name: "House Wine",
      description: "Red or white wine by the glass",
      price: 9.99,
      available: true,
    },
  ] as (MenuItem & { restaurantId: string })[],
  bills: [] as Bill[],
  settings: {
    taxPercent: 8,
    serviceFeePercent: 5,
    tipPresets: [15, 18, 20, 25],
  } as Settings,
}

export function getRestaurantData() {
  return mockData
}

export function updateMenu(
  categories: (Category & { restaurantId: string })[],
  menuItems: (MenuItem & { restaurantId: string })[],
) {
  mockData.categories = categories
  mockData.menuItems = menuItems
}

export function updateSettings(settings: Settings) {
  mockData.settings = settings
}

export function updateBillStatus(billId: string, status: "open" | "paid", tip?: number) {
  const bill = mockData.bills.find((b) => b.id === billId)
  if (bill) {
    bill.status = status
    if (tip !== undefined) {
      bill.tip = tip
      bill.total = bill.subtotal + bill.tax + bill.serviceFee + tip
    }
  }
}
