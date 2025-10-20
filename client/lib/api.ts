const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchAdminAPI(endpoint: string, adminToken: string, options?: RequestInit) {
  return fetchAPI(endpoint, {
    ...options,
    headers: {
      "X-Admin-Token": adminToken,
      ...options?.headers,
    },
  })
}
