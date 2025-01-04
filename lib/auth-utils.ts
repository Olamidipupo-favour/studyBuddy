import { signOut } from "next-auth/react"

let isRedirecting = false

export const handleUnauthorized = async () => {
  // Prevent multiple redirects
  if (isRedirecting) return
  isRedirecting = true

  try {
    // Sign out the user which clears their session
    // Wait for signout to complete and force a redirect to /login
    await signOut({ 
      redirect: true,
      callbackUrl: '/login'
    })
  } catch (error) {
    console.error('Error during unauthorized handling:', error)
    // Fallback to direct navigation
    window.location.href = '/login'
  } finally {
    isRedirecting = false
  }
} 