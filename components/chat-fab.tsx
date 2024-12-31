'use client'

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/lib/auth-store"
import { useEffect, useState } from "react"

export default function ChatFAB() {
  const { data: session, status } = useSession()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!session && !!accessToken && status === "authenticated")
  }, [session, accessToken, status])

  if (!isAuthenticated) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <Link href="/chat">
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="sr-only">Open Chat</span>
          </Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

