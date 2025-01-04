"use client"

import { useEffect, useState } from "react"
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
import api from '@/lib/axios'
import { DashboardStats, Subject } from '@/types/dashboard'

interface UserDashboardProps {
  user: {
    name: string
    email: string
  }
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Use the configured axios instance
        const [statsResponse, subjectsResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/subjects')
        ]);

        setStats(statsResponse.data);
        setSubjects(subjectsResponse.data.subjects || []);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your study materials and summaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.totalNotes || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.totalFolders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Summaries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.recentSummaries || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.totalSummaries || 0}
            </div>
          </CardContent>
        </Card>
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Subjects</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{subject.name}</span>
                    <BookOpen className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subject.description || 'No description available'}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{subject.totalTopics || 0} topics</span>
                    <span>{subject.totalQuestions || 0} questions</span>
                  </div>
                  <Button 
                    variant="default"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/subjects/${subject.id}`}>
                      View Subject
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <p>No subjects found. Start by creating a new subject.</p>
              <Button 
                variant="default"
                className="mt-4"
                asChild
              >
                <Link href="/subjects/new">
                  Create Subject
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
} 