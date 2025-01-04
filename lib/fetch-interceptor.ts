import { handleUnauthorized } from "./auth-utils"

let isHandlingUnauthorized = false

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const response = await fetch(input, init)
    
    // Try to parse response as JSON to check for error messages
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.clone().json()
    }
    
    // Check both status code and error message
    if ((response.status === 401 || 
        (data && (data.error === 'Unauthorized' || data.error === 'Session expired'))) && 
        !isHandlingUnauthorized) {
      isHandlingUnauthorized = true
      try {
        await handleUnauthorized()
      } finally {
        isHandlingUnauthorized = false
      }
      throw new Error('Unauthorized')
    }
    
    return response
  } catch (error) {
    // If it's already an unauthorized error, don't handle it again
    if (error instanceof Error && error.message === 'Unauthorized') {
      throw error
    }
    
    // For network errors, check if it's a CORS or network issue that might indicate an expired session
    if (error instanceof TypeError && error.message.includes('Failed to fetch') && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true
      try {
        await handleUnauthorized()
      } finally {
        isHandlingUnauthorized = false
      }
      throw new Error('Unauthorized')
    }
    // Otherwise, pass through the error
    throw error
  }
} 