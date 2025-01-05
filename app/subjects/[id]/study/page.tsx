"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Book, Clock, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { backendUrl } from "@/lib/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Resource = {
  id: string
  name: string
  description: string
  type: string
  url: string
  createdAt: string
}

type Subject = {
  id: string
  name: string
  description: string
  lastStudied?: string
  totalStudyTime?: number
}

type Folder = {
  id: string
  name: string
  type: 'Notes' | 'References' | 'PastQuestions'
  items: Resource[]
}

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching subject and folders data...')
        
        // Fetch subject details
        const subjectResponse = await fetch(`/api/subjects/${params.id}`)
        const subjectData = await subjectResponse.json()
        console.log('Subject response:', subjectData)

        if (!subjectResponse.ok) {
          throw new Error(subjectData.error || 'Failed to fetch subject')
        }

        if (!subjectData.subject) {
          throw new Error('Invalid subject data received')
        }

        setSubject(subjectData.subject)

        // Fetch all resources from all folders
        const foldersResponse = await fetch(`/api/subjects/${params.id}/folders`)
        const foldersData = await foldersResponse.json()
        console.log('Folders response:', foldersData)

        if (!foldersResponse.ok) {
          throw new Error(foldersData.error || 'Failed to fetch resources')
        }

        if (!foldersData.folders || !Array.isArray(foldersData.folders)) {
          throw new Error('Invalid folders data received')
        }

        setFolders(foldersData.folders)
        setError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load study materials'
        console.error("Failed to fetch study data:", error)
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

    fetchData()
  }, [params.id, toast])

  useEffect(() => {
    // Only start tracking time if we have successfully loaded the data
    if (!isLoading && !error && subject) {
      console.log('Starting study session tracking...')
      setStudyStartTime(new Date())

      // Update elapsed time every second
      const timer = setInterval(() => {
        if (studyStartTime) {
          const now = new Date()
          setElapsedTime(Math.floor((now.getTime() - studyStartTime.getTime()) / 1000))
        }
      }, 1000)

      // Send study session data when component unmounts
      return () => {
        clearInterval(timer)
        if (studyStartTime) {
          const endTime = new Date()
          const duration = Math.round((endTime.getTime() - studyStartTime.getTime()) / 1000)
          
          console.log('Saving study session...', {
            startTime: studyStartTime.toISOString(),
            endTime: endTime.toISOString(),
            duration
          })

          // Send study session data to backend
          fetch(`/api/subjects/${params.id}/study-sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              startTime: studyStartTime.toISOString(),
              endTime: endTime.toISOString(),
              duration
            })
          }).then(response => {
            if (!response.ok) {
              throw new Error('Failed to save study session')
            }
            return response.json()
          }).then(data => {
            console.log('Study session saved:', data)
          }).catch(error => {
            console.error("Failed to save study session:", error)
            toast({
              title: "Warning",
              description: "Failed to save study session. Your progress may not be tracked.",
              variant: "destructive"
            })
          })
        }
      }
    }
  }, [params.id, studyStartTime, isLoading, error, subject, toast])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
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
          <h1 className="text-3xl font-bold">Study Session</h1>
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

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/subjects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subject
          </Link>
          <h1 className="text-3xl font-bold">{subject.name} - Study Session</h1>
          <p className="text-muted-foreground mt-1">{subject.description}</p>
        </div>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">No study materials available.</p>
              <p className="text-sm text-muted-foreground mt-2">Add some resources to start studying!</p>
              <Button className="mt-4" asChild>
                <Link href={`/subjects/${params.id}`}>
                  Add Resources
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{subject.name} - Study Session</h1>
            <p className="text-muted-foreground mt-1">{subject.description}</p>
          </div>
          <Card className="w-fit">
            <CardContent className="py-4 px-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-xl font-mono">{formatTime(elapsedTime)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue={folders[0]?.id} className="w-full">
        <TabsList className="w-full justify-start">
          {folders.map((folder) => (
            <TabsTrigger key={folder.id} value={folder.id} className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              {folder.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {folders.map((folder) => (
          <TabsContent key={folder.id} value={folder.id}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {folder.items.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Added {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <a href={`${backendUrl}${resource.url}`} target="_blank" rel="noopener noreferrer">
                          <Book className="mr-2 h-4 w-4" />
                          Study
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 