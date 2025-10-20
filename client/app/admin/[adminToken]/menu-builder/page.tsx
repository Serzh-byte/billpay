import { MenuBuilder } from "@/components/menu-builder"
import { AdminNav } from "@/components/admin-nav"
import { fetchAdminAPI } from "@/lib/api"
import type { Category, MenuItem } from "@/lib/types"

async function getMenu(adminToken: string) {
  try {
    const data = await fetchAdminAPI("/admin/menu", adminToken)
    return data as { categories: Category[]; items: MenuItem[] }
  } catch {
    return { categories: [], items: [] }
  }
}

export default async function MenuBuilderPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params
  const menu = await getMenu(adminToken)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav adminToken={adminToken} currentPage="menu-builder" />
      <MenuBuilder adminToken={adminToken} initialMenu={menu} />
    </div>
  )
}
