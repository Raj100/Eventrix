import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  calculateTotal: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          let newItems
          if (existingItem) {
            newItems = state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
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
          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== id)
            const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return { items: newItems, total }
          }
          const newItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: newItems, total }
        }),

      clearCart: () => set({ items: [], total: 0 }),

      calculateTotal: () =>
        set((state) => {
          const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { total }
        }),
    }),
    {
      name: "eventrix-cart",
    },
  ),
)
