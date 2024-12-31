import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (tokens) => set(tokens),
      clearTokens: () => set({ accessToken: null, refreshToken: null })
    }),
    {
      name: 'auth-storage',
    }
  )
) 