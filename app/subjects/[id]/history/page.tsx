"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type StudySession = {
  id: string
  startTime: string
  endTime: string
  duration: number
  resourcesAccessed?: number
  progress?: number
  date?: string
}

export default function HistoryPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('Fetching study sessions...')
        const response = await fetch(`/api/subjects/${params.id}/study-sessions`)
        console.log('Response received:', response.status)
        const data = await response.json()
        console.log('Response data:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch study history')
        }

        if (!data.sessions || !Array.isArray(data.sessions)) {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from server')
        }

        // Transform and validate each session
        const transformedSessions = data.sessions
          .filter((session: any) => {
            // Validate required fields
            if (!session.id || !session.startTime || !session.duration) {
              console.warn('Invalid session data:', session)
              return false
            }
            return true
          })
          .map((session: StudySession) => {
            console.log('Processing session:', session)
            try {
              const date = new Date(session.startTime).toISOString().split('T')[0]
              return {
                ...session,
                date,
                resourcesAccessed: session.resourcesAccessed || 0,
                progress: session.progress || 0
              }
            } catch (error) {
              console.error('Error processing session:', error)
              return null
            }
          })
          .filter(Boolean) // Remove any null values from failed processing

        console.log('Transformed sessions:', transformedSessions)
        setSessions(transformedSessions)
        setError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load study history'
        console.error("Failed to fetch study history:", error)
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [params.id, toast])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0)
  }

  const getAverageProgress = () => {
    const sessionsWithProgress = sessions.filter(session => session.progress !== undefined)
    if (sessionsWithProgress.length === 0) return 0
    const totalProgress = sessionsWithProgress.reduce((total, session) => total + (session.progress || 0), 0)
    return Math.round(totalProgress / sessionsWithProgress.length)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/subjects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subject
          </Link>
          <h1 className="text-3xl font-bold">Study History</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress</p>
        </div>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <p className="text-lg text-destructive">{error}</p>
              <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/subjects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subject
          </Link>
          <h1 className="text-3xl font-bold">Study History</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress</p>
        </div>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">No study sessions recorded yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Start studying to track your progress!</p>
              <Button className="mt-4" asChild>
                <Link href={`/subjects/${params.id}/study`}>
                  Start Studying
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/subjects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subject
        </Link>
        <h1 className="text-3xl font-bold">Study History</h1>
        <p className="text-muted-foreground mt-1">Track your learning progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatDuration(getTotalStudyTime())}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{sessions.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{getAverageProgress()}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessions.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value}%`, 'Progress']}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sessions.slice().reverse().map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.resourcesAccessed} resources accessed
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDuration(session.duration)}</p>
                  <p className="text-sm text-muted-foreground">
                    Progress: {session.progress}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 