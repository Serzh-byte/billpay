/**
 * Session management for tracking individual customers at a table
 * Each customer gets a unique session ID stored in localStorage
 */

const SESSION_KEY = 'billpay_session_id'

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get or create a session ID for this customer
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return ''
  }

  let sessionId = localStorage.getItem(SESSION_KEY)
  
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  
  return sessionId
}

/**
 * Clear the current session (e.g., when customer leaves the restaurant)
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

/**
 * Check if user has an active session
 */
export function hasSession(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return !!localStorage.getItem(SESSION_KEY)
}
