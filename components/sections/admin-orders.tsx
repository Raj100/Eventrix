"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Download, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/lib/zustand-store"
import { orderApi } from "@/lib/api-client"

export function AdminOrders() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // Note: Backend should provide endpoint to get all orders for admin
      // For now, using mock data pattern
      console.log("[v0] Fetching orders from backend...")
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(token, orderId, newStatus)
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
    } catch (err: any) {
      setError(err.message || "Failed to update order status")
    }
  }

  const filteredOrders = orders.filter((order) => selectedStatus === "all" || order.status === selectedStatus)

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="p-4 flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`${
              selectedStatus === status
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            } capitalize`}
            size="sm"
          >
            {status}
          </Button>
        ))}
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-border hover:bg-secondary/50">
                    <td className="px-4 py-3 font-bold">{order._id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold">{order.customer_name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">₹{order.total}</td>
                    <td className="px-4 py-3">{order.items?.length || 0}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-bold capitalize border-0 cursor-pointer ${
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-600"
                            : order.status === "shipped"
                              ? "bg-blue-500/10 text-blue-600"
                              : order.status === "processing"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent p-2">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent p-2">
                          <Download size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
