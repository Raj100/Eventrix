// "use client"

// import { useState } from "react"
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   useColorScheme,
//   ActivityIndicator,
//   Alert,
// } from "react-native"
// import { useNavigation, useRoute } from "@react-navigation/native"
// import { Feather } from "@expo/vector-icons"
// import { useUserStore, useCartStore } from "@/store"
// import { apiClient } from "@/api/client"

// const CheckoutScreen = () => {
//   const navigation = useNavigation<any>()
//   const route = useRoute<any>()
//   const { user, updateProfile } = useUserStore()
//   const { items, total, clearCart } = useCartStore()
//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === "dark"

//   const { pincode = "", deliveryCharge = 0 } = route.params || {}

//   const [step, setStep] = useState<"address" | "payment" | "confirmation">("address")
//   const [address, setAddress] = useState(user?.address || "")
//   const [city, setCity] = useState(user?.city || "")
//   const [state, setState] = useState(user?.state || "")
//   const [phone, setPhone] = useState(user?.phone || "")
//   const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "razorpay">("razorpay")
//   const [isProcessing, setIsProcessing] = useState(false)

//   const tax = Math.round(total * 0.18)
//   const finalTotal = total + deliveryCharge + tax

//   const handleAddressSubmit = async () => {
//     if (!address || !city || !state || !phone) {
//       Alert.alert("Missing Information", "Please fill in all address fields")
//       return
//     }

//     try {
//       await updateProfile({
//         address,
//         city,
//         state,
//         phone,
//       })
//       setStep("payment")
//     } catch (error) {
//       Alert.alert("Error", "Failed to save address")
//     }
//   }

//   const handlePaymentInitiation = async () => {
//     if (!paymentMethod) {
//       Alert.alert("Payment Method", "Please select a payment method")
//       return
//     }

//     setIsProcessing(true)
//     try {
//       // Create order first
//       const orderData = {
//         items: items.map((item) => ({
//           product_id: item.id,
//           quantity: item.quantity,
//           price: item.price,
//           color: item.color,
//           size: item.size,
//         })),
//         delivery_address: address,
//         delivery_city: city,
//         delivery_state: state,
//         delivery_pincode: pincode,
//         delivery_charge: deliveryCharge,
//         total_amount: finalTotal,
//         payment_method: paymentMethod,
//         status: "pending",
//       }

//       const orderResponse: any = await apiClient.createOrder(orderData)
//       const orderId = orderResponse.id

//       // Initialize payment
//       const paymentInit: any = await apiClient.initializePayment(orderId, paymentMethod)

//       // Navigate to payment screen based on method
//       if (paymentMethod === "razorpay") {
//         navigation.navigate("Payment", {
//           orderId,
//           amount: finalTotal,
//           method: "razorpay",
//           paymentDetails: paymentInit,
//         })
//       } else if (paymentMethod === "upi") {
//         navigation.navigate("Payment", {
//           orderId,
//           amount: finalTotal,
//           method: "upi",
//           paymentDetails: paymentInit,
//         })
//       }
//     } catch (error) {
//       const errorMsg = error instanceof Error ? error.message : "Failed to initiate payment"
//       Alert.alert("Payment Error", errorMsg)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
//       <ScrollView style={styles.content}>
//         {/* Step Indicator */}
//         <View style={styles.stepIndicator}>
//           <View style={[styles.step, step !== "address" && styles.stepCompleted]}>
//             <Text style={[styles.stepNumber, step !== "address" && styles.stepNumberCompleted]}>1</Text>
//           </View>
//           <View style={[styles.stepLine, step === "address" && styles.stepLineInactive]} />
//           <View style={[styles.step, step !== "payment" && step !== "address" && styles.stepCompleted]}>
//             <Text style={[styles.stepNumber, step !== "payment" && step !== "address" && styles.stepNumberCompleted]}>
//               2
//             </Text>
//           </View>
//           <View style={[styles.stepLine, step === "address" && styles.stepLineInactive]} />
//           <View style={[styles.step, step === "confirmation" && styles.stepCompleted]}>
//             <Text style={[styles.stepNumber, step === "confirmation" && styles.stepNumberCompleted]}>3</Text>
//           </View>
//         </View>

//         {step === "address" && (
//           <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//             <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Delivery Address</Text>

//             <TextInput
//               style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
//               placeholder="Full Address"
//               placeholderTextColor={isDark ? "#999" : "#aaa"}
//               value={address}
//               onChangeText={setAddress}
//               multiline
//             />

//             <View style={styles.row}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   styles.halfInput,
//                   { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
//                 ]}
//                 placeholder="City"
//                 placeholderTextColor={isDark ? "#999" : "#aaa"}
//                 value={city}
//                 onChangeText={setCity}
//               />
//               <TextInput
//                 style={[
//                   styles.input,
//                   styles.halfInput,
//                   { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
//                 ]}
//                 placeholder="State"
//                 placeholderTextColor={isDark ? "#999" : "#aaa"}
//                 value={state}
//                 onChangeText={setState}
//               />
//             </View>

//             <TextInput
//               style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
//               placeholder="Phone Number"
//               placeholderTextColor={isDark ? "#999" : "#aaa"}
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />

//             <Text style={[styles.infoText, { color: isDark ? "#ccc" : "#666" }]}>
//               Pincode: {pincode} | Delivery: ₹{deliveryCharge}
//             </Text>

//             <TouchableOpacity style={styles.button} onPress={handleAddressSubmit}>
//               <Text style={styles.buttonText}>Continue to Payment</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {step === "payment" && (
//           <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//             <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Payment Method</Text>

//             <TouchableOpacity
//               style={[styles.paymentOption, paymentMethod === "razorpay" && styles.paymentOptionSelected]}
//               onPress={() => setPaymentMethod("razorpay")}
//             >
//               <View style={styles.paymentOptionContent}>
//                 <Feather name="credit-card" size={24} color={paymentMethod === "razorpay" ? "#FF6B35" : "#999"} />
//                 <View style={styles.paymentOptionText}>
//                   <Text style={[styles.paymentOptionTitle, { color: isDark ? "#fff" : "#000" }]}>Razorpay</Text>
//                   <Text style={styles.paymentOptionDescription}>Card & Digital Wallets</Text>
//                 </View>
//               </View>
//               {paymentMethod === "razorpay" && <Feather name="check-circle" size={24} color="#FF6B35" />}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.paymentOption, paymentMethod === "upi" && styles.paymentOptionSelected]}
//               onPress={() => setPaymentMethod("upi")}
//             >
//               <View style={styles.paymentOptionContent}>
//                 <Feather name="smartphone" size={24} color={paymentMethod === "upi" ? "#FF6B35" : "#999"} />
//                 <View style={styles.paymentOptionText}>
//                   <Text style={[styles.paymentOptionTitle, { color: isDark ? "#fff" : "#000" }]}>UPI</Text>
//                   <Text style={styles.paymentOptionDescription}>Google Pay, PhonePe, Paytm</Text>
//                 </View>
//               </View>
//               {paymentMethod === "upi" && <Feather name="check-circle" size={24} color="#FF6B35" />}
//             </TouchableOpacity>

//             {/* Order Summary */}
//             <View style={[styles.summary, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}>
//               <View style={styles.summaryRow}>
//                 <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Subtotal</Text>
//                 <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{total}</Text>
//               </View>
//               <View style={styles.summaryRow}>
//                 <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Delivery</Text>
//                 <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{deliveryCharge}</Text>
//               </View>
//               <View style={styles.summaryRow}>
//                 <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Tax</Text>
//                 <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{tax}</Text>
//               </View>
//               <View style={[styles.summaryRow, styles.summaryRowTotal]}>
//                 <Text style={styles.summaryLabelTotal}>Total Amount</Text>
//                 <Text style={styles.summaryValueTotal}>₹{finalTotal}</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={[styles.button, isProcessing && { opacity: 0.5 }]}
//               onPress={handlePaymentInitiation}
//               disabled={isProcessing}
//             >
//               {isProcessing ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Proceed to Payment</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   stepIndicator: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 24,
//   },
//   step: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   stepCompleted: {
//     backgroundColor: "#FF6B35",
//   },
//   stepNumber: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#999",
//   },
//   stepNumberCompleted: {
//     color: "#fff",
//   },
//   stepLine: {
//     width: 30,
//     height: 2,
//     backgroundColor: "#FF6B35",
//     marginHorizontal: 8,
//   },
//   stepLineInactive: {
//     backgroundColor: "#ddd",
//   },
//   section: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   input: {
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     fontSize: 14,
//   },
//   row: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   halfInput: {
//     flex: 1,
//     marginBottom: 0,
//   },
//   infoText: {
//     fontSize: 12,
//     marginBottom: 16,
//     fontStyle: "italic",
//   },
//   paymentOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: "#eee",
//   },
//   paymentOptionSelected: {
//     borderColor: "#FF6B35",
//   },
//   paymentOptionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     gap: 12,
//   },
//   paymentOptionText: {
//     flex: 1,
//   },
//   paymentOptionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   paymentOptionDescription: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 2,
//   },
//   summary: {
//     borderRadius: 8,
//     padding: 12,
//     marginVertical: 16,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   summaryRowTotal: {
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     paddingTopMargin: 8,
//   },
//   summaryLabel: {
//     fontSize: 13,
//   },
//   summaryLabelTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   summaryValue: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   summaryValueTotal: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FF6B35",
//   },
//   button: {
//     backgroundColor: "#FF6B35",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 16,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default CheckoutScreen

import { useState } from "react"
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
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, router } from "expo-router"

import { useUserStore, useCartStore } from "../store"
import { apiClient } from "../api/client"

const CheckoutScreen = () => {
  const { pincode = "", deliveryCharge = "0" } = useLocalSearchParams<{
    pincode?: string
    deliveryCharge?: string
  }>()

  const { user, updateProfile } = useUserStore()
  const { items, total, clearCart } = useCartStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const numericDeliveryCharge = Number(deliveryCharge) || 0

  const [step, setStep] = useState<"address" | "payment">("address")
  const [address, setAddress] = useState(user?.address || "")
  const [city, setCity] = useState(user?.city || "")
  const [state, setState] = useState(user?.state || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "upi">("razorpay")
  const [isProcessing, setIsProcessing] = useState(false)

  const tax = Math.round(total * 0.18)
  const finalTotal = total + numericDeliveryCharge + tax

  const handleAddressSubmit = async () => {
    if (!address || !city || !state || !phone) {
      Alert.alert("Missing Information", "Please fill in all address fields")
      return
    }

    try {
      await updateProfile({
        address,
        city,
        state,
        phone,
      })
      setStep("payment")
    } catch {
      Alert.alert("Error", "Failed to save address")
    }
  }

  const handlePaymentInitiation = async () => {
    if (!paymentMethod) {
      Alert.alert("Payment Method", "Please select a payment method")
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        delivery_address: address,
        delivery_city: city,
        delivery_state: state,
        delivery_pincode: pincode,
        delivery_charge: numericDeliveryCharge,
        total_amount: finalTotal,
        payment_method: paymentMethod,
      }

      const orderResponse: any = await apiClient.createOrder(orderData)
      const orderId = orderResponse.id

      const paymentInit: any = await apiClient.initializePayment(orderId, paymentMethod)

      router.push({
        pathname: "/payment",
        params: {
          orderId,
          amount: finalTotal.toString(),
          method: paymentMethod,
          paymentDetails: JSON.stringify(paymentInit),
        },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to initiate payment"
      Alert.alert("Payment Error", errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <ScrollView style={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, step !== "address" && styles.stepCompleted]}>
            <Text style={[styles.stepNumber, step !== "address" && styles.stepNumberCompleted]}>1</Text>
          </View>
          <View style={[styles.stepLine, step === "address" && styles.stepLineInactive]} />
          <View style={[styles.step, step === "payment" && styles.stepCompleted]}>
            <Text style={[styles.stepNumber, step === "payment" && styles.stepNumberCompleted]}>2</Text>
          </View>
        </View>

        {step === "address" && (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Delivery Address</Text>

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              placeholder="Full Address"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
                ]}
                placeholder="City"
                placeholderTextColor={isDark ? "#999" : "#aaa"}
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" },
                ]}
                placeholder="State"
                placeholderTextColor={isDark ? "#999" : "#aaa"}
                value={state}
                onChangeText={setState}
              />
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
              placeholder="Phone Number"
              placeholderTextColor={isDark ? "#999" : "#aaa"}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={[styles.infoText, { color: isDark ? "#ccc" : "#666" }]}>
              Pincode: {pincode} | Delivery: ₹{numericDeliveryCharge}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleAddressSubmit}>
              <Text style={styles.buttonText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "payment" && (
          <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Payment Method</Text>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === "razorpay" && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod("razorpay")}
            >
              <View style={styles.paymentOptionContent}>
                <Feather name="credit-card" size={24} color={paymentMethod === "razorpay" ? "#FF6B35" : "#999"} />
                <View style={styles.paymentOptionText}>
                  <Text style={[styles.paymentOptionTitle, { color: isDark ? "#fff" : "#000" }]}>Razorpay</Text>
                  <Text style={styles.paymentOptionDescription}>Card & Wallets</Text>
                </View>
              </View>
              {paymentMethod === "razorpay" && <Feather name="check-circle" size={24} color="#FF6B35" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === "upi" && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod("upi")}
            >
              <View style={styles.paymentOptionContent}>
                <Feather name="smartphone" size={24} color={paymentMethod === "upi" ? "#FF6B35" : "#999"} />
                <View style={styles.paymentOptionText}>
                  <Text style={[styles.paymentOptionTitle, { color: isDark ? "#fff" : "#000" }]}>UPI</Text>
                  <Text style={styles.paymentOptionDescription}>Google Pay, PhonePe, Paytm</Text>
                </View>
              </View>
              {paymentMethod === "upi" && <Feather name="check-circle" size={24} color="#FF6B35" />}
            </TouchableOpacity>

            {/* Order Summary */}
            <View style={[styles.summary, { backgroundColor: isDark ? "#333" : "#f5f5f5" }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{total}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Delivery</Text>
                <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{numericDeliveryCharge}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: isDark ? "#ccc" : "#666" }]}>Tax</Text>
                <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#000" }]}>₹{tax}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabelTotal}>Total Amount</Text>
                <Text style={styles.summaryValueTotal}>₹{finalTotal}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isProcessing && { opacity: 0.5 }]}
              onPress={handlePaymentInitiation}
              disabled={isProcessing}
            >
              {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Proceed to Payment</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCompleted: {
    backgroundColor: "#FF6B35",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
  },
  stepNumberCompleted: {
    color: "#fff",
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: "#FF6B35",
    marginHorizontal: 8,
  },
  stepLineInactive: {
    backgroundColor: "#ddd",
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    marginBottom: 0,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: "italic",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#eee",
  },
  paymentOptionSelected: {
    borderColor: "#FF6B35",
  },
  paymentOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentOptionDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  summary: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTopMargin: 8,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  button: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CheckoutScreen

