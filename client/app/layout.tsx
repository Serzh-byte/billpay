import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant QR Dining",
  description: "Scan, order, and pay with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <div className="relative min-h-screen">
            <div className="absolute top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
