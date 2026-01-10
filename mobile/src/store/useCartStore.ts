import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  color: string
  size: string
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)

          let newItems: CartItem[]
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            )
          } else {
            newItems = [...state.items, item]
          }

          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: newItems, total }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id)
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: newItems, total }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          let newItems: CartItem[]

          if (quantity <= 0) {
            newItems = state.items.filter((i) => i.id !== id)
          } else {
            newItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          }

          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: newItems, total }
        }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "eventrix-cart",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
