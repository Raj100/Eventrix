// import { useEffect, useState, useCallback } from "react"
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   useColorScheme,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
// } from "react-native"
// import { Feather } from "@expo/vector-icons"
// import { useLocalSearchParams, router } from "expo-router"

// import { useProductStore } from "../store/useProductStore"
// import { useCartStore } from "../store/useCartStore"

// const { width } = Dimensions.get("window")

// const ProductDetailScreen = () => {
//   const { id } = useLocalSearchParams<{ id: string }>()

//   const { fetchProductById, isLoading } = useProductStore()
//   const { addItem } = useCartStore()

//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === "dark"

//   const [product, setProduct] = useState<any>(null)
//   const [selectedColor, setSelectedColor] = useState<string | null>(null)
//   const [selectedSize, setSelectedSize] = useState<string | null>(null)
//   const [quantity, setQuantity] = useState(1)
//   const [selectedImage, setSelectedImage] = useState(0)

//   const loadProduct = useCallback(async () => {
//     try {
//       if (!id) return
//       const data = await fetchProductById(id as string)

//       if (data) {
//         setProduct(data)
//         if (data.colors?.length > 0) setSelectedColor(data.colors[0])
//         if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
//       }
//     } catch (error) {
//       console.error("[ProductDetailScreen] Failed to load product:", error)
//     }
//   }, [id])

//   useEffect(() => {
//     loadProduct()
//   }, [loadProduct])

//   const handleAddToCart = () => {
//     if (!product) return

//     if (product.colors?.length && !selectedColor) {
//       Alert.alert("Selection Required", "Please select color")
//       return
//     }

//     if (product.sizes?.length && !selectedSize) {
//       Alert.alert("Selection Required", "Please select size")
//       return
//     }

//     addItem({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       quantity,
//       image: product.images?.[0] || "",
//       color: selectedColor,
//       size: selectedSize,
//     })

//     Alert.alert("Success", "Product added to cart!", [
//       { text: "Continue Shopping", onPress: () => router.back() },
//       { text: "View Cart", onPress: () => router.push("/cart") },
//     ])
//   }

//   if (isLoading || !product) {
//     return (
//       <View
//         style={[
//           styles.container,
//           {
//             backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7",
//             justifyContent: "center",
//             alignItems: "center",
//           },
//         ]}
//       >
//         <ActivityIndicator color="#FF6B35" size="large" />
//       </View>
//     )
//   }

//   return (
//     <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
//       {/* Image Gallery */}
//       <View style={styles.imageGallery}>
//         <Image
//           source={{ uri: product.images?.[selectedImage] || "https://via.placeholder.com/400x400" }}
//           style={styles.mainImage}
//         />

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.thumbnailScroll}
//           contentContainerStyle={styles.thumbnailContent}
//         >
//           {product.images?.map((img: string, idx: number) => (
//             <TouchableOpacity key={idx} onPress={() => setSelectedImage(idx)}>
//               <Image
//                 source={{ uri: img }}
//                 style={[styles.thumbnail, selectedImage === idx && styles.thumbnailActive]}
//               />
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Product Info */}
//       <View style={styles.content}>
//         <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]}>{product.name}</Text>

//         {/* Rating */}
//         <View style={styles.ratingContainer}>
//           <View style={styles.ratingStars}>
//             {[...Array(5)].map((_, i) => (
//               <Feather
//                 key={i}
//                 name="star"
//                 size={16}
//                 color={i < Math.floor(product.rating || 0) ? "#FFC107" : "#ddd"}
//               />
//             ))}
//           </View>
//           <Text style={styles.ratingText}>
//             {product.rating || 0} ({product.reviews || 0} reviews)
//           </Text>
//         </View>

//         {/* Price */}
//         <View style={styles.priceSection}>
//           <Text style={styles.price}>₹{product.price}</Text>
//           {product.original_price && <Text style={styles.originalPrice}>₹{product.original_price}</Text>}
//         </View>

//         {/* Description */}
//         <Text style={[styles.description, { color: isDark ? "#ccc" : "#666" }]}>{product.description}</Text>

//         {/* Color Selection */}
//         {product.colors?.length > 0 && (
//           <View style={styles.optionSection}>
//             <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Select Color</Text>
//             <View style={styles.optionGrid}>
//               {product.colors.map((color: string) => (
//                 <TouchableOpacity
//                   key={color}
//                   style={[
//                     styles.colorOption,
//                     { backgroundColor: color },
//                     selectedColor === color && styles.colorOptionSelected,
//                   ]}
//                   onPress={() => setSelectedColor(color)}
//                 >
//                   {selectedColor === color && <Feather name="check" size={20} color="#fff" />}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Size Selection */}
//         {product.sizes?.length > 0 && (
//           <View style={styles.optionSection}>
//             <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Select Size</Text>
//             <View style={styles.sizeGrid}>
//               {product.sizes.map((size: string) => (
//                 <TouchableOpacity
//                   key={size}
//                   style={[
//                     styles.sizeOption,
//                     { backgroundColor: isDark ? "#222" : "#fff" },
//                     selectedSize === size && styles.sizeOptionSelected,
//                   ]}
//                   onPress={() => setSelectedSize(size)}
//                 >
//                   <Text style={[styles.sizeText, selectedSize === size && { color: "#fff" }]}>{size}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Quantity */}
//         <View style={styles.quantitySection}>
//           <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Quantity</Text>
//           <View style={[styles.quantityControl, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//             <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
//               <Feather name="minus" size={20} color="#FF6B35" />
//             </TouchableOpacity>

//             <Text style={[styles.quantityText, { color: isDark ? "#fff" : "#000" }]}>{quantity}</Text>

//             <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
//               <Feather name="plus" size={20} color="#FF6B35" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Add to Cart Button */}
//         <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
//           <Feather name="shopping-cart" size={20} color="#fff" style={{ marginRight: 8 }} />
//           <Text style={styles.addToCartText}>Add to Cart</Text>
//         </TouchableOpacity>

//         {/* Customize Option */}
//         <TouchableOpacity
//           style={[styles.customizeButton, { borderColor: "#FF6B35" }]}
//           onPress={() => router.push(`/customize/${product.id}`)}
//         >
//           <Feather name="pen-tool" size={20} color="#FF6B35" />
//           <Text style={styles.customizeButtonText}>Customize This Product</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// export default ProductDetailScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   imageGallery: {
//     backgroundColor: "#fff",
//   },
//   mainImage: {
//     width: "100%",
//     aspectRatio: 1,
//   },
//   thumbnailScroll: {
//     paddingVertical: 12,
//   },
//   thumbnailContent: {
//     paddingHorizontal: 16,
//   },
//   thumbnail: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   thumbnailActive: {
//     borderColor: "#FF6B35",
//   },
//   content: {
//     padding: 16,
//   },
//   productName: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 8,
//   },
//   ratingStars: {
//     flexDirection: "row",
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     color: "#999",
//   },
//   priceSection: {
//     marginBottom: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   price: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FF6B35",
//   },
//   originalPrice: {
//     fontSize: 16,
//     color: "#999",
//     textDecorationLine: "line-through",
//   },
//   description: {
//     fontSize: 14,
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   optionSection: {
//     marginBottom: 20,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   optionGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   colorOption: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     borderWidth: 3,
//     borderColor: "transparent",
//   },
//   colorOptionSelected: {
//     borderColor: "#FF6B35",
//   },
//   sizeGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   sizeOption: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     minWidth: 60,
//     alignItems: "center",
//   },
//   sizeOptionSelected: {
//     backgroundColor: "#FF6B35",
//   },
//   sizeText: {
//     fontWeight: "600",
//     color: "#666",
//   },
//   quantitySection: {
//     marginBottom: 20,
//   },
//   quantityControl: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   addToCartButton: {
//     backgroundColor: "#FF6B35",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   addToCartText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   customizeButton: {
//     borderWidth: 2,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   customizeButtonText: {
//     color: "#FF6B35",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

import { useEffect, useState, useCallback } from "react"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, router } from "expo-router"

import { useProductStore } from "../store/useProductStore"
import { useCartStore } from "../store/useCartStore"

type ColorType = {
  name: string
  code: string
}

type SizeType = {
  name: string
  price_multiplier: number
}

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { fetchProductById, isLoading } = useProductStore()
  const { addItem } = useCartStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [product, setProduct] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null)
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const loadProduct = useCallback(async () => {
    try {
      if (!id) return
      const data = await fetchProductById(id as string)

      if (data) {
        setProduct(data)
        if (data.colors?.length > 0) setSelectedColor(data.colors[0])
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
      }
    } catch (error) {
      console.error("[ProductDetailScreen] Failed to load product:", error)
    }
  }, [id])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  const handleAddToCart = () => {
    if (!product) return

    if (product.colors?.length && !selectedColor) {
      Alert.alert("Selection Required", "Please select color")
      return
    }

    if (product.sizes?.length && !selectedSize) {
      Alert.alert("Selection Required", "Please select size")
      return
    }

    const finalPrice =
      product.base_price * (selectedSize?.price_multiplier ?? 1)

    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      quantity,
      image: product.images?.[0] || "",
      color: selectedColor?.name || "",
      size: selectedSize?.name || "",
    })

    Alert.alert("Success", "Product added to cart!", [
      { text: "Continue Shopping", onPress: () => router.back() },
      { text: "View Cart", onPress: () => router.push("/cart") },
    ])
  }

  if (isLoading || !product) {
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      {/* Image Gallery */}
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: product.images?.[selectedImage] || "https://via.placeholder.com/400x400" }}
          style={styles.mainImage}
        />

        {product.images?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailScroll}
            contentContainerStyle={styles.thumbnailContent}
          >
            {product.images.map((img: string, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => setSelectedImage(idx)}>
                <Image
                  source={{ uri: img }}
                  style={[styles.thumbnail, selectedImage === idx && styles.thumbnailActive]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]}>{product.name}</Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, i) => (
              <Feather
                key={i}
                name="star"
                size={16}
                color={i < Math.floor(product.rating || 0) ? "#FFC107" : "#ddd"}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {product.rating || 0} ({product.reviews || 0} reviews)
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>
            ₹{product.base_price * (selectedSize?.price_multiplier ?? 1)}
          </Text>
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: isDark ? "#ccc" : "#666" }]}>{product.description}</Text>

        {/* Color Selection */}
        {product.colors?.length > 0 && (
          <View style={styles.optionSection}>
            <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Select Color</Text>
            <View style={styles.optionGrid}>
              {product.colors.map((color: ColorType) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.code },
                    selectedColor?.name === color.name && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor?.name === color.name && (
                    <Feather name="check" size={20} color={isDark ? "#000" : "#fff"} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Size Selection */}
        {product.sizes?.length > 0 && (
          <View style={styles.optionSection}>
            <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Select Size</Text>
            <View style={styles.sizeGrid}>
              {product.sizes.map((size: SizeType) => (
                <TouchableOpacity
                  key={size.name}
                  style={[
                    styles.sizeOption,
                    { backgroundColor: isDark ? "#222" : "#fff" },
                    selectedSize?.name === size.name && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, selectedSize?.name === size.name && { color: "#fff" }]}>
                    {size.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.quantitySection}>
          <Text style={[styles.optionTitle, { color: isDark ? "#fff" : "#000" }]}>Quantity</Text>
          <View style={[styles.quantityControl, { backgroundColor: isDark ? "#222" : "#fff" }]}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Feather name="minus" size={20} color="#FF6B35" />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: isDark ? "#fff" : "#000" }]}>{quantity}</Text>

            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Feather name="plus" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Feather name="shopping-cart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Customize Option */}
        <TouchableOpacity
          style={[styles.customizeButton, { borderColor: "#FF6B35" }]}
          onPress={() => router.push(`/customize/${product.id}`)}
        >
          <Feather name="pen-tool" size={20} color="#FF6B35" />
          <Text style={styles.customizeButtonText}>Customize This Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageGallery: { backgroundColor: "#fff" },
  mainImage: { width: "100%", aspectRatio: 1 },
  thumbnailScroll: { paddingVertical: 12 },
  thumbnailContent: { paddingHorizontal: 16 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 8, borderWidth: 2, borderColor: "transparent" },
  thumbnailActive: { borderColor: "#FF6B35" },
  content: { padding: 16 },
  productName: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  ratingStars: { flexDirection: "row", gap: 4 },
  ratingText: { fontSize: 13, color: "#999" },
  priceSection: { marginBottom: 16 },
  price: { fontSize: 28, fontWeight: "bold", color: "#FF6B35" },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  optionSection: { marginBottom: 20 },
  optionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  colorOption: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: "transparent" },
  colorOptionSelected: { borderColor: "#FF6B35" },
  sizeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sizeOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, minWidth: 60, alignItems: "center" },
  sizeOptionSelected: { backgroundColor: "#FF6B35" },
  sizeText: { fontWeight: "600", color: "#666" },
  quantitySection: { marginBottom: 20 },
  quantityControl: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  quantityText: { fontSize: 16, fontWeight: "bold" },
  addToCartButton: { backgroundColor: "#FF6B35", paddingVertical: 14, borderRadius: 8, alignItems: "center", justifyContent: "center", flexDirection: "row", marginBottom: 12 },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  customizeButton: { borderWidth: 2, paddingVertical: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  customizeButtonText: { color: "#FF6B35", fontSize: 16, fontWeight: "bold" },
})
