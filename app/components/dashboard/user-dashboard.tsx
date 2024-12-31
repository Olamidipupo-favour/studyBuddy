"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Clock, 
  Calendar,
  Star,
  FileText,
  FolderOpen,
  Files 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserDashboardProps {
  user: {
    name: string
    email: string
  }
}

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... existing welcome section ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... existing cards ... */}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Note Summaries</span>
              <FileText className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate and view summaries of your study notes
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default"
                className="w-full"
                asChild
              >
                <Link href="/summaries/notes">
                  View Note Summaries
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Folder Summaries</span>
              <FolderOpen className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View consolidated summaries by folder
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default"
                className="w-full"
                asChild
              >
                <Link href="/summaries/folders">
                  View Folder Summaries
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Complete Overview</span>
              <Files className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get a complete summary of all your study materials
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default"
                className="w-full"
                asChild
              >
                <Link href="/summaries/overview">
                  View Complete Summary
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 