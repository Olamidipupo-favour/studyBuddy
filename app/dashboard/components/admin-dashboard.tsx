"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserCog, Mail, Calendar, DollarSign, CreditCard, TrendingUp, AlertCircle, Download, Filter, User, Settings, Bell, Shield, Key, Globe, Palette, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { saveAs } from 'file-saver'
import { useQuote } from "@/hooks/use-quote"

const mockQuotes = [
  "Education is not preparation for life; education is life itself. - John Dewey",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Knowledge is power. - Francis Bacon"
]

const mockData = Array.from({ length: 7 }, (_, i) => ({
  name: `Day ${i + 1}`,
  users: Math.floor(Math.random() * 100),
  visitors: Math.floor(Math.random() * 200)
}))

type User = {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  status: 'active' | 'inactive' | 'pending'
  joinedDate: string
  lastActive: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Student User',
    email: 'student@student.edu',
    role: 'student',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-03-20'
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@teacher.edu',
    role: 'teacher',
    status: 'active',
    joinedDate: '2023-12-01',
    lastActive: '2024-03-19'
  },
  // Add more mock users as needed
]

type Payment = {
  id: string
  userId: string
  userName: string
  amount: number
  status: 'successful' | 'pending' | 'failed'
  type: 'subscription' | 'one-time'
  date: string
  plan?: string
}

type RevenueData = {
  month: string
  revenue: number
  subscriptions: number
}

const mockPayments: Payment[] = [
  {
    id: 'p1',
    userId: '1',
    userName: 'Student User',
    amount: 29.99,
    status: 'successful',
    type: 'subscription',
    date: '2024-03-20',
    plan: 'Premium Monthly'
  },
  {
    id: 'p2',
    userId: '2',
    userName: 'Teacher User',
    amount: 299.99,
    status: 'successful',
    type: 'subscription',
    date: '2024-03-19',
    plan: 'Premium Annual'
  },
  // Add more mock payments...
]

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 4500, subscriptions: 150 },
  { month: 'Feb', revenue: 5200, subscriptions: 180 },
  { month: 'Mar', revenue: 6100, subscriptions: 210 },
  // Add more months...
]

export function AdminDashboard({ user }: { user: any }) {
  const { quote, isLoading } = useQuote()
  const [features, setFeatures] = useState({
    chat: true,
    fileUpload: true,
    voiceNotes: false,
    aiAssistant: true
  })
  const [updatingFeature, setUpdatingFeature] = useState<string | null>(null)
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@admin.edu",
    bio: "System Administrator"
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleFeatureToggle = async (feature: string, checked: boolean) => {
    setUpdatingFeature(feature)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setFeatures(prev => ({ ...prev, [feature]: checked }))
      
      toast({
        title: "Feature Updated",
        description: `${feature.replace(/([A-Z])/g, ' $1').trim()} is now ${checked ? 'enabled' : 'disabled'}`,
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feature. Please try again.",
        variant: "destructive"
      })
      // Revert the change
      setFeatures(prev => ({ ...prev, [feature]: !checked }))
    } finally {
      setUpdatingFeature(null)
    }
  }

  const exportPayments = () => {
    // Create CSV headers
    const headers = ['Date', 'User', 'Type', 'Plan', 'Amount', 'Status']
    
    // Convert payments to CSV format
    const csvData = mockPayments.map(payment => [
      new Date(payment.date).toLocaleDateString(),
      payment.userName,
      payment.type,
      payment.plan || 'N/A',
      `$${payment.amount.toFixed(2)}`,
      payment.status
    ])
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const fileName = `payment-history-${new Date().toISOString().split('T')[0]}.csv`
    saveAs(blob, fileName)
    
    toast({
      title: "Export Successful",
      description: "Payment history has been downloaded",
    })
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your storage
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      // Update avatar image source
      const avatarImg = document.querySelector('#admin-avatar') as HTMLImageElement
      if (avatarImg) {
        avatarImg.src = imageUrl
      }
    }
  }

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        throw new Error(data.message)
      }
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

  const handleSettingsSave = async () => {
    setIsUpdatingSettings(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifications: {
            email: true,
            payments: true,
            system: true
          },
          security: {
            auditLog: true,
            ipRestriction: false,
            sessionTimeout: true
          },
          appearance: {
            theme: 'system',
            language: 'en'
          },
          smtp: {
            host: 'smtp.example.com',
            port: '587',
            username: 'user@example.com',
            password: '********'
          }
        })
      })
      
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Settings Saved",
          description: "Your settings have been successfully updated.",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Quote Card */}
      <Card className="bg-indigo-50 dark:bg-indigo-900/20">
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">56</p>
                <p className="text-sm text-muted-foreground">Current active users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$4,569</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Feature Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <Label htmlFor={feature} className="capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-2">
                      {updatingFeature === feature ? (
                        <LoadingSpinner size={30} />
                      ) : null}
                      <Switch
                        id={feature}
                        checked={enabled}
                        onCheckedChange={(checked) => handleFeatureToggle(feature, checked)}
                        disabled={updatingFeature === feature}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.role === 'admin' ? 'default' :
                              user.role === 'teacher' ? 'secondary' : 'outline'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'active' ? 'success' :
                              user.status === 'inactive' ? 'destructive' : 'warning'
                            }>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Edit User",
                                  description: `Editing ${user.name}'s details`,
                                })
                              }}
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockUsers.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Users
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockUsers.filter(u => u.status === 'active').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pending Approvals
                      </CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockUsers.filter(u => u.status === 'pending').length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">
                  +24 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Churn Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4%</div>
                <p className="text-xs text-muted-foreground">
                  -0.3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="subscriptions"
                    stroke="#82ca9d"
                    name="Subscriptions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    <option value="all">All Payments</option>
                    <option value="subscription">Subscriptions</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportPayments}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.plan || 'N/A'}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === 'successful' ? 'success' :
                            payment.status === 'failed' ? 'destructive' : 'warning'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Failed Payments */}
          <Card className="bg-red-50 dark:bg-red-900/10">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <CardTitle className="text-sm font-medium text-red-500">
                Failed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {mockPayments.filter(p => p.status === 'failed').length}
              </div>
              <p className="text-sm text-red-500">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 cursor-pointer hover:opacity-75 transition-opacity" onClick={handleProfilePictureClick}>
                    <AvatarImage id="admin-avatar" src="/avatars/admin.jpg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 shadow-sm">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <CardTitle>Admin Profile</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  className="mt-4"
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <LoadingSpinner size={16} className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </div>

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

              <Separator />

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p>Add an extra layer of security to your account</p>
                    <p className="text-sm text-muted-foreground">
                      Currently: <span className="text-green-500 font-medium">Enabled</span>
                    </p>
                  </div>
                  <Button variant="outline">Configure 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
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
                    <Checkbox id="payment-notifs" defaultChecked />
                    <Label htmlFor="payment-notifs">Payment Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="system-notifs" defaultChecked />
                    <Label htmlFor="system-notifs">System Updates</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="audit-log" defaultChecked />
                    <Label htmlFor="audit-log">Enable Audit Log</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ip-restriction" />
                    <Label htmlFor="ip-restriction">IP Address Restriction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="session-timeout" defaultChecked />
                    <Label htmlFor="session-timeout">Auto Session Timeout</Label>
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

              <Separator />

              {/* Email Settings */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input id="smtp-host" placeholder="smtp.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">SMTP Username</Label>
                      <Input id="smtp-user" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-pass">SMTP Password</Label>
                      <Input id="smtp-pass" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">
                    Test Email Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button 
              onClick={handleSettingsSave}
              disabled={isUpdatingSettings}
            >
              {isUpdatingSettings ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 