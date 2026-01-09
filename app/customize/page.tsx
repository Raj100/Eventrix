"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TemplateSelector } from "@/components/sections/template-selector"
import { DesignEditor } from "@/components/sections/design-editor"
import { PreviewCanvas } from "@/components/sections/preview-canvas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProductStore, useDesignStore, useCartStore, useAuthStore, useDeliveryStore } from "@/lib/zustand-store"
import { deliveryApi } from "@/lib/api-client"
import { AlertCircle } from "lucide-react"
import { useLoadCatalog } from "@/lib/hooks/useLoadCatalog"


export default function CustomizePage() {
  const router = useRouter()
const { user, hasHydrated } = useAuthStore()

  const { products, setProducts} = useProductStore()
  const { selectedProduct, selectedTemplate, setSelectedProduct, setSelectedTemplate, reset } = useDesignStore()
  const { addItem } = useCartStore()
  const { pincode, setPincode, deliveryCharges } = useDeliveryStore()

  const [step, setStep] = useState<"product" | "template" | "design" | "checkout">("product")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
useLoadCatalog()

  useEffect(() => {
      if (!hasHydrated) return
      

    // Redirect if not logged in

    if (!user) {
      router.push("/auth/login")
      return
    }
    setIsLoading(false)
  }, [user, router])

  const handleProductSelect = async (productId: string) => {
    try {
      const product = products.find((p) => p._id === productId || p.id === productId)
      if (product) {
        setSelectedProduct(product)
        setStep("template")
      }
    } catch (err) {
      setError("Failed to select product")
    }
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setStep("design")
  }

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedTemplate) {
      setError("Please complete your design first")
      return
    }

    try {
      const cartItem = {
        id: `${selectedProduct._id}-${selectedTemplate._id}`,
        name: `${selectedProduct.name} - ${selectedTemplate.name}`,
        price: selectedProduct.base_price + (selectedTemplate.price_adjustment || 0),
        quantity: 1,
        image: selectedTemplate.preview_image,
        design: {
          template: selectedTemplate._id,
          customText: "",
          textColor: "#000000",
          fontSize: 24,
        },
        deliveryCharge: shippingCost,
      }

      addItem(cartItem)
      reset()
      router.push("/cart")
    } catch (err: any) {
      setError(err.message || "Failed to add to cart")
    }
  }

  const handlePincodeChange = async (newPincode: string) => {
    if (newPincode.length === 6) {
      try {
        setPincode(newPincode)
        const chargeData = await deliveryApi.getCharges(newPincode)
        setShippingCost(chargeData.charge)
      } catch (err) {
        setError("Delivery not available for this pincode")
        setShippingCost(0)
      }
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
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
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Design Your Product</h1>
          <p className="text-center text-muted-foreground mb-8">Choose from our templates or upload your own design</p>

          {step === "product" && <ProductSelector onSelect={handleProductSelect} products={products} />}

          {step === "template" && selectedProduct && (
            <TemplateSelector
              product={selectedProduct}
              onSelect={handleTemplateSelect}
              onBack={() => setStep("product")}
            />
          )}

          {step === "design" && selectedProduct && selectedTemplate && (
            <DesignStep
              product={selectedProduct}
              template={selectedTemplate}
              shippingCost={shippingCost}
              pincode={pincode}
              onPincodeChange={handlePincodeChange}
              onAddToCart={handleAddToCart}
              onBack={() => setStep("template")}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ProductSelector({ onSelect, products }: { onSelect: (id: string) => void; products: any[] }) {
  const defaultProducts = [
    { id: "mug", name: "Custom Mug", category: "mugs" },
    { id: "tshirt", name: "T-Shirt", category: "t-shirts" },
    { id: "business-card", name: "Business Card", category: "business-cards" },
    { id: "poster", name: "Poster", category: "posters" },
    { id: "hoodie", name: "Hoodie", category: "gifts" },
  ]

  const displayProducts = products.length > 0 ? products : defaultProducts

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {displayProducts.slice(0, 5).map((product) => (
        <button
          key={product._id || product.id}
          onClick={() => onSelect(product._id || product.id)}
          className="p-6 rounded-lg border-2 border-border hover:border-accent hover:bg-accent/5 transition text-center"
        >
          <div className="text-4xl mb-3">
            {product.category?.includes("mug")
              ? "☕"
              : product.category?.includes("t-shirt")
                ? "👕"
                : product.category?.includes("business")
                  ? "🎴"
                  : product.category?.includes("poster")
                    ? "📄"
                    : "🧥"}
          </div>
          <h3 className="font-bold">{product.name}</h3>
        </button>
      ))}
    </div>
  )
}

function DesignStep({
  product,
  template,
  shippingCost,
  pincode,
  onPincodeChange,
  onAddToCart,
  onBack,
}: {
  product: any
  template: any
  shippingCost: number
  pincode: string
  onPincodeChange: (pincode: string) => void
  onAddToCart: () => void
  onBack: () => void
}) {
  const totalPrice = (product.base_price || 0) + (template.price_adjustment || 0) + shippingCost

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-transparent">
          ← Back
        </Button>
        <DesignEditor product={product} template={template} />
      </div>
      <div>
        <PreviewCanvas product={product} price={totalPrice} />

        {/* Delivery Pincode */}
        <Card className="p-6 mt-4">
          <h3 className="font-bold mb-3">Delivery Location</h3>
          <input
            type="text"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => onPincodeChange(e.target.value)}
            maxLength={6}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground mb-3"
          />
          {shippingCost > 0 && (
            <div className="text-sm">
              <p className="text-muted-foreground mb-2">Delivery Charge: ₹{shippingCost}</p>
              <p className="text-xs text-muted-foreground">Delivery: 2-4 business days</p>
            </div>
          )}
        </Card>

        {/* Add to Cart */}
        <Button
          onClick={onAddToCart}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base gap-2 mt-4"
        >
          Add to Cart - ₹{totalPrice}
        </Button>
      </div>
    </div>
  )
}
