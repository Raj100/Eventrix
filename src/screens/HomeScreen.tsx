"use client"

import { useEffect } from "react"
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useProductStore } from "@/store"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { setProducts } = useProductStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  useEffect(() => {
    // Mock fetch products
    const mockProducts = [
      {
        id: "1",
        name: "Ceramic Mug",
        category: "mugs",
        price: 399,
        image: "https://via.placeholder.com/300",
        rating: 4.8,
        reviews: 234,
        description: "Premium ceramic mug",
      },
      {
        id: "2",
        name: "T-Shirt",
        category: "t-shirts",
        price: 599,
        image: "https://via.placeholder.com/300",
        rating: 4.6,
        reviews: 189,
        description: "100% cotton t-shirt",
      },
    ]
    setProducts(mockProducts)
  }, [])

  const categories = [
    { id: "mugs", name: "Mugs", icon: "coffee" },
    { id: "t-shirts", name: "T-Shirts", icon: "tag" },
    { id: "business-cards", name: "Cards", icon: "credit-card" },
    { id: "posters", name: "Posters", icon: "image" },
  ]

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Own Your Production</Text>
        <Text style={styles.bannerSubtitle}>Create stunning custom prints</Text>
        <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate("Products" as never)}>
          <Text style={styles.bannerButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: isDark ? "#222" : "#fff" }]}
              onPress={() => navigation.navigate("Products", { category: cat.id } as never)}
            >
              <Feather name={cat.icon as any} size={32} color="#FF6B35" />
              <Text style={[styles.categoryName, { color: isDark ? "#fff" : "#000" }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Trending</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Products" as never)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => navigation.navigate("ProductDetail", { id: item.toString() } as never)}
            >
              <View style={[styles.productCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
                <Image source={{ uri: "https://via.placeholder.com/180x200" }} style={styles.productImage} />
                <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]}>Product Name</Text>
                <Text style={styles.productPrice}>₹399</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("Customize" as never)}>
        <Text style={styles.ctaButtonText}>Design Your Own</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  banner: {
    margin: 16,
    padding: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#FF6B35",
    fontWeight: "bold",
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 16,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  productCard: {
    width: 180,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  ctaButton: {
    marginHorizontal: 16,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default HomeScreen
