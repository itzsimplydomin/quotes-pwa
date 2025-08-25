import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  username: string
  firstName?: string
  lastName?: string
  email?: string
  image?: string
}

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(persist(
  (set) => ({
    token: null,
    user: null,
    setAuth: (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null })
  }),
  { name: 'auth' }
))
