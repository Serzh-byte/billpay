"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import QRCode from "react-qr-code"
import { fetchAdminAPI } from "@/lib/api"
import type { Restaurant, Table } from "@/lib/types"

interface QRCodeDisplayProps {
  adminToken: string
}

export function QRCodeDisplay({ adminToken }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTables() {
      try {
        const data = await fetchAdminAPI("/admin/tables", adminToken)
        setRestaurant(data.restaurant)
        setTables(data.tables)
      } catch (error) {
        console.error("[v0] Failed to fetch tables:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTables()
  }, [adminToken])

  const handleCopy = async (url: string, tableNumber: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(tableNumber)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleDownload = (tableNumber: string, url: string) => {
    // Create a canvas to render the QR code
    const svg = document.getElementById(`qr-${tableNumber}`)
    if (!svg) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url2 = URL.createObjectURL(svgBlob)

    img.onload = () => {
      canvas.width = 512
      canvas.height = 512
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, 512, 512)
      ctx.drawImage(img, 0, 0, 512, 512)
      URL.revokeObjectURL(url2)

      canvas.toBlob((blob) => {
        if (blob) {
          const url3 = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url3
          a.download = `table-${tableNumber}-qr.png`
          a.click()
          URL.revokeObjectURL(url3)
        }
      })
    }

    img.src = url2
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <p className="text-muted-foreground">Loading tables...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">QR Codes</h1>
        <p className="text-muted-foreground">Generate QR codes for each table</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tables.map((table) => {
          const tableToken = `${table.restaurantId}-${table.tableNumber}`
          const dinerUrl =
            typeof window !== "undefined"
              ? `${window.location.origin}/t/${tableToken}`
              : `https://example.com/t/${tableToken}`

          return (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle>Table {table.tableNumber}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <QRCode id={`qr-${table.tableNumber}`} value={dinerUrl} size={200} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Diner Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dinerUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(dinerUrl, table.tableNumber)}
                      title="Copy link"
                    >
                      {copied === table.tableNumber ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleDownload(table.tableNumber, dinerUrl)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tables.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No tables found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
