'use client'

import { useAuthStore } from "@/lib/auth-store"
import { useSession } from "next-auth/react"

export function DebugAuth() {
  const { data: session } = useSession()
  const { accessToken, refreshToken } = useAuthStore()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <pre>
        Session: {JSON.stringify(session, null, 2)}
        {'\n'}
        Tokens: {JSON.stringify({ accessToken, refreshToken }, null, 2)}
      </pre>
    </div>
  )
} 