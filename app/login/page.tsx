'use client'

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/schemas"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Image from "next/image"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const setTokens = useAuthStore((state) => state.setTokens)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Invalid email or password",
        })
        return
      }

      if (result?.ok) {
        // Set mock tokens for development
        setTokens({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token"
        })

        toast({
          title: "Success",
          description: "Welcome back!",
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/study-background.jpg"
          alt="Background"
          fill
          className="object-cover opacity-50 dark:opacity-20"
          priority
        />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-lg relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email address"
                          className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          disabled={isLoading}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          disabled={isLoading}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-sm text-center">
              <Button
                variant="link"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 p-0"
                onClick={() => router.push('/signup')}
              >
               Don't have an account?{" "} Sign up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

