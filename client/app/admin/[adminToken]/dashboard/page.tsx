import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Receipt } from "lucide-react"
import { AdminNav } from "@/components/admin-nav"
import { fetchAdminAPI } from "@/lib/api"
import type { DashboardStats } from "@/lib/types"

async function getDashboardStats(adminToken: string) {
  try {
    const data = await fetchAdminAPI("/admin/dashboard", adminToken)
    return data as DashboardStats
  } catch {
    return { openChecks: 0, todayRevenue: 0 }
  }
}

export default async function AdminDashboardPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params
  const stats = await getDashboardStats(adminToken)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav adminToken={adminToken} currentPage="dashboard" />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your restaurant</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Checks</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openChecks}</div>
              <p className="text-xs text-muted-foreground">Active tables with orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total sales for today</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
