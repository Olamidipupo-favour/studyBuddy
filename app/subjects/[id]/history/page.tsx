"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
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
  date: string
  duration: number
  resourcesAccessed: number
  progress: number
}

const mockSessions: StudySession[] = [
  {
    id: '1',
    date: '2024-03-20',
    duration: 3600, // 1 hour in seconds
    resourcesAccessed: 3,
    progress: 65
  },
  {
    id: '2',
    date: '2024-03-19',
    duration: 5400, // 1.5 hours in seconds
    resourcesAccessed: 5,
    progress: 60
  },
  {
    id: '3',
    date: '2024-03-18',
    duration: 7200, // 2 hours in seconds
    resourcesAccessed: 4,
    progress: 55
  }
]

export default function HistoryPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState<StudySession[]>([])

  useEffect(() => {
    // Simulate API call to fetch study history
    const fetchHistory = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSessions(mockSessions)
      } catch (error) {
        console.error("Failed to fetch study history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0)
  }

  const getAverageProgress = () => {
    if (sessions.length === 0) return 0
    const totalProgress = sessions.reduce((total, session) => total + session.progress, 0)
    return Math.round(totalProgress / sessions.length)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
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
            {sessions.map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">
                    {new Date(session.date).toLocaleDateString()}
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