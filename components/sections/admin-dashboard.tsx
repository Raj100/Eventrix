"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, TrendingUp, ShoppingBag } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuthStore } from "@/lib/zustand-store"
import { orderApi, userApi } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

export function AdminDashboard() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_orders: 0,
    total_revenue: 0,
  })
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        const [userStats, ordersList] = await Promise.all([userApi.getStats(token), orderApi.getAll(token)])

        setStats({
          total_users: userStats.total_users || 0,
          active_users: userStats.active_users || 0,
          total_orders: ordersList.length || 0,
          total_revenue: ordersList.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
        })

        setOrders(ordersList.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ]

  const topProducts = [
    { name: "Ceramic Mug", sales: 234 },
    { name: "T-Shirt", sales: 189 },
    { name: "Business Card Pack", sales: 456 },
    { name: "Poster", sales: 123 },
  ]

  const dashboardStats = [
    { label: "Total Users", value: stats.total_users, change: "+12.5%", icon: Users, color: "text-blue-500" },
    { label: "Active Users", value: stats.active_users, change: "+5.2%", icon: Users, color: "text-green-500" },
    { label: "Total Orders", value: stats.total_orders, change: "+8.3%", icon: ShoppingBag, color: "text-purple-500" },
    {
      label: "Revenue",
      value: `₹${(stats.total_revenue / 1000).toFixed(1)}K`,
      change: "+15.2%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-xs font-bold text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#FF6B35" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-4 py-3 font-bold">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{order.user_id}</td>
                  <td className="px-4 py-3 text-accent font-bold">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === "delivered"
                          ? "bg-green-500/10 text-green-600"
                          : order.status === "shipped"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
