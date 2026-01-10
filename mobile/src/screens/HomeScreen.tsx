// import { useState, useCallback } from "react"
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   useColorScheme,
//   ActivityIndicator,
//   TextInput,
// } from "react-native"
// import { useNavigation, useFocusEffect } from "@react-navigation/native"
// import { Feather } from "@expo/vector-icons"

// import { useProductStore } from "../store/useProductStore"
// import { useUserStore } from "../store/useUserStore"
// import { useCartStore } from "../store/useCartStore"
// import { apiClient } from "../api/client"

// interface Banner {
//   id: string
//   title: string
//   description: string
//   image: string
//   action_url?: string
//   discount?: number
//   image_url?: string 
// }

// const HomeScreen = () => {
//   const navigation = useNavigation<any>()

//   const { fetchCategories, fetchProducts, categories, products, isLoading } = useProductStore()
//   const { user } = useUserStore()
//   const { items } = useCartStore()

//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === "dark"

//   const [banners, setBanners] = useState<Banner[]>([])
//   const [bannersLoading, setBannersLoading] = useState(true)

//   const loadBanners = async () => {
//     try {
//       setBannersLoading(true)
//       const response: any = await apiClient.getBanners()
//       setBanners(response || [])
//     } catch (error) {
//       console.error("[HomeScreen] Failed to load banners:", error)
//     } finally {
//       setBannersLoading(false)
//     }
//   }

//   const loadData = async () => {
//     try {
//       await Promise.all([
//         fetchCategories(),
//         fetchProducts(0, 10),
//         loadBanners(),
//       ])
//     } catch (error) {
//       console.error("[HomeScreen] Failed to load data:", error)
//     }
//   }

//   useFocusEffect(
//     useCallback(() => {
//       loadData()
//     }, [])
//   )

//   return (
//     <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
//           <Text style={styles.headerSubtitle}>Exhibition & Studio</Text>
//         </View>

//         <View style={styles.headerIcons}>
//           <TouchableOpacity
//             style={styles.iconButton}
//             onPress={() => navigation.navigate("CartTab", { screen: "CartMain" })}
//           >
//             <Feather name="bell" size={24} color={isDark ? "#fff" : "#000"} />
//             {items.length > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{items.length}</Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.iconButton}>
//             <Feather name="moon" size={24} color={isDark ? "#fff" : "#000"} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Feather name="search" size={20} color="#999" />
//         <TextInput
//           style={[styles.searchInput, { color: isDark ? "#fff" : "#000" }]}
//           placeholder="Search products, templates..."
//           placeholderTextColor="#999"
//         />
//       </View>

//       {/* Banners */}
//       {bannersLoading ? (
//         <View style={styles.bannerLoading}>
//           <ActivityIndicator color="#FF6B35" size="large" />
//         </View>
//       ) : banners.length > 0 ? (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
//           {banners.map((banner) => (
//             <TouchableOpacity key={banner.id} style={[styles.banner, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//               <Image source={{ uri: banner.image_url }} style={styles.bannerImage} />
//               <View style={styles.bannerContent}>
//                 <Text style={styles.bannerTitle}>{banner.title}</Text>
//                 <Text style={styles.bannerDescription}>{banner.description}</Text>
//                 {banner.discount && <Text style={styles.bannerDiscount}>Up to {banner.discount}% OFF</Text>}
//                 <TouchableOpacity style={styles.bannerButton}>
//                   <Text style={styles.bannerButtonText}>Shop Now</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       ) : null}

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Feather name="package" size={32} color="#FF6B35" />
//           <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>500+</Text>
//           <Text style={styles.statLabel}>Products</Text>
//         </View>

//         <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Feather name="award" size={32} color="#FF6B35" />
//           <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>50K+</Text>
//           <Text style={styles.statLabel}>Orders</Text>
//         </View>

//         <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Feather name="truck" size={32} color="#FF6B35" />
//           <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>24h</Text>
//           <Text style={styles.statLabel}>Delivery</Text>
//         </View>
//       </View>

//       {/* Categories */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Categories</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("HomeTab", { screen: "Products" })}>
//             <Text style={styles.seeAll}>View All</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat.id}
//               style={[styles.categoryCard, { backgroundColor: isDark ? "#222" : "#fff" }]}
//               onPress={() =>
//                 navigation.navigate("HomeTab", {
//                   screen: "Products",
//                   params: { categoryId: cat.id },
//                 })
//               }
//             >
//               <Image source={{ uri: cat.icon }} style={styles.categoryIcon} />
//               <Text style={[styles.categoryName, { color: isDark ? "#fff" : "#000" }]}>{cat.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Trending Products */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Trending Products</Text>
//           <TouchableOpacity onPress={() => navigation.navigate("HomeTab", { screen: "Products" })}>
//             <Text style={styles.seeAll}>See All</Text>
//           </TouchableOpacity>
//         </View>

//         {isLoading ? (
//           <ActivityIndicator color="#FF6B35" size="large" />
//         ) : (
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {products.slice(0, 6).map((product) => (
//               <TouchableOpacity
//                 key={product.id}
//                 onPress={() =>
//                   navigation.navigate("HomeTab", {
//                     screen: "ProductDetail",
//                     params: { id: product.id },
//                   })
//                 }
//               >
//                 <View style={[styles.productCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//                   <Image
//                     source={{ uri: product.images?.[0] || "https://via.placeholder.com/180x200" }}
//                     style={styles.productImage}
//                   />
//                   <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]}>{product.name}</Text>
//                   <Text style={styles.productPrice}>₹{product.price}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}
//       </View>

//       {/* CTA */}
//       <TouchableOpacity
//         style={styles.ctaButton}
//         onPress={() => navigation.navigate("HomeTab", { screen: "Customize" })}
//       >
//         <Feather name="pen-tool" size={20} color="#fff" style={{ marginRight: 8 }} />
//         <Text style={styles.ctaButtonText}>Design Your Own</Text>
//       </TouchableOpacity>

//       <View style={{ height: 20 }} />
//     </ScrollView>
//   )
// }

// /* ========================= STYLES ========================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 8,
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   headerSubtitle: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 2,
//   },

//   headerIcons: {
//     flexDirection: "row",
//     gap: 12,
//   },

//   iconButton: {
//     position: "relative",
//   },

//   badge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#FF6B35",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   badgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },

//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//   },

//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 14,
//   },

//   bannerScroll: {
//     marginHorizontal: 16,
//     // paddingHorizontal: 16,
//   },

//   bannerLoading: {
//     height: 200,
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 16,
//   },

//   banner: {
//     width: 320,
//     height: 200,
//     borderRadius: 12,
//     marginRight: 12,
//     overflow: "hidden",
//     flexDirection: "row",
//   },

//   // bannerImage: {
//   //   width: "full",
//   //   height: "100%",
//   //   overflow: "hidden",
//   //   position: "absolute",
//   // },
//   bannerImage: {
//   width: '100%', 
//   height: '100%',
  
//   overflow: 'hidden',
//   position: 'absolute',
  
//   top: 0,
//   left: 0,
// },

//   bannerContent: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//   },

//   bannerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 4,
//   },

//   bannerDescription: {
//     fontSize: 12,
//     color: "#ccc",
//     marginBottom: 8,
//   },

//   bannerDiscount: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#FF6B35",
//     marginBottom: 8,
//   },

//   bannerButton: {
//     backgroundColor: "#FF6B35",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     alignSelf: "flex-start",
//   },

//   bannerButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 12,
//   },

//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginVertical: 16,
//     gap: 12,
//   },

//   statCard: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   statNumber: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 8,
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 4,
//   },

//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   seeAll: {
//     color: "#FF6B35",
//     fontWeight: "bold",
//     fontSize: 14,
//   },

//   categoryScroll: {
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },

//   categoryCard: {
//     width: 100,
//     padding: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginRight: 12,
//   },

//   categoryIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginBottom: 8,
//   },

//   categoryName: {
//     fontSize: 12,
//     fontWeight: "600",
//     textAlign: "center",
//   },

//   productCard: {
//     width: 160,
//     borderRadius: 12,
//     marginRight: 12,
//     overflow: "hidden",
//   },

//   productImage: {
//     width: "100%",
//     height: 160,
//   },

//   productName: {
//     fontSize: 13,
//     fontWeight: "bold",
//     padding: 8,
//   },

//   productPrice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#FF6B35",
//     paddingHorizontal: 8,
//     paddingBottom: 8,
//   },

//   ctaButton: {
//     marginHorizontal: 16,
//     backgroundColor: "#FF6B35",
//     paddingVertical: 14,
//     borderRadius: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },

//   ctaButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default HomeScreen


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
} from "react-native"
// Updated imports for Expo Router
import { useRouter, useFocusEffect } from "expo-router"
import { Feather } from "@expo/vector-icons"

import { useProductStore } from "../store/useProductStore"
import { useUserStore } from "../store/useUserStore"
import { useCartStore } from "../store/useCartStore"
import { apiClient } from "../api/client"

interface Banner {
  id: string
  title: string
  description: string
  image: string
  action_url?: string
  discount?: number
  image_url?: string 
}

const HomeScreen = () => {
  // Use Expo Router's router instead of navigation
  const router = useRouter()

  const { fetchCategories, fetchProducts, categories, products, isLoading } = useProductStore()
  const { user } = useUserStore()
  const { items } = useCartStore()

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [banners, setBanners] = useState<Banner[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)

  const loadBanners = async () => {
    try {
      setBannersLoading(true)
      const response: any = await apiClient.getBanners()
      setBanners(response || [])
    } catch (error) {
      console.error("[HomeScreen] Failed to load banners:", error)
    } finally {
      setBannersLoading(false)
    }
  }

  const loadData = async () => {
    try {
      await Promise.all([
        fetchCategories(),
        fetchProducts(0, 10),
        loadBanners(),
      ])
    } catch (error) {
      console.error("[HomeScreen] Failed to load data:", error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
          <Text style={styles.headerSubtitle}>Exhibition & Studio</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cart")}
          >
            <Feather name="bell" size={24} color={isDark ? "#fff" : "#000"} />
            {items.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{items.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Feather name="moon" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" />
        <TextInput
          style={[styles.searchInput, { color: isDark ? "#fff" : "#000" }]}
          placeholder="Search products, templates..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Banners */}
      {bannersLoading ? (
        <View style={styles.bannerLoading}>
          <ActivityIndicator color="#FF6B35" size="large" />
        </View>
      ) : banners.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
          {banners.map((banner) => (
            <TouchableOpacity key={banner.id} style={[styles.banner, { backgroundColor: isDark ? "#222" : "#fff" }]}>
              {/* Ensure you use the correct URL property here */}
              <Image 
                source={{ uri: banner.image_url || banner.image }} 
                style={styles.bannerImage} 
                resizeMode="cover"
              />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerDescription}>{banner.description}</Text>
                {banner.discount && <Text style={styles.bannerDiscount}>Up to {banner.discount}% OFF</Text>}
                <TouchableOpacity style={styles.bannerButton} onPress={() => router.push("/products")}>
                  <Text style={styles.bannerButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Feather name="package" size={32} color="#FF6B35" />
          <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>500+</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Feather name="award" size={32} color="#FF6B35" />
          <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>50K+</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Feather name="truck" size={32} color="#FF6B35" />
          <Text style={[styles.statNumber, { color: isDark ? "#fff" : "#000" }]}>24h</Text>
          <Text style={styles.statLabel}>Delivery</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/products")}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: isDark ? "#222" : "#fff" }]}
              onPress={() => router.push({ pathname: "/products", params: { categoryId: cat.id } })}
            >
              <Image source={{ uri: cat.icon }} style={styles.categoryIcon} />
              <Text style={[styles.categoryName, { color: isDark ? "#fff" : "#000" }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Trending Products</Text>
          <TouchableOpacity onPress={() => router.push("/products")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#FF6B35" size="large" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.slice(0, 6).map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })}
              >
                <View style={[styles.productCard, { backgroundColor: isDark ? "#222" : "#fff" }]}>
                  <Image
                    source={{ uri: product.images?.[0] || "https://via.placeholder.com/180x200" }}
                    style={styles.productImage}
                  />
                  <Text style={[styles.productName, { color: isDark ? "#fff" : "#000" }]}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => router.push("/customize")}
      >
        <Feather name="pen-tool" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.ctaButtonText}>Design Your Own</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },
  headerIcons: { flexDirection: "row", gap: 12 },
  iconButton: { position: "relative" },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  bannerScroll: { marginHorizontal: 16 },
  bannerLoading: { height: 200, justifyContent: "center", alignItems: "center", marginVertical: 16 },
  banner: {
    width: 320,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    position: 'relative'
  },
  bannerImage: {
    width: '100%', 
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bannerContent: { flex: 1, padding: 16, justifyContent: "center", backgroundColor: 'rgba(0,0,0,0.3)' },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  bannerDescription: { fontSize: 12, color: "#ccc", marginBottom: 8 },
  bannerDiscount: { fontSize: 14, fontWeight: "bold", color: "#FF6B35", marginBottom: 8 },
  bannerButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  bannerButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginVertical: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  statLabel: { fontSize: 12, color: "#999", marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#FF6B35", fontWeight: "bold", fontSize: 14 },
  categoryScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  categoryCard: { width: 100, padding: 12, borderRadius: 12, alignItems: "center", marginRight: 12 },
  categoryIcon: { width: 50, height: 50, borderRadius: 8, marginBottom: 8 },
  categoryName: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  productCard: { width: 160, borderRadius: 12, marginRight: 12, overflow: "hidden" },
  productImage: { width: "100%", height: 160 },
  productName: { fontSize: 13, fontWeight: "bold", padding: 8 },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#FF6B35", paddingHorizontal: 8, paddingBottom: 8 },
  ctaButton: {
    marginHorizontal: 16,
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ctaButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
})

export default HomeScreen