"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, RefreshCw } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-2025-001",
    date: "2025-01-06",
    status: "delivered",
    total: 1000.64,
    items: 2,
    trackingNumber: "TRACK123456",
  },
  {
    id: "ORD-2025-002",
    date: "2025-01-04",
    status: "shipped",
    total: 599.0,
    items: 1,
    trackingNumber: "TRACK123457",
  },
  {
    id: "ORD-2025-003",
    date: "2024-12-28",
    status: "processing",
    total: 449.0,
    items: 1,
    trackingNumber: "TRACK123458",
  },
]

export function UserOrders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-600"
      case "shipped":
        return "bg-blue-500/10 text-blue-600"
      case "processing":
        return "bg-yellow-500/10 text-yellow-600"
      case "cancelled":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition">
                  <td className="px-6 py-4 font-bold">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-sm">{order.items} item(s)</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-accent">₹{order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent gap-1">
                        <Eye size={16} />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent gap-1">
                        <Download size={16} />
                        Invoice
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Tracking Info */}
      <Card className="p-6 bg-secondary">
        <h3 className="text-lg font-bold mb-4">Need to Track Your Order?</h3>
        <p className="text-muted-foreground mb-4">
          Enter your tracking number to get real-time updates on your delivery.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter tracking number..."
            className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          />
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <RefreshCw size={18} />
            Track
          </Button>
        </div>
      </Card>
    </div>
  )
}
