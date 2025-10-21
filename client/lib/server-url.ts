import { headers } from "next/headers"

/**
 * Get the base URL for API calls in server components
 * Uses the request headers to determine the current host
 */
export async function getServerApiUrl(): Promise<string> {
  // Get headers from the current request
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  
  if (host) {
    return `${protocol}://${host}`
  }
  
  // Fallback for local development
  return "http://localhost:3000"
}

/**
 * Build a full API URL for server-side fetches
 * Server components on Vercel need full URLs
 */
export async function buildApiUrl(path: string): Promise<string> {
  const baseUrl = await getServerApiUrl()
  const apiPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${apiPath}`
}
