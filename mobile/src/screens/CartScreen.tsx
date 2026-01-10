import { useState, useCallback } from "react"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"

import { useCartStore } from "../store/useCartStore"
import { apiClient } from "../api/client"

const CartScreen = () => {
  const { items, total, removeItem, updateQuantity } = useCartStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [pincode, setPincode] = useState("")
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [loadingDelivery, setLoadingDelivery] = useState(false)
  const [deliveryError, setDeliveryError] = useState("")

  const handleFetchDeliveryCharge = useCallback(async () => {
    if (!pincode || pincode.length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode")
      return
    }

    setLoadingDelivery(true)
    setDeliveryError("")

    try {
      const response: any = await apiClient.getDeliveryCharge(pincode)
      setDeliveryCharge(response?.charge || 0)
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to fetch delivery charge"
      setDeliveryError(errorMsg)
      Alert.alert("Error", errorMsg)
    } finally {
      setLoadingDelivery(false)
    }
  }, [pincode])

  const handleCheckout = () => {
    if (!pincode || pincode.length !== 6) {
      Alert.alert("Pincode Required", "Please enter a valid pincode to proceed")
      return
    }

    router.push({
      pathname: "/checkout",
      params: {
        pincode,
        deliveryCharge: String(deliveryCharge),
        total: String(total),
      },
    })
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
        <View style={styles.emptyContainer}>
          <Feather name="shopping-cart" size={64} color={isDark ? "#666" : "#ccc"} />
          <Text style={[styles.emptyTitle, { color: isDark ? "#fff" : "#000" }]}>Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Start shopping to add items</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.replace("/products")}
          >
            <Text style={styles.emptyButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const tax = Math.round(total * 0.18)
  const finalTotal = total + deliveryCharge + tax

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <ScrollView style={styles.content}>
        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.id} style={[styles.cartItem, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Image source={{ uri: item.image || "https://via.placeholder.com/80" }} style={styles.itemImage} />

            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: isDark ? "#fff" : "#000" }]}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.color} | {item.size}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>

            <View style={styles.itemQuantity}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Feather name="minus" size={18} color="#FF6B35" />
              </TouchableOpacity>

              <Text style={[styles.quantity, { color: isDark ? "#fff" : "#000" }]}>{item.quantity}</Text>

              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                <Feather name="plus" size={18} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Feather name="trash-2" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Delivery Section */}
        <View style={[styles.pincodeSection, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Delivery Details</Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? "#ccc" : "#666" }]}>
            Enter your pincode to calculate delivery charge
          </Text>

          <View style={styles.pincodeContainer}>
            <TextInput
              style={[
                styles.pincodeInput,
                { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
              ]}
              placeholder="Enter 6-digit pincode"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loadingDelivery}
            />

            <TouchableOpacity
              style={styles.checkButton}
              onPress={handleFetchDeliveryCharge}
              disabled={loadingDelivery}
            >
              {loadingDelivery ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Feather name="check" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {deliveryError ? <Text style={styles.errorText}>{deliveryError}</Text> : null}

          {pincode.length === 6 && !loadingDelivery && (
            <Text style={styles.deliveryChargeText}>Delivery Charge: ₹{deliveryCharge}</Text>
          )}
        </View>
      </ScrollView>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: isDark ? "#222" : "#fff" }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{total}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Delivery</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{deliveryCharge}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Tax (18%)</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{tax}</Text>
        </View>

        <View style={[styles.totalRow, { borderTopColor: isDark ? "#333" : "#eee" }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{finalTotal}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, (!pincode || pincode.length !== 6) && { opacity: 0.5 }]}
          onPress={handleCheckout}
          disabled={!pincode || pincode.length !== 6}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtitle: {
    color: "#999",
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  itemQuantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  pincodeSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  pincodeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  pincodeInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  checkButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  deliveryChargeText: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
