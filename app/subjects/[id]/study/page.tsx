"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Clock, File, Folder } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Resource = {
  id: string
  name: string
  description: string
  type: string
  url: string
  createdAt: string
}

type Folder = {
  id: string
  name: string
  type: 'Notes' | 'References' | 'PastQuestions'
  items: Resource[]
}

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Notes',
    type: 'Notes',
    items: [
      {
        id: '1',
        name: 'Chapter 1 Notes',
        description: 'Introduction to the subject',
        type: 'pdf',
        url: '#',
        createdAt: '2024-03-20'
      }
    ]
  },
  {
    id: '2',
    name: 'References',
    type: 'References',
    items: []
  },
  {
    id: '3',
    name: 'Past Questions',
    type: 'PastQuestions',
    items: []
  }
]

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [folders, setFolders] = useState<Folder[]>(mockFolders)
  const [studyTime, setStudyTime] = useState(0)
  const [isStudying, setIsStudying] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch folders
    const fetchFolders = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFolders(mockFolders)
      } catch (error) {
        console.error("Failed to fetch folders:", error)
        toast({
          title: "Error",
          description: "Failed to load study materials",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFolders()
  }, [toast])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isStudying) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isStudying])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleResourceClick = (resource: Resource) => {
    // Here you would typically handle opening/downloading the resource
    toast({
      title: "Opening Resource",
      description: `Opening ${resource.name}...`
    })
  }

  const handleEndStudy = async () => {
    setIsStudying(false)
    try {
      // Simulate API call to save study session
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Study Session Ended",
        description: `You studied for ${formatTime(studyTime)}`,
      })
      router.push(`/subjects/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save study session",
        variant: "destructive"
      })
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Session</h1>
            <p className="text-muted-foreground mt-1">Access your study materials</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="bg-muted">
              <CardContent className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(studyTime)}</span>
                </div>
              </CardContent>
            </Card>
            <Button
              variant={isStudying ? "destructive" : "default"}
              onClick={() => isStudying ? handleEndStudy() : setIsStudying(true)}
            >
              {isStudying ? "End Session" : "Start Session"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="Notes" className="w-full">
        <TabsList>
          <TabsTrigger value="Notes">Notes</TabsTrigger>
          <TabsTrigger value="References">References</TabsTrigger>
          <TabsTrigger value="PastQuestions">Past Questions</TabsTrigger>
        </TabsList>

        {folders.map(folder => (
          <TabsContent key={folder.id} value={folder.type} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {folder.items.length === 0 ? (
                <Card className="col-span-full p-8">
                  <div className="text-center text-muted-foreground">
                    <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Items Yet</h3>
                    <p>Add some study materials to get started</p>
                  </div>
                </Card>
              ) : (
                folder.items.map(item => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResourceClick(item)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <File className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 