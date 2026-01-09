"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSummary } from "@/components/sections/cart-summary"
import { CartItems } from "@/components/sections/cart-items"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCartStore, useAuthStore } from "@/lib/zustand-store"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, tax, deliveryCharge, total, removeItem, updateQuantity } = useCartStore()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8">Start shopping by exploring our amazing products</p>
            <Link href="/products">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartItems items={items} setItems={() => {}} />
            </div>

            {/* Summary */}
            <div className="sticky top-24 h-fit">
              <CartSummary subtotal={subtotal} shipping={deliveryCharge} tax={tax} total={total} />
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base mt-6"
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <Link href="/products" className="block text-center mt-4">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
