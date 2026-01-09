"use client"

import { Card } from "@/components/ui/card"

interface CartSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function CartSummary({ subtotal, shipping, tax, total }: CartSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-4 border-b border-border pb-4 mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-bold">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-bold">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (18%)</span>
          <span className="font-bold">₹{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Total</span>
        <span className="text-3xl font-bold text-accent">₹{total.toFixed(2)}</span>
      </div>

      {subtotal > 2000 && (
        <div className="p-3 bg-green-500/10 text-green-600 rounded-lg text-sm font-bold">
          Free shipping on this order!
        </div>
      )}
    </Card>
  )
}
