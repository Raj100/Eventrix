"use client"

import { useState } from "react"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useCartStore } from "@/store"
import { apiClient } from "@/api/client"

const PaymentScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { clearCart } = useCartStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const { orderId, amount, method, paymentDetails } = route.params

  const [isProcessing, setIsProcessing] = useState(false)
  const [upiId, setUpiId] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const handleRazorpayPayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate Razorpay payment gateway integration
      // In production, you would integrate with Razorpay SDK
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock payment ID and signature
      const paymentId = `pay_${Date.now()}`
      const signature = `sig_${Date.now()}`

      // Verify payment with backend
      const response: any = await apiClient.verifyPayment(orderId, paymentId, signature)

      if (response.status === "success") {
        clearCart()
        navigation.navigate("OrderConfirmation", { orderId })
      } else {
        Alert.alert("Payment Failed", "Your payment could not be processed. Please try again.")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Payment failed"
      Alert.alert("Payment Error", errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUPIPayment = async () => {
    if (!upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/)) {
      Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g., user@upi)")
      return
    }

    setIsProcessing(true)
    try {
      // Simulate UPI payment gateway integration
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentId = `upi_${Date.now()}`
      const signature = `sig_${Date.now()}`

      const response: any = await apiClient.verifyPayment(orderId, paymentId, signature)

      if (response.status === "success") {
        clearCart()
        navigation.navigate("OrderConfirmation", { orderId })
      } else {
        Alert.alert("Payment Failed", "Your UPI payment could not be processed. Please try again.")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "UPI payment failed"
      Alert.alert("Payment Error", errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      Alert.alert("Missing Details", "Please fill in all card details")
      return
    }

    setIsProcessing(true)
    try {
      // Simulate card payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentId = `card_${Date.now()}`
      const signature = `sig_${Date.now()}`

      const response: any = await apiClient.verifyPayment(orderId, paymentId, signature)

      if (response.status === "success") {
        clearCart()
        navigation.navigate("OrderConfirmation", { orderId })
      } else {
        Alert.alert("Payment Failed", "Your card payment could not be processed. Please try again.")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Card payment failed"
      Alert.alert("Payment Error", errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        {/* Payment Header */}
        <View style={[styles.header, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>Order Payment</Text>
          <Text style={[styles.orderId, { color: isDark ? "#ccc" : "#666" }]}>Order ID: {orderId}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{amount}</Text>
          </View>
        </View>

        {method === "razorpay" && (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Razorpay Payment</Text>
            <Text style={[styles.sectionDescription, { color: isDark ? "#ccc" : "#666" }]}>
              Secure payment gateway supporting all major payment methods
            </Text>

            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[styles.paymentMethodCard, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleRazorpayPayment}
                disabled={isProcessing}
              >
                <Feather name="credit-card" size={32} color="#FF6B35" />
                <Text style={[styles.paymentMethodTitle, { color: isDark ? "#fff" : "#000" }]}>Debit/Credit Card</Text>
                <Text style={styles.paymentMethodDescription}>Visa, Mastercard, Amex</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodCard, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleRazorpayPayment}
                disabled={isProcessing}
              >
                <Feather name="smartphone" size={32} color="#FF6B35" />
                <Text style={[styles.paymentMethodTitle, { color: isDark ? "#fff" : "#000" }]}>Mobile Wallet</Text>
                <Text style={styles.paymentMethodDescription}>Google Pay, Apple Pay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodCard, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleRazorpayPayment}
                disabled={isProcessing}
              >
                <Feather name="bank" size={32} color="#FF6B35" />
                <Text style={[styles.paymentMethodTitle, { color: isDark ? "#fff" : "#000" }]}>Net Banking</Text>
                <Text style={styles.paymentMethodDescription}>All major banks</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, isProcessing && { opacity: 0.5 }]}
              onPress={handleRazorpayPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="check-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Pay ₹{amount}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {method === "upi" && (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>UPI Payment</Text>
            <Text style={[styles.sectionDescription, { color: isDark ? "#ccc" : "#666" }]}>
              Instant payment using your UPI app
            </Text>

            <View style={styles.upiApps}>
              <TouchableOpacity
                style={[styles.upiAppButton, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleUPIPayment}
              >
                <Feather name="smartphone" size={24} color="#FF6B35" />
                <Text style={[styles.upiAppName, { color: isDark ? "#fff" : "#000" }]}>Google Pay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.upiAppButton, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleUPIPayment}
              >
                <Feather name="smartphone" size={24} color="#FF6B35" />
                <Text style={[styles.upiAppName, { color: isDark ? "#fff" : "#000" }]}>PhonePe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.upiAppButton, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}
                onPress={handleUPIPayment}
              >
                <Feather name="smartphone" size={24} color="#FF6B35" />
                <Text style={[styles.upiAppName, { color: isDark ? "#fff" : "#000" }]}>Paytm</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "#eee" }]} />

            <Text style={[styles.upiIdLabel, { color: isDark ? "#fff" : "#000" }]}>Or enter UPI ID</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              placeholder="user@upi"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              value={upiId}
              onChangeText={setUpiId}
              keyboardType="email-address"
              editable={!isProcessing}
            />

            <TouchableOpacity
              style={[styles.button, isProcessing && { opacity: 0.5 }]}
              onPress={handleUPIPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="check-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Pay ₹{amount}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Security Info */}
        <View style={[styles.securityInfo, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Feather name="shield" size={20} color="#22C55E" />
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, { color: isDark ? "#fff" : "#000" }]}>Secure Payment</Text>
            <Text style={[styles.securityDescription, { color: isDark ? "#ccc" : "#666" }]}>
              Your payment information is encrypted and secure
            </Text>
          </View>
        </View>
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
  header: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderId: {
    fontSize: 12,
    marginTop: 4,
  },
  amountContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  amountLabel: {
    fontSize: 12,
    color: "#999",
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B35",
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 16,
  },
  paymentMethods: {
    gap: 12,
    marginBottom: 16,
  },
  paymentMethodCard: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  paymentMethodDescription: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  upiApps: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    gap: 8,
  },
  upiAppButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  upiAppName: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  upiIdLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  securityInfo: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  securityDescription: {
    fontSize: 12,
    marginTop: 2,
  },
})

export default PaymentScreen
