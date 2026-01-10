import { create } from "zustand"
import { apiClient } from "../api/client"

export interface Product {
  id: string
  name: string
  category_id: string
  category_name?: string
  price: number
  description: string
  images: string[]
  colors: string[]
  sizes: string[]
  rating: number
  reviews: number
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
  product_count?: number
}

interface ProductStore {
  products: Product[]
  categories: Category[]
  favorites: string[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchProducts: (skip?: number, limit?: number, categoryId?: string, search?: string) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchProductById: (id: string) => Promise<Product | null>
  fetchTemplates: (productType: string) => Promise<any>
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearError: () => void
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  favorites: [],
  isLoading: false,
  error: null,

  fetchProducts: async (skip = 0, limit = 20, categoryId?: string, search?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await apiClient.getProducts(skip, limit, categoryId, search)
      set({ products: response.products || response, isLoading: false })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch products"
      set({ error: errorMsg, isLoading: false })
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const response: any = await apiClient.getCategories()
      set({ categories: response, isLoading: false })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch categories"
      set({ error: errorMsg, isLoading: false })
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const product: any = await apiClient.getProductById(id)
      set({ isLoading: false })
      return product
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch product"
      set({ error: errorMsg, isLoading: false })
      return null
    }
  },

  fetchTemplates: async (productType: string) => {
    set({ isLoading: true, error: null })
    try {
      const templates: any = await apiClient.getTemplates(productType)
      set({ isLoading: false })
      return templates
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch templates"
      set({ error: errorMsg, isLoading: false })
      return []
    }
  },

  toggleFavorite: (id) =>
    set((state) => {
      const isFav = state.favorites.includes(id)
      return {
        favorites: isFav ? state.favorites.filter((f) => f !== id) : [...state.favorites, id],
      }
    }),

  isFavorite: (id) => get().favorites.includes(id),

  clearError: () => set({ error: null }),
}))
