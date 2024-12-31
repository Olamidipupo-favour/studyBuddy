import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface Subject {
  id: string
  name: string
}

interface Resource {
  id: string
  subjectId: string
  title: string
  url: string
}

interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: number
}

interface AppState {
  user: User | null
  subjects: Subject[]
  resources: Resource[]
  chatMessages: ChatMessage[]
  setUser: (user: User | null) => void
  addSubject: (subject: Subject) => void
  addResource: (resource: Resource) => void
  addChatMessage: (message: ChatMessage) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      subjects: [],
      resources: [],
      chatMessages: [],
      setUser: (user) => set({ user }),
      addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
      addResource: (resource) => set((state) => ({ resources: [...state.resources, resource] })),
      addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
    }),
    {
      name: 'study-buddy-storage',
    }
  )
)

