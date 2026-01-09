"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { categoryApi } from "@/lib/api-client"
import { useAuthStore } from "@/lib/zustand-store"

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
  const { token } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_url: "",
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Category name is required")
      return
    }

    setIsLoading(true)
    try {
      await categoryApi.create(token, formData)
      setFormData({ name: "", description: "", icon_url: "", order: 0 })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to create category")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Create New Category</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Business Cards"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category"
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Icon URL</label>
            <input
              type="text"
              value={formData.icon_url}
              onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              placeholder="https://example.com/icon.png"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              placeholder="0"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-accent text-accent-foreground" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
