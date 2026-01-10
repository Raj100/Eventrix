// import { create } from "zustand"
// import { persist } from "zustand/middleware"
// import { apiClient } from "../api/client"

// interface AuthState {
//   accessToken: string | null
//   refreshToken: string | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null

//   // Actions
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
//   refreshAccessToken: () => Promise<boolean>
//   clearError: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       login: async (email, password) => {
//         set({ isLoading: true, error: null })
//         try {
//           const response: any = await apiClient.login(email, password)
//           set({
//             accessToken: response.access_token,
//             refreshToken: response.refresh_token,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Login failed",
//             isLoading: false,
//           })
//           throw error
//         }
//       },

//       register: async (name, email, password) => {
//         set({ isLoading: true, error: null })
//         try {
//           const response: any = await apiClient.register(name, email, password)
//           set({
//             accessToken: response.access_token,
//             refreshToken: response.refresh_token,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Registration failed",
//             isLoading: false,
//           })
//           throw error
//         }
//       },

//       logout: () => {
//         set({
//           accessToken: null,
//           refreshToken: null,
//           isAuthenticated: false,
//           error: null,
//         })
//       },

//       refreshAccessToken: async () => {
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

//       clearError: () => set({ error: null }),
//     }),
//     {
//       name: "eventrix-auth",
//     },
//   ),
// )
