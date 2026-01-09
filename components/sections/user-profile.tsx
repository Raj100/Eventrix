"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/zustand-store"
import { authApi } from "@/lib/api-client"
import { User, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UserProfile() {
  const { token } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        setError("")
        const response = await authApi.getProfile(token)
        setProfileData({
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          address: response.address || "",
          city: response.city || "",
          state: response.state || "",
          pincode: response.pincode || "",
        })
      } catch (err: any) {
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    if (!token) {
      setError("Authentication required")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await authApi.updateProfile(token, {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
      })
      setProfileData({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: response.address || "",
        city: response.city || "",
        state: response.state || "",
        pincode: response.pincode || "",
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !profileData.name) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <Button
          onClick={() => (isEditing ? handleSaveChanges() : setIsEditing(true))}
          disabled={isLoading}
          className={isEditing ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Edit Profile"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mb-4 overflow-hidden border-4 border-accent">
            <User size={64} className="text-muted-foreground" />
          </div>
          {isEditing && (
            <Button variant="outline" className="bg-transparent text-sm">
              Change Avatar
            </Button>
          )}
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email Address (Read-only)</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-foreground opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">State</label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profileData.pincode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
