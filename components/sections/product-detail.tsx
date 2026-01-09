"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2 } from "lucide-react"
import { useProductStore } from "@/lib/zustand-store"
import { productApi } from "@/lib/api-client"

// interface ProductDetailViewProps {
//   productId: string
// }

export function ProductDetailView({productId}:any) {
  console.log("rr",productId);
  const products = useProductStore((state) => state.products)
  const isLoading = useProductStore((state) => state.isLoading)
  const setProducts = useProductStore((state) => state.setProducts)
  const setLoading = useProductStore((state) => state.setLoading)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("overview")

  // 🔹 Load product by ID and store in Zustand
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const product = await productApi.getById(productId)
        setProducts([product])
      } catch (error) {
        console.error("Failed to load product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId, setProducts, setLoading])

  const product = products.find((p) => p.id === productId)

  // 🔹 Initialize defaults once product is available
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] ?? null)
      setSelectedSize(product.sizes?.[0] ?? null)
    }
  }, [product])

  if (isLoading) {
    return <div className="text-center py-10">Loading product...</div>
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center">Product not found</p>
      </div>
    )
  }

  const totalPrice = product.base_price + (selectedSize?.price || 0)
  console.log("test",product.base_price ,selectedSize?.price)



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div>
          <Card className="overflow-hidden mb-4 bg-muted h-96 flex items-center justify-center">
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </Card>

          {/* Image Thumbnails */}
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  currentImageIndex === index ? "border-accent" : "border-border"
                }`}
              >
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground uppercase mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-foreground mb-4">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-2">Price</p>
            <p className="text-4xl font-bold text-accent">₹{totalPrice}</p>
          </div>

          {/* Options */}
          <div className="space-y-6">
            {/* Color Selection */}
<div>
  <label className="block text-sm font-bold mb-3">Color</label>
  <div className="flex gap-3">
    {product.colors.map((color: { name: string; code: string }) => (
      <button
        key={color.code} // Use the hex code as a unique key
        onClick={() => setSelectedColor(color.name)} // Store the name string
        className={`px-4 py-2 rounded-lg border-2 transition flex items-center gap-2 justify-center ${
          selectedColor === color.name ? "border-accent bg-accent/10" : "border-border"
        }`}
      >
        <div className="w-4 h-4 rounded-full" style={{ background: color.code }} ></div>
        {color.name} {/* ✅ Success: This is a string now */}
      </button>
    ))}
  </div>
</div>

            {/* Size Selection */}
<div>
  <label className="block text-sm font-bold mb-3">Size</label>
  <div className="space-y-2">
    {product.sizes?.map((size: any) => (
      <button
        key={size.name}
        onClick={() => setSelectedSize(size)}
        className={`w-full px-4 py-3 rounded-lg border-2 transition text-left ${
          selectedSize?.name === size.name
            ? "border-accent bg-accent/10"
            : "border-border"
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{size.name}</span>
          {size.price_multiplier > 1 && (
            <span className="text-sm text-muted-foreground">
              x{size.price_multiplier}
            </span>
          )}
        </div>
      </button>
    ))}
  </div>
</div>


            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-input hover:bg-muted transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-input hover:bg-muted transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/customize" className="flex-1">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-base">
                  Customize Design
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-4 bg-transparent">
                <Heart size={20} />
              </Button>
              <Button variant="outline" size="lg" className="px-4 bg-transparent">
                <Share2 size={20} />
              </Button>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base">
              Add to Cart
            </Button>
          </div>

          {/* Delivery Info */}
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <p className="text-sm font-bold mb-2">Estimated Delivery</p>
            <p className="text-sm text-muted-foreground">{product.deliveryTime}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-8">
          {["overview", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold capitalize transition ${
                activeTab === tab
                  ? "border-b-2 border-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-bold mb-4">About This Product</h3>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <h4 className="text-lg font-bold mb-2 mt-6">Key Features</h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Premium quality ceramic material</li>
            <li>High-resolution custom printing</li>
            <li>Dishwasher and microwave safe</li>
            <li>Perfect for gifts and corporate use</li>
            <li>Quick turnaround time</li>
          </ul>
        </div>
      )}

      {activeTab === "specifications" && (
        <div>
          <h3 className="text-xl font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
          <p className="text-muted-foreground">Reviews coming soon...</p>
        </div>
      )}
    </div>
  )
}
