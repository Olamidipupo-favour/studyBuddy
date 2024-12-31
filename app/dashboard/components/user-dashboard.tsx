"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function UserDashboard({ user }: { user: any }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">User Dashboard</h1>
      <p>Welcome, {user.name}</p>
    </div>
  )
} 