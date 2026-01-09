"use client"

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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useUserStore } from "@/store"

const LoginScreen = () => {
  const navigation = useNavigation()
  const { setUser, setToken } = useUserStore()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      // Mock login
      setTimeout(() => {
        setUser({
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email,
          phone: "+91 9876543210",
        })
        setToken("mock-jwt-token")
        setLoading(false)
      }, 1500)
    } catch (error) {
      alert("Login failed")
      setLoading(false)
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7" }]}>
      <View style={styles.content}>
        <Text style={[styles.logo, { color: isDark ? "#fff" : "#000" }]}>Eventrix</Text>
        <Text style={styles.subtitle}>Welcome Back</Text>

        <View style={styles.formSection}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff" }]}
            placeholder="Email"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#222" : "#fff" }]}
            placeholder="Password"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <Text style={[styles.dividerText, { color: isDark ? "#666" : "#999" }]}>or</Text>
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Login with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? "#999" : "#666" }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
            <Text style={styles.registerLink}>Sign Up</Text>
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
    justifyContent: "center",
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
  loginButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerText: {
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  socialButtonText: {
    color: "#FF6B35",
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
  registerLink: {
    color: "#FF6B35",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default LoginScreen
