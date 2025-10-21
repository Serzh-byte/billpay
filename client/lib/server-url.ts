/**
 * Get the base URL for API calls in server components
 * Works in both development and production (Vercel)
 */
export function getServerApiUrl(): string {
  // In production (Vercel), use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // In development, use localhost
  return "http://localhost:3000"
}

/**
 * Build a full API URL for server-side fetches
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getServerApiUrl()
  const apiPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${apiPath}`
}
