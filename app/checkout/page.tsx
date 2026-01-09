"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CreditCard, Smartphone, AlertCircle } from "lucide-react"
import { useAuthStore, useCartStore, useDeliveryStore } from "@/lib/zustand-store"
import { orderApi, paymentApi, deliveryApi } from "@/lib/api-client"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const { items, subtotal, tax, updateDeliveryCharge, clearCart } = useCartStore()
  const { setPincode, deliveryCharges } = useDeliveryStore()

  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "gpay">("card")
  const [deliveryCharge, setDeliveryChargeState] = useState(0)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  })

  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [user, items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "pincode" && value.length === 6) {
      fetchDeliveryCharge(value)
    }
  }

  const fetchDeliveryCharge = async (pincode: string) => {
    try {
      const charge = await deliveryApi.getCharges(pincode)
      setDeliveryChargeState(charge.charge)
      updateDeliveryCharge(charge.charge)
      setPincode(pincode)
    } catch (error) {
      console.error("Delivery not available for this pincode")
      setError("Delivery not available for this pincode")
    }
  }

  const handleAddressSubmit = () => {
    // Validate form
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.pincode
    ) {
      setError("Please fill all required fields")
      return
    }
    setError("")
    setStep("payment")
  }

  const handlePaymentSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setError("")

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          color: item.color || "Default",
          size: item.size || "Standard",
          price: item.price,
          design_template_id: item.design?.template,
          custom_design: item.design,
        })),
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        pincode: formData.pincode,
        payment_method: paymentMethod,
      }

      const order = await orderApi.create(token, orderPayload)

      await paymentApi.initiate(token, {
        order_id: order.id,
        amount: order.total,
        payment_method: paymentMethod,
      })

      // For now, we'll mark it as verified
      await paymentApi.verify(token, order.id, {
        transaction_id: order.id,
        status: "success",
      })

      setOrderData(order)
      clearCart()
      setStep("confirmation")
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const total = subtotal + tax + deliveryCharge

  if (step === "confirmation" && orderData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md text-center py-16 px-4">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-4">Your order #{orderData.id} has been placed successfully.</p>
            <p className="text-muted-foreground mb-8">A confirmation email has been sent to {formData.email}</p>

            <div className="bg-secondary p-6 rounded-lg mb-8 text-left">
              <p className="text-sm font-bold mb-4">Order Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-bold">{items.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-bold">₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-bold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/account">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Track Your Order</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === "address" && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground mb-4"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground mb-4"
                  />

                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="PIN Code"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                      maxLength={6}
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                    >
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleAddressSubmit}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base"
                  >
                    Continue to Payment
                  </Button>
                </Card>
              )}

              {step === "payment" && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-8">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full p-4 border-2 rounded-lg transition text-left ${
                        paymentMethod === "card" ? "border-accent bg-accent/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={24} />
                        <div>
                          <p className="font-bold">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`w-full p-4 border-2 rounded-lg transition text-left ${
                        paymentMethod === "upi" ? "border-accent bg-accent/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone size={24} />
                        <div>
                          <p className="font-bold">UPI Payment</p>
                          <p className="text-sm text-muted-foreground">Google Pay, PhonePe, BHIM</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("gpay")}
                      className={`w-full p-4 border-2 rounded-lg transition text-left ${
                        paymentMethod === "gpay" ? "border-accent bg-accent/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone size={24} />
                        <div>
                          <p className="font-bold">Google Pay</p>
                          <p className="text-sm text-muted-foreground">Fast and secure payments</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mb-8 p-6 bg-secondary rounded-lg">
                      <input
                        type="text"
                        placeholder="Card Number (test: 4111111111111111)"
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button onClick={() => setStep("address")} variant="outline" className="flex-1 bg-transparent">
                      Back
                    </Button>
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base"
                    >
                      {isLoading ? "Processing..." : "Complete Payment"}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="sticky top-24 h-fit">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-bold">₹{deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-bold text-accent">₹{total.toFixed(2)}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
