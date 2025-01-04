'use client'

import { useSession } from "next-auth/react"
import { useAuthStore } from "@/lib/auth-store"
import { useEffect, useState } from "react"
import { FAB } from "./fab"

export default function ChatFAB() {
  const { data: session, status } = useSession()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!session && !!accessToken && status === "authenticated")
  }, [session, accessToken, status])

  if (!isAuthenticated) return null

  return <FAB />
} 