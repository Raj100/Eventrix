"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator, FlatList } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useUserStore } from "@/store"
import { apiClient } from "@/api/client"

interface OrderItem {
  id: string
  total_amount: number
  status: string
  created_at: string
  delivery_address: string
}

const OrdersScreen = () => {
  const { user } = useUserStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useEffect(() => {
      loadOrders()
    }, []),
  )

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response: any = await apiClient.getOrders()
      setOrders(response || [])
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "#22C55E"
      case "processing":
        return "#3B82F6"
      case "shipped":
        return "#FF6B35"
      case "delivered":
        return "#22C55E"
      case "cancelled":
        return "#ff4444"
      default:
        return "#999"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "check-circle"
      case "processing":
        return "package"
      case "shipped":
        return "truck"
      case "delivered":
        return "home"
      case "cancelled":
        return "x-circle"
      default:
        return "info"
    }
  }

  const renderOrderCard = ({ item }: { item: OrderItem }) => (
    <View style={[styles.orderCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderId, { color: isDark ? "#fff" : "#000" }]}>Order #{item.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Feather name={getStatusIcon(item.status) as any} size={14} color="#fff" />
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "#eee" }]} />

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Feather name="map-pin" size={16} color="#FF6B35" />
          <Text style={[styles.detailText, { color: isDark ? "#ccc" : "#666" }]}>{item.delivery_address}</Text>
        </View>
        <View style={[styles.detailItem, { marginTop: 8 }]}>
          <Feather name="dollar-sign" size={16} color="#22C55E" />
          <Text style={[styles.detailText, { color: isDark ? "#fff" : "#000", fontWeight: "bold" }]}>
            ₹{item.total_amount}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Details</Text>
        <Feather name="arrow-right" size={16} color="#FF6B35" />
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7", justifyContent: "center" }]}>
        <ActivityIndicator color="#FF6B35" size="large" />
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
        <View style={styles.emptyContainer}>
          <Feather name="package" size={64} color={isDark ? "#666" : "#ccc"} />
          <Text style={[styles.emptyTitle, { color: isDark ? "#fff" : "#000" }]}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Start shopping to place your first order</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtitle: {
    color: "#999",
    marginTop: 8,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 6,
  },
  viewButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default OrdersScreen
