import { QRCodeDisplay } from "@/components/qr-code-display"
import { AdminNav } from "@/components/admin-nav"

export default async function QRCodePage({ params }: { params: Promise<{ adminToken: string }> }) {
  const { adminToken } = await params

  return (
    <div className="min-h-screen bg-background">
      <AdminNav adminToken={adminToken} currentPage="qr" />
      <QRCodeDisplay adminToken={adminToken} />
    </div>
  )
}
