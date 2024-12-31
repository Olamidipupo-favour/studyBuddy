'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { BookOpen, Plus } from 'lucide-react'

export default function SubjectsPage() {
  const [newSubject, setNewSubject] = useState('')
  const { user, subjects, addSubject } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject({ id: Date.now().toString(), name: newSubject.trim() })
      setNewSubject('')
    }
  }

  const data = subjects.map((subject, index) => ({
    name: subject.name,
    value: 1,
    color: `hsl(${index * 30}, 70%, 50%)`,
  }))

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-100">Your Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <Label htmlFor="newSubject">Add New Subject</Label>
            <div className="flex mt-1">
              <Input
                id="newSubject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter subject name"
                className="mr-2"
              />
              <Button onClick={handleAddSubject}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
          <ul className="space-y-2">
            {subjects.map((subject) => (
              <motion.li
                key={subject.id}
                className="bg-white dark:bg-green-800 p-4 rounded-lg shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/subjects/${subject.id}`} className="flex items-center text-green-800 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {subject.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-100">Study Progress</h2>
          <div className="bg-white dark:bg-green-800 p-4 rounded-lg shadow-md" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

