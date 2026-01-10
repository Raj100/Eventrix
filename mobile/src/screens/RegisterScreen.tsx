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
// import { useNavigation } from "@react-navigation/native"
// import { useUserStore } from "@/store"

// const RegisterScreen = () => {
//   const navigation = useNavigation()
//   const { register, isLoading, error, clearError } = useUserStore()
//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === "dark"

//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")

//   const handleRegister = async () => {
//     clearError()
//     if (!name || !email || !password || !confirmPassword) {
//       Alert.alert("Validation Error", "Please fill in all fields")
//       return
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Validation Error", "Passwords do not match")
//       return
//     }

//     if (password.length < 6) {
//       Alert.alert("Validation Error", "Password must be at least 6 characters long")
//       return
//     }

//     try {
//       await register(name, email, password)
//     } catch (err) {
//       Alert.alert("Registration Failed", error || "Please try again with different details")
//     }
//   }

//   return (
//     <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
//       <View style={styles.content}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>

//         <Text style={[styles.logo, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
//         <Text style={styles.subtitle}>Create Account</Text>

//         <View style={styles.formSection}>
//           <TextInput
//             style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
//             placeholder="Full Name"
//             placeholderTextColor={isDark ? "#666" : "#999"}
//             value={name}
//             onChangeText={setName}
//             editable={!isLoading}
//           />

//           <TextInput
//             style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
//             placeholder="Email"
//             placeholderTextColor={isDark ? "#666" : "#999"}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             editable={!isLoading}
//             autoCapitalize="none"
//           />

//           <TextInput
//             style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
//             placeholder="Password"
//             placeholderTextColor={isDark ? "#666" : "#999"}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             editable={!isLoading}
//           />

//           <TextInput
//             style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
//             placeholder="Confirm Password"
//             placeholderTextColor={isDark ? "#666" : "#999"}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry
//             editable={!isLoading}
//           />

//           <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
//             {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Sign Up</Text>}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.footer}>
//           <Text style={[styles.footerText, { color: isDark ? "#999" : "#666" }]}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
//             <Text style={styles.loginLink}>Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//   },
//   backButton: {
//     fontSize: 16,
//     color: "#FF6B35",
//     fontWeight: "bold",
//     marginBottom: 24,
//   },
//   logo: {
//     fontSize: 32,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: "#999",
//     textAlign: "center",
//     marginBottom: 32,
//   },
//   formSection: {
//     marginBottom: 24,
//   },
//   input: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   registerButton: {
//     backgroundColor: "#FF6B35",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   registerButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 14,
//   },
//   loginLink: {
//     color: "#FF6B35",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
// })

// export default RegisterScreen

import { useState, useEffect } from "react"
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
import { router } from "expo-router"
import { useUserStore } from "../store"

const RegisterScreen = () => {
  const { register, isLoading, error, clearError, user } = useUserStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // ✅ If already logged in, go to app
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)")
    }
  }, [user])

  const handleRegister = async () => {
    clearError()

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match")
      return
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long")
      return
    }

    try {
      await register(name, email, password)
      // redirect handled by useEffect
    } catch {
      Alert.alert("Registration Failed", error || "Please try again with different details")
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.logo, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
        <Text style={styles.subtitle}>Create Account</Text>

        <View style={styles.formSection}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
            placeholder="Full Name"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />

          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
            placeholder="Email"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
            placeholder="Password"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff", color: isDark ? "#fff" : "#000" }]}
            placeholder="Confirm Password"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? "#999" : "#666" }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
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
    flex: 1,
    padding: 24,
  },
  backButton: {
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "bold",
    marginBottom: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  formSection: {
    marginBottom: 24,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    color: "#FF6B35",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default RegisterScreen

