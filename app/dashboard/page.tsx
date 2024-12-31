"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./components/admin-dashboard"
import { UserDashboard } from "./components/user-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <LoadingSpinner />
  }

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {session.user.role === "admin" ? (
        <AdminDashboard user={session.user} />
      ) : (
        <UserDashboard user={session.user} />
      )}
    </div>
  )
} 