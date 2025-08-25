import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote } from '../api/dummyjson'

type FavsState = {
  favs: Record<number, Quote>
  toggle: (q: Quote) => void
  isFav: (id: number) => boolean
}

export const useFavs = create<FavsState>()(persist(
  (set, get) => ({
    favs: {},
    toggle: (q) => {
      const { favs } = get()
      const next = { ...favs }
      if (next[q.id]) delete next[q.id]
      else next[q.id] = q
      set({ favs: next })
    },
    isFav: (id) => !!get().favs[id],
  }),
  { name: 'favorites' }
))
