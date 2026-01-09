"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"

interface CartItem {
  id: string
  name: string
  product: string
  template: string
  price: number
  quantity: number
  image: string
  color: string
  size: string
}

interface CartItemsProps {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
}

export function CartItems({ items, setItems }: CartItemsProps) {
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
            {/* Product Image */}
            <div className="sm:col-span-1">
              <div className="relative bg-muted h-32 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Product Details */}
            <div className="sm:col-span-2">
              <Link href={`/products/${item.id}`}>
                <h3 className="text-lg font-bold hover:text-accent transition">{item.name}</h3>
              </Link>
              <div className="text-sm text-muted-foreground space-y-1 mt-3">
                <p>Color: {item.color}</p>
                <p>Size: {item.size}</p>
                <p>Template: {item.template}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/customize?product=${item.product}`}>
                  <Button size="sm" variant="outline" className="bg-transparent gap-2">
                    <Edit size={16} />
                    Edit Design
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent text-destructive hover:bg-destructive/10 gap-2"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="sm:col-span-1 flex flex-col items-end justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price per unit</p>
                <p className="text-2xl font-bold text-accent">₹{item.price}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 border border-border rounded-lg p-2 mt-4">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                >
                  +
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right mt-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">₹{item.price * item.quantity}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
