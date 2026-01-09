"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuthStore } from "@/lib/zustand-store"
import { userApi } from "@/lib/api-client"
import { Loader2, Trash2, Edit2, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AdminUsers() {
  const { token } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    admin_count: 0,
    user_count: 0,
    designer_count: 0,
  })

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [token])

  const fetchUsers = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      setError("")
      const response = await userApi.getAllUsers(token)
      setUsers(response)
    } catch (err: any) {
      setError(err.message || "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!token) return

    try {
      const response = await userApi.getStats(token)
      setStats(response)
    } catch (err: any) {
      console.error("Failed to fetch stats:", err)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return

    try {
      setIsLoading(true)
      await userApi.deleteUser(token, userId)
      setUsers(users.filter((u) => u.id !== userId))
      setDeleteConfirm(null)
      fetchStats()
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery),
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-3xl font-bold">{stats.total_users}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-3xl font-bold text-green-600">{stats.active_users}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="text-3xl font-bold text-blue-600">{stats.admin_count}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Regular Users</p>
          <p className="text-3xl font-bold text-purple-600">{stats.user_count}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Designers</p>
          <p className="text-3xl font-bold text-orange-600">{stats.designer_count}</p>
        </Card>
      </div>

      {/* Users List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Users Management</h3>
          <Button onClick={fetchUsers} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Name</th>
                  <th className="px-4 py-3 text-left font-bold">Email</th>
                  <th className="px-4 py-3 text-left font-bold">Phone</th>
                  <th className="px-4 py-3 text-left font-bold">Role</th>
                  <th className="px-4 py-3 text-left font-bold">City</th>
                  <th className="px-4 py-3 text-left font-bold">Joined</th>
                  <th className="px-4 py-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-blue-500/10 text-blue-600"
                            : user.role === "designer"
                              ? "bg-orange-500/10 text-orange-600"
                              : "bg-purple-500/10 text-purple-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.city || "-"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
