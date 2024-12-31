'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/schemas'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight } from 'lucide-react'
import { backendUrl } from '@/lib/config'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useAppStore((state) => state.setUser)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        setUser(result.user)
        router.push('/subjects')
      } else {
        throw new Error(result.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/study-background.jpg')" }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-green-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10"
      >
        <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-100 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-green-700 dark:text-green-200">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="pl-10 bg-green-50 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100"
                placeholder="your@email.com"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-300" size={18} />
            </div>
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="text-green-700 dark:text-green-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="pl-10 bg-green-50 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-300" size={18} />
            </div>
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200">
            Don't have an account? Sign up
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/reset-password" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200">
            Forgot your password?
          </Link>
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
    </div>
  )
}

