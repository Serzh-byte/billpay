import { SettingsForm } from "@/components/settings-form"
import { AdminNav } from "@/components/admin-nav"
import { fetchAdminAPI } from "@/lib/api"
import type { Settings } from "@/lib/types"

async function getSettings(adminToken: string) {
  try {
    const data = await fetchAdminAPI("/admin/settings", adminToken)
    return {
      taxPercent: data?.taxPercent || 8.75,
      serviceFeePercent: data?.serviceFeePercent || 3,
      tipPresets: data?.tipPresets || [15, 18, 20, 25]
    } as Settings
  } catch {
    return { taxPercent: 8.75, serviceFeePercent: 3, tipPresets: [15, 18, 20, 25] }
  }
}

export default async function SettingsPage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params
  const settings = await getSettings(adminToken)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav adminToken={adminToken} currentPage="settings" />
      <SettingsForm adminToken={adminToken} initialSettings={settings} />
    </div>
  )
}
