"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, UtensilsCrossed, QrCode, Settings } from "lucide-react"

interface AdminNavProps {
  adminToken: string
  currentPage: "dashboard" | "menu-builder" | "qr" | "settings"
}

export function AdminNav({ adminToken, currentPage }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: `/admin/${adminToken}/dashboard`,
      label: "Dashboard",
      icon: LayoutDashboard,
      active: currentPage === "dashboard",
    },
    {
      href: `/admin/${adminToken}/menu-builder`,
      label: "Menu",
      icon: UtensilsCrossed,
      active: currentPage === "menu-builder",
    },
    {
      href: `/admin/${adminToken}/qr`,
      label: "QR Code",
      icon: QrCode,
      active: currentPage === "qr",
    },
    {
      href: `/admin/${adminToken}/settings`,
      label: "Settings",
      icon: Settings,
      active: currentPage === "settings",
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="flex items-center gap-2 p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold hidden sm:inline">Admin</span>
        </div>

        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={item.active ? "default" : "ghost"}
            size="sm"
            className="whitespace-nowrap"
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
