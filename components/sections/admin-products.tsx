"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/zustand-store"
import { productApi, categoryApi } from "@/lib/api-client"

export function AdminProducts() {
  const { token } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    base_price: 0,
    colors: [{ name: "Default", code: "#000000" }],
    sizes: [{ name: "Standard", price_multiplier: 1 }],
    images: [],
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [token])

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll(token)
      const categoryList = Array.isArray(data) ? data : data.categories || []
      setCategories(categoryList)
      if (categoryList.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: categoryList[0].id }))
      }
    } catch (err: any) {
      console.error("Failed to fetch categories:", err)
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await productApi.getAll()
      setProducts(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (editingId) {
        await productApi.update(token, editingId, formData)
        setProducts(products.map((p) => (p.id === editingId ? { ...p, ...formData } : p)))
      } else {
        const newProduct = await productApi.create(token, formData)
        setProducts([...products, newProduct])
      }
      resetForm()
    } catch (err: any) {
      setError(err.message || "Failed to save product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      setIsLoading(true)
      await productApi.delete(token, id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      base_price: product.base_price,
      colors: product.colors || [{ name: "Default", code: "#000000" }],
      sizes: product.sizes || [{ name: "Standard", price_multiplier: 1 }],
      images: product.images || [],
      is_active: product.is_active,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: categories.length > 0 ? categories[0].id : "",
      base_price: 0,
      colors: [{ name: "Default", code: "#000000" }],
      sizes: [{ name: "Standard", price_multiplier: 1 }],
      images: [],
      is_active: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => setShowForm(!showForm)}
        className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Plus size={18} />
        Add New Product
      </Button>

      {showForm && (
        <Card className="p-8 bg-secondary">
          <h3 className="text-2xl font-bold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Base Price (₹)</label>
                <input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm font-bold">
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Product"
                ) : (
                  "Save Product"
                )}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline" className="bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No products yet. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const categoryName = categories.find((c) => c.id === product.category_id)?.name || product.category_id
                  return (
                    <tr key={product.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="px-4 py-3 font-bold">{product.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{categoryName}</td>
                      <td className="px-4 py-3 font-bold text-accent">₹{product.base_price}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            product.is_active ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(product)}
                            variant="outline"
                            className="bg-transparent p-2"
                            disabled={isLoading}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            variant="outline"
                            className="bg-transparent p-2 text-destructive"
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
