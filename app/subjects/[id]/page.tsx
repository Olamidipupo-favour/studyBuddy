"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Clock, Target, FolderPlus, File, Plus, Book, PenTool, History, Trash2 } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Subject = {
  id: string
  name: string
  description: string
  progress: number
  goals: Goal[]
}

type Folder = {
  id: string
  name: string
  type: 'Notes' | 'References' | 'PastQuestions'
  items: Resource[]
}

type Resource = {
  id: string
  name: string
  description: string
  type: string
  url: string
  createdAt: string
}

type Goal = {
  id: string
  title: string
  dueDate: string
  completed: boolean
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

export default function SubjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [folders, setFolders] = useState<Folder[]>(mockFolders)
  const [showNewResourceModal, setShowNewResourceModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    file: null as File | null
  })
  const [newFolder, setNewFolder] = useState({
    name: "",
    type: "Notes" as Folder["type"]
  })
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    dueDate: ""
  })
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)

  useEffect(() => {
    // Simulate API call to fetch subject details
    const fetchSubject = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSubject({
          id: params.id as string,
          name: "Mathematics",
          description: "Advanced Calculus",
          progress: 65,
          goals: []
        })
      } catch (error) {
        console.error("Failed to fetch subject details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubject()
  }, [params.id])

  const handleStartStudying = () => {
    router.push(`/subjects/${params.id}/study`)
  }

  const handleViewHistory = () => {
    router.push(`/subjects/${params.id}/history`)
  }

  const handleAddResource = async () => {
    if (!newResource.name || !newResource.description || !selectedFolder) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const resource: Resource = {
        id: Math.random().toString(36).substring(7),
        name: newResource.name,
        description: newResource.description,
        type: newResource.file?.type || 'unknown',
        url: '#',
        createdAt: new Date().toISOString()
      }

      setFolders(prev => prev.map(folder => 
        folder.id === selectedFolder.id 
          ? { ...folder, items: [...folder.items, resource] }
          : folder
      ))

      setShowNewResourceModal(false)
      setNewResource({ name: "", description: "", file: null })
      setSelectedFolder(null)

      toast({
        title: "Success",
        description: "Resource added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive"
      })
    }
  }

  const handleAddFolder = async () => {
    if (!newFolder.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a folder name",
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const folder: Folder = {
        id: Math.random().toString(36).substring(7),
        name: newFolder.name,
        type: newFolder.type,
        items: []
      }

      setFolders(prev => [...prev, folder])
      setShowNewFolderModal(false)
      setNewFolder({ name: "", type: "Notes" })

      toast({
        title: "Success",
        description: "Folder created successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive"
      })
    }
  }

  const handleStartQuiz = () => {
    router.push(`/subjects/${params.id}/quiz`)
  }

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const goal: Goal = {
        id: Math.random().toString(36).substring(7),
        title: newGoal.title,
        dueDate: newGoal.dueDate,
        completed: false
      }

      setSubject(prev => prev ? {
        ...prev,
        goals: [...(prev.goals || []), goal]
      } : null)

      setShowNewGoalModal(false)
      setNewGoal({ title: "", dueDate: "" })

      toast({
        title: "Success",
        description: "Goal added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive"
      })
    }
  }

  const handleDeleteFolder = async (folder: Folder) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setFolders(prev => prev.filter(f => f.id !== folder.id))
      setFolderToDelete(null)

      toast({
        title: "Success",
        description: "Folder deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete folder",
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Resource Modal */}
      <Dialog open={showNewResourceModal} onOpenChange={setShowNewResourceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Upload a new resource to your selected folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resource-name">Resource Name</Label>
              <Input
                id="resource-name"
                value={newResource.name}
                onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Chapter 1 Notes"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resource-description">Description</Label>
              <Textarea
                id="resource-description"
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the resource..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resource-file">File</Label>
              <Input
                id="resource-file"
                type="file"
                onChange={(e) => setNewResource(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewResourceModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Folder Modal */}
      <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your resources.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolder.name}
                onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Chapter 1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder-type">Folder Type</Label>
              <select
                id="folder-type"
                className="w-full p-2 border rounded-md"
                value={newFolder.type}
                onChange={(e) => setNewFolder(prev => ({ ...prev, type: e.target.value as Folder["type"] }))}
              >
                <option value="Notes">Notes</option>
                <option value="References">References</option>
                <option value="PastQuestions">Past Questions</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Goal Modal */}
      <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Set a new learning goal for this subject.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Complete Chapter 5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-date">Due Date</Label>
              <Input
                id="goal-date"
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGoalModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Confirmation */}
      <AlertDialog open={!!folderToDelete} onOpenChange={(open) => !open && setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the folder "{folderToDelete?.name}" and all its contents.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => folderToDelete && handleDeleteFolder(folderToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-muted-foreground mt-1">{subject.description}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleViewHistory}>
            <History className="mr-2 h-4 w-4" />
            Study History
          </Button>
          <Button onClick={handleStartStudying}>
            <BookOpen className="mr-2 h-4 w-4" />
            Start Studying
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{subject.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 hrs</div>
            <p className="text-xs text-muted-foreground">
              Total time spent studying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowNewGoalModal(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {subject.goals && subject.goals.length > 0 ? (
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span>{subject.goals[0].title}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due on {new Date(subject.goals[0].dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-5 w-5" />
                <span>No goals set</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Study Materials</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowNewFolderModal(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button onClick={handleStartQuiz}>
              <PenTool className="mr-2 h-4 w-4" />
              Take Quiz
            </Button>
          </div>
        </div>

        <Tabs defaultValue={folders[0]?.type} className="w-full">
          <TabsList className="flex-wrap">
            {folders.map(folder => (
              <div key={folder.id} className="flex items-center">
                <TabsTrigger value={folder.type} className="rounded-r-none">
                  {folder.name}
                </TabsTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-l-none border-l-0 px-2 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFolderToDelete(folder)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsList>

          {folders.map(folder => (
            <TabsContent key={folder.id} value={folder.type} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {folder.items.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                <Card 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer aspect-square flex items-center justify-center group"
                  onClick={() => {
                    setSelectedFolder(folder)
                    setShowNewResourceModal(true)
                  }}
                >
                  <Plus className="h-12 w-12 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
} 