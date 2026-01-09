"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/zustand-store"

interface ProductGridProps {
  category?: string
  searchQuery?: string
  sortBy?: string
  products?: any[]
}

export function ProductGrid({
  category = "all",
  searchQuery = "",
  sortBy = "popular",
  products = [],
}: ProductGridProps) {
  const { addItem } = useCartStore()

  let filtered = [...products]

  // Filter by category
  console.log("category",category,products)
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category_id === category)
  }

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Filter by price
  if (category === "all") {
    filtered = filtered.filter((p) => {
      if (p.priceRange === "0-500") return p.base_price <= 500
      if (p.priceRange === "500-1000") return p.base_price > 500 && p.base_price <= 1000
      if (p.priceRange === "1000-2000") return p.base_price > 1000 && p.base_price <= 2000
      if (p.priceRange === "2000+") return p.base_price > 2000
      return true
    })
  }

  if (sortBy === "price-low") filtered.sort((a, b) => a.base_price - b.base_price)
  if (sortBy === "price-high") filtered.sort((a, b) => b.base_price - a.base_price)
  if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating)
  if (sortBy === "newest") filtered.reverse()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.base_price,
      quantity: 1,
      image: product.images?.[0] || "/placeholder.svg",
    })
  }

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">No products found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((product) => (
        <Card key={product._id || product.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
          <Link href={`/products/${product._id || product.id}`} className="flex-1">
            <div className="relative bg-muted h-64 overflow-hidden flex items-center justify-center group">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">₹{product.base_price}</span>
              </div>
            </div>
          </Link>
          <div className="p-4 border-t border-border">
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
