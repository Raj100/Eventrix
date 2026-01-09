"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { categoryApi } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

export function Categories() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data = await categoryApi.getAll()
        setCategories(Array.isArray(data) ? data : data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">Our Product Categories</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our diverse range of customizable products. From business essentials to personalized gifts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                  {category.icon_url && (
                    <img src={category.icon_url || "/placeholder.svg"} alt={category.name} className="w-12 h-12 mb-4" />
                  )}
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description || "Customizable products"}</p>
                  {category.product_count !== undefined && (
                    <p className="text-xs text-accent font-bold mt-3">{category.product_count} products</p>
                  )}
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No categories available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
