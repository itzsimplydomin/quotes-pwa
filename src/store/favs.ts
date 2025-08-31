// Store ulubionych (Zustand) - per-użytkownik, zapisywany w localStorage
// Ten store sam nie persistuje stanu - zarządzamy zapisem ręcznie (klucze favorites-<user>)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote } from '../api/dummyjson'

type FavsState = {
  favs: Record<number, Quote>
  toggle: (q: Quote, userId?: string) => void
  isFav: (id: number) => boolean
  setUser: (userId: string | null) => void
  clearFavorites: () => void
}

export const useFavs = create<FavsState>()(persist(
  (set, get) => ({
    favs: {},
    
    toggle: (q, userId) => {
      if (!userId) return // Nie można dodawać ulubionych bez zalogowania
      
      const storageKey = `favorites-${userId}`
      const currentFavs = JSON.parse(localStorage.getItem(storageKey) || '{}')
      
      const next = { ...currentFavs }
      if (next[q.id]) {
        delete next[q.id]
      } else {
        next[q.id] = q
      }
      
      localStorage.setItem(storageKey, JSON.stringify(next))
      set({ favs: next })
    },
    
    isFav: (id) => !!get().favs[id],
    
    setUser: (userId) => {
      if (userId) {
        // Załaduj ulubione dla danego użytkownika
        const storageKey = `favorites-${userId}`
        const userFavs = JSON.parse(localStorage.getItem(storageKey) || '{}')
        set({ favs: userFavs })
      } else {
        // Wyczyść ulubione przy wylogowaniu
        set({ favs: {} })
      }
    },
    
    clearFavorites: () => {
      set({ favs: {} })
    }
  }),
  { 
    name: 'favorites-global', // To będzie używane tylko do stanu aplikacji, nie do persystencji
    partialize: () => ({}) // Nie zapisuj nic w tym store - zarządzamy ręcznie
  }
))
