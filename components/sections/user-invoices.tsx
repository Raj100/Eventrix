"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

const mockInvoices = [
  {
    id: "INV-2025-001",
    orderId: "ORD-2025-001",
    date: "2025-01-06",
    total: 1000.64,
  },
  {
    id: "INV-2025-002",
    orderId: "ORD-2025-002",
    date: "2025-01-04",
    total: 599.0,
  },
  {
    id: "INV-2025-003",
    orderId: "ORD-2025-003",
    date: "2024-12-28",
    total: 449.0,
  },
]

export function UserInvoices() {
  return (
    <div className="space-y-4">
      {mockInvoices.map((invoice) => (
        <Card key={invoice.id} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{invoice.id}</h3>
              <p className="text-sm text-muted-foreground">Order: {invoice.orderId}</p>
              <p className="text-sm text-muted-foreground mt-1">Date: {invoice.date}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-accent">₹{invoice.total.toFixed(2)}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="bg-transparent gap-1">
                  <Eye size={16} />
                  View
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent gap-1">
                  <Download size={16} />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
