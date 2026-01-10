"use client"

import { useEffect, useState } from "react"
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useUserStore } from "@/store"
import { apiClient } from "@/api/client"

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  delivery_address: string
  delivery_city: string
  delivery_state: string
  delivery_pincode: string
}

const OrderConfirmationScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { user } = useUserStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [])

  const loadOrder = async () => {
    try {
      const orderData: any = await apiClient.getOrderById(route.params.orderId)
      setOrder(orderData)
    } catch (error) {
      console.error("Failed to load order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
        <ActivityIndicator color="#FF6B35" size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={50} color="#fff" />
          </View>
          <Text style={[styles.successTitle, { color: isDark ? "#fff" : "#000" }]}>Order Confirmed!</Text>
          <Text style={[styles.successSubtitle, { color: isDark ? "#ccc" : "#666" }]}>Thank you for your order</Text>
        </View>

        {/* Order Details */}
        {order && (
          <>
            <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Order Details</Text>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#ccc" : "#666" }]}>Order ID</Text>
                <Text style={[styles.detailValue, { color: isDark ? "#fff" : "#000" }]}>{order.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#ccc" : "#666" }]}>Amount</Text>
                <Text style={[styles.detailValue, { color: isDark ? "#fff" : "#000" }]}>₹{order.total_amount}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#ccc" : "#666" }]}>Date</Text>
                <Text style={[styles.detailValue, { color: isDark ? "#fff" : "#000" }]}>
                  {new Date(order.created_at).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#ccc" : "#666" }]}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: "#22C55E" }]}>
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Delivery Address</Text>

              <Text style={[styles.addressText, { color: isDark ? "#ccc" : "#666" }]}>
                {order.delivery_address}
                {"\n"}
                {order.delivery_city}, {order.delivery_state} {order.delivery_pincode}
              </Text>
            </View>

            {/* Next Steps */}
            <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>What's Next?</Text>

              <View style={styles.step}>
                <View style={styles.stepIcon}>
                  <Feather name="check-circle" size={24} color="#22C55E" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: isDark ? "#fff" : "#000" }]}>Order Confirmed</Text>
                  <Text style={[styles.stepDescription, { color: isDark ? "#ccc" : "#666" }]}>
                    Your order has been successfully placed
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepIcon}>
                  <Feather name="package" size={24} color="#FF6B35" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: isDark ? "#fff" : "#000" }]}>Processing</Text>
                  <Text style={[styles.stepDescription, { color: isDark ? "#ccc" : "#666" }]}>
                    We're preparing your order for shipment
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepIcon}>
                  <Feather name="truck" size={24} color="#999" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: isDark ? "#fff" : "#000" }]}>On The Way</Text>
                  <Text style={[styles.stepDescription, { color: isDark ? "#ccc" : "#666" }]}>
                    Your order will be delivered soon
                  </Text>
                </View>
              </View>
            </View>

            {/* Email Confirmation */}
            <View style={[styles.emailSection, { backgroundColor: isDark ? "#222" : "#f5f5f5" }]}>
              <Feather name="mail" size={20} color="#FF6B35" />
              <View style={styles.emailContent}>
                <Text style={[styles.emailTitle, { color: isDark ? "#fff" : "#000" }]}>Confirmation Email Sent</Text>
                <Text style={[styles.emailDescription, { color: isDark ? "#ccc" : "#666" }]}>
                  Check your email at {user?.email} for order details
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AccountTab", { screen: "Orders" })}
        >
          <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: "#FF6B35" }]}
          onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
        >
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  successContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 13,
    lineHeight: 20,
  },
  step: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    flex: 1,
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  stepDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  emailSection: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  emailContent: {
    flex: 1,
  },
  emailTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  emailDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default OrderConfirmationScreen
