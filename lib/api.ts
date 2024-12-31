import { useAuthStore } from './auth-store'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = useAuthStore.getState().accessToken
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  
  return response
} 