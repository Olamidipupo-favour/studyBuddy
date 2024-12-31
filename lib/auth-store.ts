import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  clearTokens: () => void
  setAuthenticated: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: process.env.NODE_ENV === 'development' ? 'dev-token' : null,
      refreshToken: process.env.NODE_ENV === 'development' ? 'dev-refresh' : null,
      isAuthenticated: process.env.NODE_ENV === 'development',
      setTokens: (tokens) => set({ ...tokens, isAuthenticated: true }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
      setAuthenticated: (value) => set({ isAuthenticated: value })
    }),
    {
      name: 'auth-storage',
    }
  )
) 