import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import ChatFAB from '@/components/chat-fab'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Study Buddy',
  description: 'Your minimalist study assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ChatFAB />
        </ThemeProvider>
      </body>
    </html>
  )
}

