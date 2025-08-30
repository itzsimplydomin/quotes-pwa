import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useFavs } from './favs'

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
    setAuth: (token, user) => {
      // Ustaw auth i powiąż ulubione z użytkownikiem
      set({ token, user })
      try {
        useFavs.getState().setUser(user.username)
      } catch {
        // ignore
      }
    },
    logout: () => {
      // Wyczyść auth i odłącz ulubione od użytkownika
      set({ token: null, user: null })
      try {
        useFavs.getState().setUser(null)
      } catch {
        // ignore
      }
    }
  }),
  {
    name: 'auth',
    // Po rehydratacji auth ustaw ulubione per użytkownik
    onRehydrateStorage: () => (state) => {
      try {
        const u = state?.user
        if (u?.username) {
          useFavs.getState().setUser(u.username)
        } else {
          useFavs.getState().setUser(null)
        }
      } catch {
        // ignore
      }
    }
  }
))