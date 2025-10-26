import { AdminOrdersView } from "@/components/admin-orders-view"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminOrdersPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <AdminNav adminToken={adminToken} currentPage="orders" />
      <div className="container mx-auto p-6">
        <AdminOrdersView adminToken={adminToken} />
      </div>
    </div>
  )
}
