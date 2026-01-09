"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/sections/user-profile"
import { UserOrders } from "@/components/sections/user-orders"
import { UserInvoices } from "@/components/sections/user-invoices"
import { User, Package, FileText, Settings, LogOut } from "lucide-react"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "invoices" | "settings">("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile, orders, and account settings</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          activeTab === tab.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-bold">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  <Button variant="outline" className="w-full bg-transparent text-destructive gap-2">
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && <UserProfile />}
              {activeTab === "orders" && <UserOrders />}
              {activeTab === "invoices" && <UserInvoices />}
              {activeTab === "settings" && <UserSettings />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function UserSettings() {
  const [email, setEmail] = useState("user@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-8">
        {/* Email Settings */}
        <div>
          <h3 className="text-lg font-bold mb-4">Email</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Update Email</Button>
          </div>
        </div>

        {/* Password Settings */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold mb-4">Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Change Password</Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Order updates and shipping notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Design ready notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span>Promotional emails and special offers</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-border pt-6 border-destructive">
          <h3 className="text-lg font-bold text-destructive mb-4">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            className="bg-transparent text-destructive border-destructive hover:bg-destructive/10"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Card>
  )
}
