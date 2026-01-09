"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingBag, Users, Settings, ImageIcon, Package } from "lucide-react"
import { AdminDashboard } from "@/components/sections/admin-dashboard"
import { AdminOrders } from "@/components/sections/admin-orders"
import { AdminProducts } from "@/components/sections/admin-products"
import { AdminBanners } from "@/components/sections/admin-banners"
import { AdminDesigners } from "@/components/sections/admin-designers"
import { AdminUsers } from "@/components/sections/admin-users"
import { AdminCategoriesView } from "@/components/sections/admin-categories-view"
import { useAuthStore } from "@/lib/zustand-store"

export default function AdminPage() {
  const router = useRouter()
  const { user, role } = useAuthStore()
  const [activeTab, setActiveTab] = useState<string>("dashboard")

  useEffect(() => {
    if (!user || role !== "admin") {
      router.push("/auth/admin/login")
    }
  }, [user, role, router])

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "designers", label: "Designers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (role !== "admin") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access the admin dashboard.</p>
            <Button onClick={() => router.push("/")} className="w-full bg-accent">
              Go to Home
            </Button>
          </Card>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store, orders, and content</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-24">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                          activeTab === tab.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-bold">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-4">
              {activeTab === "dashboard" && <AdminDashboard />}
              {activeTab === "orders" && <AdminOrders />}
              {activeTab === "products" && <AdminProducts />}
              {activeTab === "categories" && <AdminCategoriesView />}
              {activeTab === "users" && <AdminUsers />}
              {activeTab === "banners" && <AdminBanners />}
              {activeTab === "designers" && <AdminDesigners />}
              {activeTab === "settings" && <AdminSettingsPanel />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function AdminSettingsPanel() {
  const { token } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryPincodes, setDeliveryPincodes] = useState([
    { pincode: "110001", charge: 50, delivery_days: 2 },
    { pincode: "110002", charge: 75, delivery_days: 2 },
    { pincode: "400001", charge: 100, delivery_days: 3 },
    { pincode: "560001", charge: 120, delivery_days: 3 },
    { pincode: "600001", charge: 150, delivery_days: 4 },
  ])
  const [newPincode, setNewPincode] = useState({ pincode: "", charge: 0, delivery_days: 3 })

  const handleAddPincode = () => {
    if (newPincode.pincode && newPincode.charge > 0) {
      setDeliveryPincodes([...deliveryPincodes, newPincode])
      setNewPincode({ pincode: "", charge: 0, delivery_days: 3 })
    }
  }

  const handleRemovePincode = (pincode: string) => {
    setDeliveryPincodes(deliveryPincodes.filter((p) => p.pincode !== pincode))
  }

  const handleSaveDeliveryCharges = async () => {
    setIsLoading(true)
    try {
      // const response = await deliveryApi.setCharges(token, { charges: deliveryPincodes })
      console.log("[v0] Saving delivery charges:", deliveryPincodes)
      // Show success message
    } catch (error) {
      console.error("Failed to save delivery charges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Delivery Charges */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Delivery Charges by Pincode</h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Pincode</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Pincode"
              value={newPincode.pincode}
              onChange={(e) => setNewPincode({ ...newPincode, pincode: e.target.value })}
              maxLength={6}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
            <input
              type="number"
              placeholder="Charge (₹)"
              value={newPincode.charge}
              onChange={(e) => setNewPincode({ ...newPincode, charge: Number(e.target.value) })}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
            <input
              type="number"
              placeholder="Days"
              value={newPincode.delivery_days}
              onChange={(e) => setNewPincode({ ...newPincode, delivery_days: Number(e.target.value) })}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
            <Button onClick={handleAddPincode} className="bg-accent text-accent-foreground">
              Add
            </Button>
          </div>
        </div>

        {/* Pincodes List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-bold">Pincode</th>
                <th className="text-left py-3 px-4 font-bold">Delivery Charge (₹)</th>
                <th className="text-left py-3 px-4 font-bold">Delivery Days</th>
                <th className="text-left py-3 px-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveryPincodes.map((p) => (
                <tr key={p.pincode} className="border-b border-border hover:bg-muted">
                  <td className="py-3 px-4">{p.pincode}</td>
                  <td className="py-3 px-4">₹{p.charge}</td>
                  <td className="py-3 px-4">{p.delivery_days} days</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemovePincode(p.pincode)}
                      className="text-red-500 hover:underline text-xs font-bold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          onClick={handleSaveDeliveryCharges}
          disabled={isLoading}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? "Saving..." : "Save All Charges"}
        </Button>
      </Card>

      {/* Store Settings */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Store Configuration</h2>
        <div className="space-y-4 p-4 bg-secondary rounded-lg">
          <div>
            <label className="block text-sm font-bold mb-2">Store Name</label>
            <input
              type="text"
              defaultValue="Eventrix Exhibition & Studio"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Store Email</label>
            <input
              type="email"
              defaultValue="info@eventrix.com"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+91 9876543210"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Settings</Button>
        </div>
      </Card>
    </div>
  )
}
