import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

interface BackendResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  tokens?: {
    accessToken: string
    refreshToken: string
  }
  message?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "Is Signup", type: "boolean" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          const isSignup = credentials.isSignup === 'true'
          
          // For signup, we don't authenticate immediately
          if (isSignup) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                name: credentials.name,
                role: 'student'
              }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
              throw new Error(data.message || "Signup failed")
            }

            // Return null for signup to prevent automatic login
            return null
          }

          // Login flow
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data: BackendResponse = await response.json()

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Invalid credentials")
          }

          if (!data.user || !data.tokens) {
            throw new Error("Invalid response from server")
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error // Propagate the error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 