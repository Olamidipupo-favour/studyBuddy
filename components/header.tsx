'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, User, LogOut, BookOpen } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/lib/auth-store'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { toast } = useToast()
  const clearTokens = useAuthStore((state) => state.clearTokens)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    clearTokens()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <header className="bg-white dark:bg-gray-800 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
          <BookOpen className="mr-2" />
          Study Buddy
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            {session?.user && (
              <>
                <li>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </li>
              </>
            )}
            {!session?.user && (
              <li>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User size={16} />
                    Login
                  </Button>
                </Link>
              </li>
            )}
            <li>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

