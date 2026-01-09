"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Eye, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/lib/zustand-store"
import { bannerApi } from "@/lib/api-client"

export function AdminBanners() {
  const { token } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link: "",
    position: 0,
    is_active: true,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const data = await bannerApi.getAll()
      setBanners(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch banners")
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
        await bannerApi.update(token, editingId, formData)
        setBanners(banners.map((b) => (b._id === editingId ? { ...b, ...formData } : b)))
      } else {
        const newBanner = await bannerApi.create(token, formData)
        setBanners([...banners, newBanner])
      }
      resetForm()
    } catch (err: any) {
      setError(err.message || "Failed to save banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      setIsLoading(true)
      await bannerApi.delete(token, id)
      setBanners(banners.filter((b) => b._id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (banner: any) => {
    setFormData({
      title: banner.title,
      description: banner.description || "",
      image_url: banner.image_url,
      link: banner.link || "",
      position: banner.position,
      is_active: banner.is_active,
      start_date: banner.start_date || "",
      end_date: banner.end_date || "",
    })
    setEditingId(banner._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link: "",
      position: 0,
      is_active: true,
      start_date: "",
      end_date: "",
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
        Create Banner
      </Button>

      {showForm && (
        <Card className="p-8 bg-secondary">
          <h3 className="text-2xl font-bold mb-6">{editingId ? "Edit Banner" : "Create New Banner"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                placeholder="Banner Title"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
                rows={3}
                placeholder="Banner Description"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Link (Optional)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                placeholder="/products?category=mugs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                {isLoading ? "Saving..." : editingId ? "Update Banner" : "Create Banner"}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline" className="bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading && banners.length === 0 ? (
          <p className="text-muted-foreground">Loading banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-muted-foreground">No banners yet. Create your first banner!</p>
        ) : (
          banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden">
              <div className="relative bg-muted h-40 flex items-center justify-center overflow-hidden">
                <img
                  src={banner.image_url || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                    banner.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}
                >
                  {banner.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{banner.title}</h3>
                {banner.description && <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent p-2 gap-1">
                    <Eye size={16} />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(banner)}
                    variant="outline"
                    className="bg-transparent p-2 gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(banner._id)}
                    variant="outline"
                    className="bg-transparent p-2 gap-1 text-destructive"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
