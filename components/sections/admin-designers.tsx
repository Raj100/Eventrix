"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Star } from "lucide-react"

const designers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    designs: 45,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    status: "active",
    designs: 32,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@example.com",
    status: "inactive",
    designs: 18,
    rating: 4.4,
  },
]

export function AdminDesigners() {
  return (
    <div className="space-y-6">
      <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">Assign Custom Design</Button>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Designer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Designs</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {designers.map((designer) => (
                <tr key={designer.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="px-4 py-3 font-bold">{designer.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{designer.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={designer.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                      {designer.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{designer.designs}</td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    {designer.rating}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent p-2">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent p-2 text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
