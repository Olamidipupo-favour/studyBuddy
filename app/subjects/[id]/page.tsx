"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Clock, Target, FolderPlus, File, Plus, Book, PenTool, History, Trash2, ArrowDown } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { backendUrl

 } from "@/lib/config"
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
  const [resourceToDelete, setResourceToDelete] = useState<{ folderId: string; resource: Resource } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingFolders, setIsLoadingFolders] = useState(true)

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await fetch(`/api/subjects/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch subject')
        }
        const data = await response.json()
        setSubject(data.subject)
      } catch (error) {
        console.error("Failed to fetch subject details:", error)
        toast({
          title: "Error",
          description: "Failed to load subject details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubject()
  }, [params.id, toast])

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true)
      try {
        const response = await fetch(`/api/subjects/${params.id}/folders`)
        if (!response.ok) {
          throw new Error('Failed to fetch folders')
        }
        const data = await response.json()
        setFolders(data.folders)
      } catch (error) {
        console.error("Failed to fetch folders:", error)
        toast({
          title: "Error",
          description: "Failed to load folders",
          variant: "destructive"
        })
      } finally {
        setIsLoadingFolders(false)
      }
    }

    if (!isLoading && subject) {
      fetchFolders()
    }
  }, [params.id, isLoading, subject, toast])

  const handleStartStudying = () => {
    router.push(`/subjects/${params.id}/study`)
  }

  const handleViewHistory = () => {
    router.push(`/subjects/${params.id}/history`)
  }

  const handleAddResource = async () => {
    if (!newResource.name || !newResource.description || !selectedFolder || !newResource.file) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('name', newResource.name)
      formData.append('description', newResource.description)
      formData.append('file', newResource.file)

      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total)
          setUploadProgress(progress)
        }
      })

      // Create a promise to handle the XHR request
      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', `/api/subjects/${params.id}/folders/${selectedFolder.id}/resources`)
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(new Response(xhr.response, {
              status: xhr.status,
              statusText: xhr.statusText,
            }))
          } else {
            reject(new Error(`HTTP ${xhr.status} - ${xhr.statusText}`))
          }
        }
        
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(formData)
      })

      // Type assertion since we know it's a Response object
      const data = await (response as Response).json()
      
      // Update the folders state with the new resource
      setFolders(prev => prev.map(folder => 
        folder.id === selectedFolder.id 
          ? { 
              ...folder, 
              items: [...folder.items, data.resource]
            }
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
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add resource",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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
      const response = await fetch(`/api/subjects/${params.id}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFolder)
      })

      if (!response.ok) {
        throw new Error('Failed to create folder')
      }

      const data = await response.json()
      setFolders(prev => [...prev, data.folder])
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
      const response = await fetch(`/api/subjects/${params.id}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGoal)
      })

      if (!response.ok) {
        throw new Error('Failed to add goal')
      }

      const data = await response.json()
      setSubject(prev => prev ? {
        ...prev,
        goals: [...(prev.goals || []), data.goal]
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
      const response = await fetch(`/api/subjects/${params.id}/folders/${folder.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete folder')
      }

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

  const handleDeleteResource = async (folderId: string, resourceId: string) => {
    try {
      const response = await fetch(`/api/subjects/${params.id}/folders/${folderId}/resources/${resourceId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to delete resource')
      }

      setFolders(prev => prev.map(folder => 
        folder.id === folderId 
          ? { 
              ...folder, 
              items: folder.items.filter(item => item.id !== resourceId)
            }
          : folder
      ))

      toast({
        title: "Success",
        description: "Resource deleted successfully"
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resource",
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newResource.name}
                onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                disabled={isUploading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                disabled={isUploading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder">Folder</Label>
              <select
                id="folder"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedFolder?.id || ""}
                onChange={(e) => setSelectedFolder(folders.find(f => f.id === e.target.value) || null)}
                disabled={isUploading}
              >
                <option value="">Select a folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setNewResource(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewResourceModal(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleAddResource} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Resource"}
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

      {/* Delete Resource Alert Dialog */}
      <AlertDialog open={!!resourceToDelete} onOpenChange={() => setResourceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resourceToDelete?.resource.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (resourceToDelete) {
                  handleDeleteResource(resourceToDelete.folderId, resourceToDelete.resource.id);
                  setResourceToDelete(null);
                }
              }}
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

        {isLoadingFolders ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner size={30} />
          </div>
        ) : (
          <Tabs defaultValue={folders[0]?.id} className="w-full">
            <TabsList className="w-full justify-start">
              {folders.map((folder) => (
                <TabsTrigger key={folder.id} value={folder.id} className="flex items-center">
                  {folder.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0 hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFolderToDelete(folder)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
            {folders.map((folder) => (
              <TabsContent key={folder.id} value={folder.id}>
                {folder.items.length === 0 ? (
                  <>
                  <div className="text-center py-8 text-muted-foreground">
                    No resources in this folder yet.
                  </div>
                  
                  <Card 
                  className="hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
                  onClick={() => {
                    setSelectedFolder(folder)
                    setShowNewResourceModal(true)
                  }}
                >
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </Card>
                </>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {folder.items.map((resource) => (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{resource.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResourceToDelete({ folderId: folder.id, resource });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Added on {new Date(resource.createdAt).toLocaleDateString()}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <a href={`${backendUrl}${resource.url}`} download target="_blank" rel="noopener noreferrer">
                                <ArrowDown className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card 
                      className="hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
                      onClick={() => {
                        setSelectedFolder(folder)
                        setShowNewResourceModal(true)
                      }}
                    >
                      <Plus className="h-12 w-12 text-muted-foreground" />
                    </Card>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
} 