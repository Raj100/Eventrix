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
  FlatList,
  TextInput,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, router } from "expo-router"

import { useProductStore } from "../store/useProductStore"

const ProductsScreen = () => {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>()

  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProductStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating" | "new">("new")

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        fetchCategories(),
        fetchProducts(0, 50, selectedCategory || undefined, searchQuery || undefined),
      ])
    } catch (error) {
      console.error("[ProductsScreen] Failed to load data:", error)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredProducts = selectedCategory
    ? products.filter((p: any) => p.category_id === selectedCategory)
    : products

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "new":
      default:
        return 0
    }
  })

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: isDark ? "#222" : "#fff" }]}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.images?.[0] || "https://via.placeholder.com/300x300" }}
          style={styles.productImage}
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Feather name="heart" size={18} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color="#FFC107" />
          <Text style={styles.rating}>{item.rating || 0}</Text>
          <Text style={styles.reviews}>({item.reviews || 0})</Text>
        </View>

        <Text style={styles.price}>₹{item.base_price}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      {/* Search */}
      <View style={styles.filterSection}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Feather name="search" size={18} color="#999" />
          <TextInput
            style={[styles.searchInput, { color: isDark ? "#fff" : "#000" }]}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedCategory && styles.filterButtonActive,
              { backgroundColor: !selectedCategory ? "#FF6B35" : isDark ? "#222" : "#fff" },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterButtonText, !selectedCategory && { color: "#fff" }]}>All</Text>
          </TouchableOpacity>

          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterButton,
                selectedCategory === cat.id && styles.filterButtonActive,
                { backgroundColor: selectedCategory === cat.id ? "#FF6B35" : isDark ? "#222" : "#fff" },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.filterButtonText, selectedCategory === cat.id && { color: "#fff" }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort */}
      <View style={styles.sortContainer}>
        {["new", "price-asc", "price-desc", "rating"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.sortOption, sortBy === type && styles.sortOptionActive]}
            onPress={() => setSortBy(type as any)}
          >
            <Text style={[styles.sortText, sortBy === type && styles.sortTextActive]}>
              {type === "new"
                ? "Newest"
                : type === "price-asc"
                ? "Price ↑"
                : type === "price-desc"
                ? "Price ↓"
                : "Rating"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FF6B35" size="large" />
        </View>
      ) : sortedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="package" size={48} color="#999" />
          <Text style={[styles.emptyText, { color: isDark ? "#999" : "#666" }]}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default ProductsScreen

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },

  categoryScroll: {
    marginTop: 4,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  filterButtonActive: {
    backgroundColor: "#FF6B35",
  },

  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  sortOptionActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },

  sortText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  sortTextActive: {
    color: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },

  listContent: {
    paddingBottom: 16,
  },

  productCard: {
    flex: 0.5,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },

  productImageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
  },

  productInfo: {
    padding: 10,
  },

  productName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },

  rating: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },

  reviews: {
    fontSize: 10,
    color: "#999",
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B35",
  },
})
