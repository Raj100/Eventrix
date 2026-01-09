"use client"

import { Card } from "@/components/ui/card"

interface PreviewCanvasProps {
  product: any
  price?: number
}

export function PreviewCanvas({ product, price = 0 }: PreviewCanvasProps) {
  if (!product) return null

  const productInfo: Record<string, any> = {
    mug: {
      shape: "cylindrical",
      previewUrl: "/ceramic-mug-with-custom-design.jpg",
      deliveryTime: "7-10 days",
    },
    tshirt: {
      shape: "rectangular",
      previewUrl: "/custom-printed-t-shirt.jpg",
      deliveryTime: "5-7 days",
    },
    "business-card": {
      shape: "card",
      previewUrl: "/professional-business-cards.jpg",
      deliveryTime: "3-5 days",
    },
    poster: {
      shape: "flat",
      previewUrl: "/custom-wall-poster-design.jpg",
      deliveryTime: "5-7 days",
    },
    hoodie: {
      shape: "garment",
      previewUrl: "/custom-printed-t-shirt.jpg",
      deliveryTime: "7-10 days",
    },
  }

  const info = productInfo[product.category] || productInfo.mug
  const displayPrice = price || product.base_price || 0

  return (
    <div className="sticky top-24 space-y-4">
      {/* Preview */}
      <Card className="overflow-hidden bg-muted">
        <div className="h-96 flex items-center justify-center relative group">
          <img
            src={info.previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition"
            style={{
              filter: "brightness(1.1) contrast(1.05)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition">
            <div className="text-center text-white">
              <p className="text-sm font-bold">Your Design Preview</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Total Price</p>
            <p className="text-3xl font-bold text-accent">₹{displayPrice.toFixed(0)}</p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Product</span>
                <span className="font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Design Type</span>
                <span className="font-bold">Custom</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold">{info.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-secondary">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your design will be previewed on the product and you can make changes before checkout. Enter your pincode to
          see delivery charges.
        </p>
      </Card>
    </div>
  )
}
