"use client"

import { Plus, User, Settings as SettingsIcon, CreditCard, Mail, Key, Bell, Shield, Globe, Palette, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuote } from "@/hooks/use-quote"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
}

const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', description: 'Advanced Calculus', progress: 65 },
  { id: '2', name: 'Physics', description: 'Quantum Mechanics', progress: 40 },
  { id: '3', name: 'Chemistry', description: 'Organic Chemistry', progress: 80 },
]

export function UserDashboard({ user }: { user: any }) {
  const router = useRouter()
  const { quote, isLoading } = useQuote()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: "Student"
  })
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: ""
  })
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects')
        if (!response.ok) {
          throw new Error('Failed to fetch subjects')
        }
        const data = await response.json()
        setSubjects(data.subjects || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive"
        })
      } finally {
        setIsLoadingSubjects(false)
      }
    }

    fetchSubjects()
  }, [])

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsAddingSubject(true)
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      })

      if (!response.ok) {
        throw new Error('Failed to add subject')
      }

      const data = await response.json()
      setSubjects(prev => [...prev, data.subject])
      
      toast({
        title: "Subject Added",
        description: "New subject has been successfully added.",
      })
      setShowAddSubjectModal(false)
      setNewSubject({ name: "", description: "" })
    } catch (error) {
      toast({
        title: "Failed to Add Subject",
        description: "An error occurred while adding the subject. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAddingSubject(false)
    }
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload avatar')
        }

        const data = await response.json()
        const avatarImg = document.querySelector('#user-avatar') as HTMLImageElement
        if (avatarImg) {
          avatarImg.src = data.imageUrl
        }

        toast({
          title: "Success",
          description: "Profile picture updated successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          variant: "destructive"
        })
      }
    }
  }

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/subjects/${subjectId}`)
  }

  const handleDeleteSubject = async (subject: Subject) => {
    try {
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete subject')
      }

      setSubjects(prev => prev.filter(s => s.id !== subject.id))
      setSubjectToDelete(null)

      toast({
        title: "Success",
        description: "Subject deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Add Subject Modal */}
      <Dialog open={showAddSubjectModal} onOpenChange={setShowAddSubjectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject to start tracking your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Mathematics"
                value={newSubject.name}
                onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject-description">Description</Label>
              <Textarea
                id="subject-description"
                placeholder="Brief description of the subject..."
                value={newSubject.description}
                onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSubjectModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubject}
              disabled={isAddingSubject}
            >
              {isAddingSubject ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Subject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Confirmation */}
      <AlertDialog open={!!subjectToDelete} onOpenChange={(open) => !open && setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subject "{subjectToDelete?.name}" and all its contents.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => subjectToDelete && handleDeleteSubject(subjectToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Inspirational Quote */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardContent className="py-6">
          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size={24} />
            </div>
          ) : quote ? (
            <div className="space-y-2">
              <p className="text-lg italic text-center">{quote.text}</p>
              <p className="text-sm text-center text-muted-foreground">— {quote.author}</p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Failed to load quote</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList>
          <TabsTrigger value="subjects">My Subjects</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-6">
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoadingSubjects ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : subjects.length > 0 ? (
                <>
                  {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                      className="hover:shadow-lg transition-shadow aspect-square flex flex-col relative group cursor-pointer"
                      onClick={() => handleSubjectClick(subject.id)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 z-10"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSubjectToDelete(subject)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{subject.description}</p>
                </CardHeader>
                <CardContent className="pb-6">
                        <div className="space-y-2 opacity-50">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                              className="h-full bg-gray-400 rounded-full transition-all duration-300"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
                  <Card 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer aspect-square flex items-center justify-center group"
                    onClick={() => setShowAddSubjectModal(true)}
                  >
              <Plus className="h-12 w-12 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </Card>
                </>
              ) : (
                <div className="col-span-3">
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>No subjects found. Start by adding a new subject.</p>
                      <Button 
                        variant="default"
                        className="mt-4"
                        onClick={() => setShowAddSubjectModal(true)}
                      >
                        Add Subject
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar 
                  className="h-24 w-24 cursor-pointer"
                  onClick={handleProfilePictureClick}
                >
                  <AvatarImage id="user-avatar" src="/avatars/default.png" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleProfilePictureClick}
                >
                  Change Picture
                </Button>
              </div>

              <Separator />

              {/* Profile Information */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleProfileUpdate}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>

              <Separator />

              {/* Security */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                  </div>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-notifs" defaultChecked />
                    <Label htmlFor="email-notifs">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="study-reminders" defaultChecked />
                    <Label htmlFor="study-reminders">Study Reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="progress-updates" defaultChecked />
                    <Label htmlFor="progress-updates">Progress Updates</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5" />
                  Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="profile-visible" defaultChecked />
                    <Label htmlFor="profile-visible">Public Profile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-progress" />
                    <Label htmlFor="show-progress">Show Progress to Others</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Appearance */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <select 
                        id="theme" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="system"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select 
                        id="language" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <CardContent className="py-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-bold">Free Plan</h4>
                        <p className="text-sm text-muted-foreground">Basic features for students</p>
                      </div>
                      <Button variant="outline">Upgrade</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-6 w-6" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/24</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Free Plan</p>
                        <p className="text-sm text-muted-foreground">Dec 1, 2023</p>
                      </div>
                      <p className="text-sm font-medium">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 