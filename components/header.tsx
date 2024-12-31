'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, User, LogOut, BookOpen, MessageCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)

  const handleLogout = () => {
    setUser(null)
    // Add any additional logout logic here
  }

  return (
    <header className="bg-green-100 dark:bg-green-800 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-800 dark:text-green-100 flex items-center">
          <BookOpen className="mr-2" />
          Study Buddy
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            {user && (
              <>
                <li>
                  <Link href="/subjects" className="text-green-800 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 flex items-center">
                    <BookOpen className="mr-1" size={18} />
                    Subjects
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            )}
            {!user && (
              <li>
                <Link href="/login" className="text-green-800 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 flex items-center">
                  <User className="mr-1" size={18} />
                  Login
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

