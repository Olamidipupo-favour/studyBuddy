import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import { FAB } from './components/fab'
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from '@/components/auth-provider'
import { DebugAuth } from '@/components/debug-auth'
import { TooltipProvider } from "@/components/ui/tooltip"
import { MockAuthHelper } from './components/mock-auth-helper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Study Buddy',
  description: 'Your intelligent study assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <FAB />
              <Toaster />
              {/* <DebugAuth />
              { /*<MockAuthHelper /> */}
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

