import { create } from "zustand"

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  description: string
}

interface ProductStore {
  products: Product[]
  favorites: string[]
  setProducts: (products: Product[]) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  favorites: [],

  setProducts: (products) => set({ products }),

  toggleFavorite: (id) =>
    set((state) => {
      const isFav = state.favorites.includes(id)
      return {
        favorites: isFav ? state.favorites.filter((f) => f !== id) : [...state.favorites, id],
      }
    }),

  isFavorite: (id) => get().favorites.includes(id),
}))
