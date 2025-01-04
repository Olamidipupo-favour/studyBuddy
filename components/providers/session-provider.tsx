"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const publicPaths = ['/login', '/signup']

  useEffect(() => {
    // Check if we're on a public path
    if (publicPaths.includes(pathname)) {
      return
    }

    // If session is loading, wait
    if (status === 'loading') {
      return
    }

    // If no session and not on a public path, redirect to login
    if (!session) {
      signOut({ redirect: true, callbackUrl: '/login' })
      return
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`
          }
        })

        if (!response.ok) {
          // Token is invalid, sign out
          await signOut({ redirect: true, callbackUrl: '/login' })
        }
      } catch (error) {
        console.error('Token validation error:', error)
        // On error, sign out
        await signOut({ redirect: true, callbackUrl: '/login' })
      }
    }

    validateToken()
  }, [session, status, pathname, router])

  return <>{children}</>
}

export function SessionProvider({ 
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) {
  return (
    <NextAuthSessionProvider {...props}>
      <SessionGuard>
        {children}
      </SessionGuard>
    </NextAuthSessionProvider>
  )
} 