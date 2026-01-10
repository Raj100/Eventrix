// import { create } from "zustand"
// import { persist } from "zustand/middleware"
// import { apiClient } from "../api/client"

// export interface User {
//   id: string
//   name: string
//   email: string
//   phone?: string
//   address?: string
//   city?: string
//   state?: string
//   pincode?: string
//   avatar?: string
//   role: "user" | "admin" | "designer"
//   email_notifications?: boolean
//   sms_notifications?: boolean
//   created_at?: string
// }

// interface UserStore {
//   user: User | null
//   accessToken: string | null
//   refreshToken: string | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null

//   // Actions
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
//   fetchProfile: () => Promise<void>
//   updateProfile: (userData: Partial<User>) => Promise<void>
//   refreshToken: () => Promise<boolean>
//   setUser: (user: User) => void
//   clearError: () => void
// }

// export const useUserStore = create<UserStore>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       login: async (email: string, password: string) => {
//         set({ isLoading: true, error: null })
//         try {
//           const response: any = await apiClient.login(email, password)
//           const profileData: any = await apiClient.getProfile()
//           set({
//             accessToken: response.access_token,
//             refreshToken: response.refresh_token,
//             user: profileData,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//         } catch (error) {
//           const errorMsg = error instanceof Error ? error.message : "Login failed"
//           set({
//             error: errorMsg,
//             isLoading: false,
//           })
//           throw error
//         }
//       },

//       register: async (name: string, email: string, password: string) => {
//         set({ isLoading: true, error: null })
//         try {
//           const response: any = await apiClient.register(name, email, password)
//           const profileData: any = await apiClient.getProfile()
//           set({
//             accessToken: response.access_token,
//             refreshToken: response.refresh_token,
//             user: profileData,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//         } catch (error) {
//           const errorMsg = error instanceof Error ? error.message : "Registration failed"
//           set({
//             error: errorMsg,
//             isLoading: false,
//           })
//           throw error
//         }
//       },

//       logout: () => {
//         set({
//           user: null,
//           accessToken: null,
//           refreshToken: null,
//           isAuthenticated: false,
//           error: null,
//         })
//       },

//       fetchProfile: async () => {
//         set({ isLoading: true })
//         try {
//           const profile: any = await apiClient.getProfile()
//           set({ user: profile, isLoading: false })
//         } catch (error) {
//           console.error("Failed to fetch profile:", error)
//           set({ isLoading: false })
//         }
//       },

//       updateProfile: async (userData: Partial<User>) => {
//         set({ isLoading: true, error: null })
//         try {
//           const updated: any = await apiClient.updateProfile(userData)
//           set({ user: updated, isLoading: false })
//         } catch (error) {
//           const errorMsg = error instanceof Error ? error.message : "Update failed"
//           set({ error: errorMsg, isLoading: false })
//           throw error
//         }
//       },

//       refreshToken: async () => {
//         const state = get()
//         if (!state.refreshToken) return false
//         try {
//           const response: any = await apiClient.refreshToken(state.refreshToken)
//           set({ accessToken: response.access_token })
//           return true
//         } catch {
//           set({ isAuthenticated: false })
//           return false
//         }
//       },

//       setUser: (user) => set({ user, isAuthenticated: true }),

//       clearError: () => set({ error: null }),
//     }),
//     {
//       name: "eventrix-user",
//     },
//   ),
// )

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiClient } from "../api/client"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  avatar?: string
  role: "user" | "admin" | "designer"
  email_notifications?: boolean
  sms_notifications?: boolean
  created_at?: string
}

interface UserStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshAccessToken: () => Promise<boolean>
  clearError: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res: any = await apiClient.login(email, password)

          const profile: any = await apiClient.getProfile(res.access_token)

          set({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err: any) {
          set({
            error: err?.message || "Login failed",
            isLoading: false,
          })
          throw err
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res: any = await apiClient.register(name, email, password)
          const profile: any = await apiClient.getProfile(res.access_token)

          set({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err: any) {
          set({
            error: err?.message || "Registration failed",
            isLoading: false,
          })
          throw err
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      fetchProfile: async () => {
        const token = get().accessToken
        if (!token) return
        try {
          const profile: any = await apiClient.getProfile(token)
          set({ user: profile })
        } catch (err) {
          console.log("fetchProfile error", err)
        }
      },

      updateProfile: async (data) => {
        const token = get().accessToken
        if (!token) throw new Error("Not authenticated")

        set({ isLoading: true, error: null })
        try {
          const updated: any = await apiClient.updateProfile(data, token)
          set({ user: updated, isLoading: false })
        } catch (err: any) {
          set({
            error: err?.message || "Update failed",
            isLoading: false,
          })
          throw err
        }
      },

      refreshAccessToken: async () => {
        const state = get()
        if (!state.refreshToken) return false

        try {
          const res: any = await apiClient.refreshToken(state.refreshToken)
          set({ accessToken: res.access_token })
          return true
        } catch {
          set({ isAuthenticated: false })
          return false
        }
      },
    }),
    {
      name: "eventrix-user",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
