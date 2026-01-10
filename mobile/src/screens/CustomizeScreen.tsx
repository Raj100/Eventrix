// "use client"

// import { useEffect, useState } from "react"
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   ActivityIndicator,
//   TextInput,
//   Image,
// } from "react-native"
// import { useRoute, useNavigation } from "@react-navigation/native"
// import { Feather } from "@expo/vector-icons"
// import { useProductStore, useCartStore } from "@/store"

// interface Template {
//   id: string
//   name: string
//   image: string
//   price_addition: number
// }

// const CustomizeScreen = () => {
//   const navigation = useNavigation<any>()
//   const route = useRoute<any>()
//   const { fetchTemplates } = useProductStore()
//   const { addItem } = useCartStore()
//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === "dark"

//   const [templates, setTemplates] = useState<Template[]>([])
//   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
//   const [textInput, setTextInput] = useState("")
//   const [textColor, setTextColor] = useState("#000000")
//   const [fontSize, setFontSize] = useState("24")
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     loadTemplates()
//   }, [])

//   const loadTemplates = async () => {
//     setLoading(true)
//     try {
//       const response = await fetchTemplates("mug")
//       setTemplates(response || [])
//       if (response?.length > 0) {
//         setSelectedTemplate(response[0].id)
//       }
//     } catch (error) {
//       console.error("Failed to load templates:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddToCart = () => {
//     if (!selectedTemplate || !textInput) {
//       alert("Please select a template and enter text")
//       return
//     }

//     const template = templates.find((t) => t.id === selectedTemplate)
//     if (!template) return

//     addItem({
//       id: `custom-${Date.now()}`,
//       name: `Custom Design - ${template.name}`,
//       price: 499 + template.price_addition,
//       quantity: 1,
//       image: template.image,
//       color: textColor,
//       size: fontSize,
//     })

//     alert("Custom design added to cart!")
//     navigation.goBack()
//   }

//   if (loading) {
//     return (
//       <View style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7", justifyContent: "center" }]}>
//         <ActivityIndicator color="#FF6B35" size="large" />
//       </View>
//     )
//   }

//   const selectedTemplateData = templates.find((t) => t.id === selectedTemplate)

//   return (
//     <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
//       <View style={styles.content}>
//         {/* Preview */}
//         <View style={[styles.previewSection, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Text style={[styles.previewTitle, { color: isDark ? "#fff" : "#000" }]}>Preview</Text>
//           {selectedTemplateData && (
//             <View style={styles.previewContainer}>
//               <Image source={{ uri: selectedTemplateData.image }} style={styles.previewImage} />
//               <View style={styles.textOverlay}>
//                 <Text
//                   style={[
//                     styles.previewText,
//                     {
//                       color: textColor,
//                       fontSize: Number.parseInt(fontSize),
//                     },
//                   ]}
//                 >
//                   {textInput || "Your Text Here"}
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Template Selection */}
//         <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Choose Template</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
//             {templates.map((template) => (
//               <TouchableOpacity
//                 key={template.id}
//                 style={[styles.templateCard, selectedTemplate === template.id && styles.templateCardSelected]}
//                 onPress={() => setSelectedTemplate(template.id)}
//               >
//                 <Image source={{ uri: template.image }} style={styles.templateImage} />
//                 <Text style={styles.templateName} numberOfLines={1}>
//                   {template.name}
//                 </Text>
//                 <Text style={styles.templatePrice}>+₹{template.price_addition}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Customization */}
//         <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
//           <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Customize Design</Text>

//           <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Text</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: isDark ? "#333" : "#f5f5f5", color: isDark ? "#fff" : "#000" }]}
//             placeholder="Enter your text"
//             placeholderTextColor={isDark ? "#999" : "#aaa"}
//             value={textInput}
//             onChangeText={setTextInput}
//             maxLength={50}
//           />

//           <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Text Color</Text>
//           <View style={styles.colorPicker}>
//             {["#000000", "#FFFFFF", "#FF6B35", "#3B82F6", "#22C55E", "#FFC107"].map((color) => (
//               <TouchableOpacity
//                 key={color}
//                 style={[
//                   styles.colorOption,
//                   { backgroundColor: color },
//                   textColor === color && styles.colorOptionSelected,
//                 ]}
//                 onPress={() => setTextColor(color)}
//               >
//                 {textColor === color && (
//                   <Feather name="check" size={16} color={color === "#FFFFFF" ? "#000" : "#fff"} />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Font Size: {fontSize}px</Text>
//           <View style={styles.fontSizeControl}>
//             {["18", "24", "32", "40"].map((size) => (
//               <TouchableOpacity
//                 key={size}
//                 style={[styles.fontSizeButton, fontSize === size && styles.fontSizeButtonSelected]}
//                 onPress={() => setFontSize(size)}
//               >
//                 <Text style={[styles.fontSizeButtonText, fontSize === size && styles.fontSizeButtonTextSelected]}>
//                   {size}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Add to Cart */}
//         <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
//           <Feather name="shopping-cart" size={20} color="#fff" style={{ marginRight: 8 }} />
//           <Text style={styles.addButtonText}>Add Custom Design to Cart</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   previewSection: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   previewTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   previewContainer: {
//     position: "relative",
//     height: 300,
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   previewImage: {
//     width: "100%",
//     height: "100%",
//   },
//   textOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   previewText: {
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   section: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   templateScroll: {
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },
//   templateCard: {
//     width: 100,
//     marginRight: 12,
//     borderRadius: 8,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   templateCardSelected: {
//     borderColor: "#FF6B35",
//   },
//   templateImage: {
//     width: "100%",
//     height: 100,
//   },
//   templateName: {
//     padding: 6,
//     fontSize: 11,
//     fontWeight: "600",
//     backgroundColor: "#f5f5f5",
//     textAlign: "center",
//   },
//   templatePrice: {
//     padding: 4,
//     fontSize: 10,
//     color: "#FF6B35",
//     textAlign: "center",
//     backgroundColor: "#fff",
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   input: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 14,
//   },
//   colorPicker: {
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 16,
//   },
//   colorOption: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     borderWidth: 3,
//     borderColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   colorOptionSelected: {
//     borderColor: "#000",
//   },
//   fontSizeControl: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   fontSizeButton: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: "#f5f5f5",
//     alignItems: "center",
//   },
//   fontSizeButtonSelected: {
//     backgroundColor: "#FF6B35",
//   },
//   fontSizeButtonText: {
//     color: "#666",
//     fontWeight: "600",
//   },
//   fontSizeButtonTextSelected: {
//     color: "#fff",
//   },
//   addButton: {
//     backgroundColor: "#FF6B35",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   addButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default CustomizeScreen




import { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, router } from "expo-router"

import { useCartStore } from "../store/useCartStore"
import { apiClient } from "../api/client"

interface Template {
  id: string
  name: string
  image: string
  price_addition: number
}

const CustomizeScreen = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>()
  const { addItem } = useCartStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [fontSize, setFontSize] = useState("24")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      loadTemplates()
    }
  }, [productId])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      // 🔥 Correct API usage
      const response: any = await apiClient.getTemplates(productId)
      setTemplates(response || [])

      if (response?.length > 0) {
        setSelectedTemplateId(response[0].id)
      }
    } catch (error) {
      console.error("[CustomizeScreen] Failed to load templates:", error)
      Alert.alert("Error", "Failed to load design templates")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedTemplateId || !textInput.trim()) {
      Alert.alert("Missing Info", "Please select a template and enter your text")
      return
    }

    const template = templates.find((t) => t.id === selectedTemplateId)
    if (!template) {
      Alert.alert("Error", "Invalid template selected")
      return
    }

    addItem({
      id: `custom-${productId}-${selectedTemplateId}-${Date.now()}`,
      name: `Custom Design - ${template.name}`,
      price: template.price_addition,
      quantity: 1,
      image: template.image,
      color: textColor,
      size: fontSize,
    })

    Alert.alert("Success", "Custom design added to cart!", [
      {
        text: "Continue Shopping",
        onPress: () => router.back(),
      },
      {
        text: "Go to Cart",
        onPress: () => router.push("/cart"),
      },
    ])
  }

  if (loading) {
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

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        {/* Preview */}
        <View style={[styles.previewSection, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.previewTitle, { color: isDark ? "#fff" : "#000" }]}>Preview</Text>

          {selectedTemplate && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedTemplate.image || "https://via.placeholder.com/300" }}
                style={styles.previewImage}
              />
              <View style={styles.textOverlay}>
                <Text
                  style={[
                    styles.previewText,
                    {
                      color: textColor,
                      fontSize: Number(fontSize),
                    },
                  ]}
                >
                  {textInput || "Your Text Here"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Template Selection */}
        <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Choose Template</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplateId === template.id && styles.templateCardSelected,
                ]}
                onPress={() => setSelectedTemplateId(template.id)}
              >
                <Image
                  source={{ uri: template.image || "https://via.placeholder.com/100" }}
                  style={styles.templateImage}
                />
                <Text style={styles.templateName} numberOfLines={1}>
                  {template.name}
                </Text>
                <Text style={styles.templatePrice}>+₹{template.price_addition}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Customization */}
        <View style={[styles.section, { backgroundColor: isDark ? "#222" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Customize Design</Text>

          <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Text</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#333" : "#f5f5f5",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder="Enter your text"
            placeholderTextColor={isDark ? "#999" : "#aaa"}
            value={textInput}
            onChangeText={setTextInput}
            maxLength={50}
          />

          <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>Text Color</Text>
          <View style={styles.colorPicker}>
            {["#000000", "#FFFFFF", "#FF6B35", "#3B82F6", "#22C55E", "#FFC107"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  textColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setTextColor(color)}
              >
                {textColor === color && (
                  <Feather name="check" size={16} color={color === "#FFFFFF" ? "#000" : "#fff"} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.inputLabel, { color: isDark ? "#fff" : "#000" }]}>
            Font Size: {fontSize}px
          </Text>
          <View style={styles.fontSizeControl}>
            {["18", "24", "32", "40"].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  fontSize === size && styles.fontSizeButtonSelected,
                ]}
                onPress={() => setFontSize(size)}
              >
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    fontSize === size && styles.fontSizeButtonTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Feather name="shopping-cart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Add Custom Design to Cart</Text>
        </TouchableOpacity>
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
  previewSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  previewContainer: {
    position: "relative",
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  templateScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  templateCard: {
    width: 100,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  templateCardSelected: {
    borderColor: "#FF6B35",
  },
  templateImage: {
    width: "100%",
    height: 100,
  },
  templateName: {
    padding: 6,
    fontSize: 11,
    fontWeight: "600",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  templatePrice: {
    padding: 4,
    fontSize: 10,
    color: "#FF6B35",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  colorPicker: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionSelected: {
    borderColor: "#000",
  },
  fontSizeControl: {
    flexDirection: "row",
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  fontSizeButtonSelected: {
    backgroundColor: "#FF6B35",
  },
  fontSizeButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  fontSizeButtonTextSelected: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CustomizeScreen
