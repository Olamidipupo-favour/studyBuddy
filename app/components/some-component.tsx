"use client"

import { useSession } from "next-auth/react"
import { fetchWithAuth } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

export function SomeComponent() {
  const { data: session } = useSession()
  const accessToken = useAuthStore(state => state.accessToken)

  // Now you can check both session and token
  if (!session || !accessToken) {
    return <div>Please log in</div>
  }

  const handleAction = async () => {
    try {
      const data = await fetchWithAuth('/api/protected-route', {
        method: 'POST',
        body: JSON.stringify({ some: 'data' }),
      })
      // Handle response
    } catch (error) {
      // Handle error
    }
  }
} 