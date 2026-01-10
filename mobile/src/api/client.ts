// import { useUserStore } from "../store/useUserStore"

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.76.223:8000/api"

// class APIClient {
//   private baseURL: string

//   constructor(baseURL: string) {
//     this.baseURL = baseURL
//   }

//   private getAuthToken() {
//     return useUserStore.getState().accessToken
//   }

//   private async request<T>(
//     endpoint: string,
//     method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//     data?: any,
//     headers: Record<string, string> = {},
//   ): Promise<T> {
//     const token = this.getAuthToken()

//     const finalHeaders: Record<string, string> = {
//       "Content-Type": "application/json",
//       ...headers,
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     }

//     const config: RequestInit = {
//       method,
//       headers: finalHeaders,
//     }

//     if (data && (method === "POST" || method === "PUT")) {
//       config.body = JSON.stringify(data)
//     }

//     const response = await fetch(`${this.baseURL}${endpoint}`, config)

//     if (response.status === 401) {
//       const { refreshToken, logout } = useUserStore.getState()

//       const refreshed = await refreshToken()
//       if (refreshed) {
//         return this.request(endpoint, method, data, headers)
//       }

//       logout()
//       throw new Error("Unauthorized")
//     }

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ message: response.statusText }))
//       throw new Error(error.message || `HTTP Error: ${response.status}`)
//     }

//     return response.json()
//   }

//   // Auth
//   login(email: string, password: string) {
//     return this.request("/auth/login", "POST", { email, password })
//   }

//   register(name: string, email: string, password: string) {
//     return this.request("/auth/register", "POST", { name, email, password })
//   }

//   refreshToken(refreshToken: string) {
//     return this.request("/auth/refresh", "POST", { refresh_token: refreshToken })
//   }

//   getProfile() {
//     return this.request("/users/me")
//   }

//   updateProfile(data: any) {
//     return this.request("/users/me", "PUT", data)
//   }

//   // Products
//   getProducts(skip = 0, limit = 20, category?: string, search?: string) {
//     let url = `/products?skip=${skip}&limit=${limit}`
//     if (category) url += `&category_id=${category}`
//     if (search) url += `&search=${search}`
//     return this.request(url)
//   }

//   getProductById(id: string) {
//     return this.request(`/products/${id}`)
//   }

//   // Categories
//   getCategories() {
//     return this.request("/categories")
//   }

//   getCategoryById(id: string) {
//     return this.request(`/categories/${id}`)
//   }

//   // Templates
//   getTemplates(productType: string) {
//     return this.request(`/templates?product_type=${productType}`)
//   }

//   // Orders
//   getOrders() {
//     return this.request("/orders")
//   }

//   createOrder(orderData: any) {
//     return this.request("/orders", "POST", orderData)
//   }

//   getOrderById(id: string) {
//     return this.request(`/orders/${id}`)
//   }

//   // Payments
//   initializePayment(orderId: string, method: "razorpay" | "upi") {
//     return this.request("/payments/initialize", "POST", { order_id: orderId, payment_method: method })
//   }

//   verifyPayment(orderId: string, paymentId: string, signature: string) {
//     return this.request("/payments/verify", "POST", { order_id: orderId, payment_id: paymentId, signature })
//   }

//   getDeliveryCharge(pincode: string) {
//     return this.request(`/delivery/charge?pincode=${pincode}`)
//   }

//   // Banners
//   getBanners() {
//     return this.request("/banners/")
//   }

//   // Search
//   searchProducts(query: string) {
//     return this.request(`/products/search?query=${encodeURIComponent(query)}`)
//   }
// }

// export const apiClient = new APIClient(API_BASE_URL)

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.76.223:8000/api"

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { token?: string } = {},
  ): Promise<T> {
    const { token, ...fetchOptions } = options

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as any),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // ========== AUTH ==========
  login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  register(name: string, email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  refreshToken(refreshToken: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  getProfile(token: string) {
    return this.request("/auth/profile", { token })
  }

  updateProfile(data: any, token: string) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    })
  }

  // ========== PRODUCTS ==========
  getProducts(skip = 0, limit = 20, category?: string, search?: string) {
    let url = `/products?skip=${skip}&limit=${limit}`
    if (category) url += `&category_id=${category}`
    if (search) url += `&search=${search}`
    return this.request(url)
  }

  getProductById(id: string) {
    return this.request(`/products/${id}`)
  }

  // ========== CATEGORIES ==========
  getCategories() {
    return this.request("/categories")
  }

  // ========== ORDERS ==========
  createOrder(orderData: any, token: string) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
      token,
    })
  }

  getOrders(token: string) {
    return this.request("/orders", { token })
  }

  // ========== PAYMENTS ==========
  initializePayment(orderId: string, method: "razorpay" | "upi", token: string) {
    return this.request("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, payment_method: method }),
      token,
    })
  }

  verifyPayment(orderId: string, paymentId: string, signature: string, token: string) {
    return this.request(`/payments/verify/${orderId}`, {
      method: "POST",
      body: JSON.stringify({ payment_id: paymentId, signature }),
      token,
    })
  }

  // ========== DELIVERY ==========
  getDeliveryCharge(pincode: string) {
    return this.request(`/delivery/charges/${pincode}`)
  }

  // ========== BANNERS ==========
  getBanners() {
    return this.request("/banners/")
  }
}

export const apiClient = new APIClient(API_BASE_URL)
