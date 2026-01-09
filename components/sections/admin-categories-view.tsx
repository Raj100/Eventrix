"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { useAuthStore } from "@/lib/zustand-store"
import { categoryApi, productApi } from "@/lib/api-client"
import { CreateCategoryModal } from "@/components/sections/create-category-modal"


export function AdminCategoriesView() {
  const { token } = useAuthStore()
  const [categories, setCategories] = useState<any[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)


  useEffect(() => {
    fetchCategories()
  }, [token])

  const fetchCategories = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await categoryApi.getAll(token)
      const categoryList = Array.isArray(data) ? data : data.categories || []
      setCategories(categoryList)
      setCategoryProducts({})
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategoryProducts = async (categoryId: string) => {
    try {
      const data = await productApi.getAll(categoryId)
      setCategoryProducts((prev) => ({
        ...prev,
        [categoryId]: Array.isArray(data) ? data : data.products || [],
      }))
    } catch (error) {
      console.error("Failed to fetch category products:", error)
    }
  }

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
      if (!categoryProducts[categoryId]) {
        fetchCategoryProducts(categoryId)
      }
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryApi.delete(token, categoryId)
        setCategories(categories.filter((c) => c.id !== categoryId))
        setExpandedCategory(null)
      } catch (error) {
        setError("Failed to delete category")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  const handleCategoryCreated = () => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll()
        setCategories(Array.isArray(data) ? data : data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }

  return (
    <>
    <CreateCategoryModal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSuccess={handleCategoryCreated}
      />
       <div className="mb-6 w-42">
                <Button
                  onClick={() => setShowCreateCategoryModal(true)}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  + New Category
                </Button>
              </div>
    <div className="space-y-6">
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No categories found</p>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="p-6 cursor-pointer hover:bg-muted transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {category.icon_url && (
                    <img
                      src={category.icon_url || "/placeholder.svg"}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{category.product_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUp className="text-accent" />
                  ) : (
                    <ChevronDown className="text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Content - Products List */}
              {expandedCategory === category.id && (
                <div className="border-t border-border px-6 py-4 bg-secondary/30">
                  {categoryProducts[category.id] && categoryProducts[category.id].length > 0 ? (
                    <div className="space-y-3">
                      {categoryProducts[category.id].map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">₹{product.base_price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                              {product.colors?.length || 0} colors
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No products in this category</p>
                  )}

                  {/* Category Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
    </>
  )
}
