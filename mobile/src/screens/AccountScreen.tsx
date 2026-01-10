import { useEffect, useState, useCallback } from "react"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"

import { useUserStore } from "../store/useUserStore"

const AccountScreen = () => {
  const { user, updateProfile, logout, isLoading, fetchProfile } = useUserStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const loadProfile = useCallback(async () => {
    try {
      await fetchProfile()
    } catch (error) {
      console.error("[AccountScreen] Failed to fetch profile:", error)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData)
      Alert.alert("Success", "Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      console.error("[AccountScreen] Update profile failed:", error)
      Alert.alert("Error", "Failed to update profile")
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout()
            router.replace("/login")
          } catch (error) {
            console.error("[AccountScreen] Logout failed:", error)
          }
        },
      },
    ])
  }

  if (!user && isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator color="#FF6B35" size="large" />
      </View>
    )
  }

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Please login to view your account</Text>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar || "https://via.placeholder.com/80" }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: isDark ? "#fff" : "#000" }]}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{user.role}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? "#222" : "#fff" }]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Feather name={isEditing ? "x" : "edit-2"} size={20} color="#FF6B35" />
            <Text style={[styles.actionButtonText, { color: isDark ? "#fff" : "#000" }]}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Feather name="bell" size={20} color="#FF6B35" />
            <Text style={[styles.actionButtonText, { color: isDark ? "#fff" : "#000" }]}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Form */}
        {isEditing ? (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Edit Profile</Text>

            <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Your name"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
            />

            <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Phone</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Your phone number"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              keyboardType="phone-pad"
            />

            <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Your address"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              multiline
            />

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
                ]}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="City"
                placeholderTextColor={isDark ? "#999" : "#aaa"}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
                ]}
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
                placeholder="State"
                placeholderTextColor={isDark ? "#999" : "#aaa"}
              />
            </View>

            <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Pincode</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              value={formData.pincode}
              onChangeText={(text) => setFormData({ ...formData, pincode: text })}
              placeholder="Pincode"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={[styles.saveButton, isLoading && { opacity: 0.5 }]}
              onPress={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Profile Information</Text>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>{user.phone || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>Address</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>{user.address || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>City</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>{user.city || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>State</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>{user.state || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>Pincode</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>{user.pincode || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#ccc" : "#666" }]}>Member Since</Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
              </Text>
            </View>
          </View>
        )}

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Preferences</Text>

          <View style={styles.preferenceRow}>
            <View>
              <Text style={[styles.preferenceTitle, { color: isDark ? "#fff" : "#000" }]}>Email Notifications</Text>
              <Text style={[styles.preferenceDescription, { color: isDark ? "#ccc" : "#666" }]}>
                {user.email_notifications ? "Enabled" : "Disabled"}
              </Text>
            </View>
            <TouchableOpacity>
              <Feather name="toggle-right" size={24} color={user.email_notifications ? "#22C55E" : "#999"} />
            </TouchableOpacity>
          </View>

          <View style={styles.preferenceRow}>
            <View>
              <Text style={[styles.preferenceTitle, { color: isDark ? "#fff" : "#000" }]}>SMS Notifications</Text>
              <Text style={[styles.preferenceDescription, { color: isDark ? "#ccc" : "#666" }]}>
                {user.sms_notifications ? "Enabled" : "Disabled"}
              </Text>
            </View>
            <TouchableOpacity>
              <Feather name="toggle-left" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ff4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 8,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: 13,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  preferenceDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#ff4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "bold",
  },
})
