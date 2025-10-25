import { buildApiUrl } from "@/lib/server-url"
import { TableLandingClient } from "@/components/table-landing-client"

async function getTableContext(tableToken: string) {
  try {
    const url = await buildApiUrl(`/api/public/table-context/${tableToken}`)
    const response = await fetch(url, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching table context:", error)
  }
  return null
}

export default async function TableLandingPage({ params }: { params: Promise<{ tableToken: string }> }) {
  const { tableToken } = await params
  const context = await getTableContext(tableToken)

  const restaurant = context?.restaurant || null

  return <TableLandingClient tableToken={tableToken} restaurant={restaurant} />
}
