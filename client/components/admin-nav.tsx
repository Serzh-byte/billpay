"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Menu, QrCode, Settings, ClipboardList, UtensilsCrossed } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

interface AdminNavProps {
  adminToken: string
  currentPage?: string
}

export function AdminNav({ adminToken, currentPage }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: `/admin/${adminToken}/dashboard`,
      label: "Dashboard",
      icon: LayoutDashboard,
      active: currentPage === "dashboard" || pathname.includes("/dashboard"),
    },
    {
      href: `/admin/${adminToken}/orders`,
      label: "Orders",
      icon: ClipboardList,
      active: currentPage === "orders" || pathname.includes("/orders"),
    },
    {
      href: `/admin/${adminToken}/menu-builder`,
      label: "Menu",
      icon: Menu,
      active: currentPage === "menu-builder" || pathname.includes("/menu-builder"),
    },
    {
      href: `/admin/${adminToken}/qr`,
      label: "QR Code",
      icon: QrCode,
      active: currentPage === "qr" || pathname.includes("/qr"),
    },
    {
      href: `/admin/${adminToken}/settings`,
      label: "Settings",
      icon: Settings,
      active: currentPage === "settings" || pathname.includes("/settings"),
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hide">
          <div className="flex items-center gap-2 mr-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold hidden sm:inline">Admin</span>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
