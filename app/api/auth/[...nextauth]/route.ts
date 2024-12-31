import NextAuth, { Session, AuthError } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock user data
const MOCK_USERS = [
  { id: '1', email: 'student@student.edu', password: 'password123', role: 'student', name: 'Student User' },
  { id: '2', email: 'teacher@teacher.edu', password: 'password123', role: 'teacher', name: 'Teacher User' },
  { id: '3', email: 'admin@admin.edu', password: 'password123', role: 'admin', name: 'Admin User' },
]

const IS_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new AuthError("Missing credentials")
        }

        try {
          if (IS_MOCK_AUTH) {
            const user = MOCK_USERS.find(u => 
              u.email === credentials.email && 
              u.password === credentials.password
            )

            if (!user) {
              return null
            }

            const { password: _, ...userWithoutPassword } = user
            return {
              ...userWithoutPassword,
              email: userWithoutPassword.email,
              name: userWithoutPassword.name,
              id: userWithoutPassword.id,
            }
          } else {
            // Real authentication logic here
            return null
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session, token: any }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 