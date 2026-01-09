"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Custom Ceramic Mug",
    price: 499,
    image: "/ceramic-mug-with-custom-design.jpg",
    category: "Mugs",
  },
  {
    id: 2,
    name: "Premium T-Shirt",
    price: 599,
    image: "/custom-printed-t-shirt.jpg",
    category: "T-Shirts",
  },
  {
    id: 3,
    name: "Business Card Pack",
    price: 299,
    image: "/professional-business-cards.jpg",
    category: "Business Cards",
  },
  {
    id: 4,
    name: "Personalized Poster",
    price: 399,
    image: "/custom-wall-poster-design.jpg",
    category: "Posters",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">Trending Items</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Check out our most popular custom prints loved by thousands of customers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="relative bg-muted h-64 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground uppercase mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">₹{product.price}</span>
                  </div>
                  <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">View</Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
