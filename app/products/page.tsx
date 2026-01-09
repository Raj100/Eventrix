"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/sections/product-grid"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProductStore } from "@/lib/zustand-store"
import { productApi, categoryApi } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedPrice, setSelectedPrice] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [isLoading, setIsLoading] = useState(true)

  const { products, categories, setProducts, setCategories } = useProductStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productApi.getAll(selectedCategory !== "all" ? selectedCategory : undefined, searchQuery),
          categoryApi.getAll(),
        ])

        setProducts(productsData)
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, searchQuery, setProducts, setCategories])

  

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">Explore our wide range of customizable products</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
             

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === "all" ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === cat.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
                variant="outline"
                className="w-full bg-transparent"
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : (
              <ProductGrid category={selectedCategory} searchQuery={searchQuery} sortBy={sortBy} products={products} />
            )}
          </div>
        </div>
      </div>

      
    </main>
  )
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        }
      >
        <ProductsPageContent />
      </Suspense>
      <Footer />
    </>
  )
}
