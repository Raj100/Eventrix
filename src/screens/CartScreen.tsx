import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useCartStore } from "@/store"
import { Feather } from "@expo/vector-icons"

const CartScreen = () => {
  const navigation = useNavigation()
  const { items, total, removeItem, updateQuantity } = useCartStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const handleCheckout = () => {
    navigation.navigate("Checkout" as never)
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
        <View style={styles.emptyContainer}>
          <Feather name="shopping-cart" size={64} color={isDark ? "#666" : "#ccc"} />
          <Text style={[styles.emptyTitle, { color: isDark ? "#fff" : "#000" }]}>Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Start shopping to add items</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate("Products" as never)}>
            <Text style={styles.emptyButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const shipping = total > 2000 ? 0 : 150
  const tax = Math.round(total * 0.18)
  const finalTotal = total + shipping + tax

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <ScrollView style={styles.content}>
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
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
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
      </ScrollView>

      <View style={[styles.summary, { backgroundColor: isDark ? "#222" : "#fff" }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{total}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: isDark ? "#fff" : "#000" }]}>Tax</Text>
          <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{tax}</Text>
        </View>
        <View style={[styles.totalRow, { borderTopColor: isDark ? "#333" : "#eee" }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{finalTotal}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

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

export default CartScreen
