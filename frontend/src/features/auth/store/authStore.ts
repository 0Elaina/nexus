import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  // 是否处于工坊管理模式（博主登录后可自由在“工坊管理”与“访客预览”间切换）
  isAuthorMode: boolean
  setToken: (token: string, username?: string) => void
  toggleAuthorMode: () => void
  setAuthorMode: (enabled: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,
      isAuthorMode: true,
      setToken: (token, username) =>
        set({ token, username: username || 'Admin', isAuthenticated: true, isAuthorMode: true }),
      toggleAuthorMode: () =>
        set((state) => ({ isAuthorMode: !state.isAuthorMode })),
      setAuthorMode: (enabled) => set({ isAuthorMode: enabled }),
      clearAuth: () => set({ token: null, username: null, isAuthenticated: false, isAuthorMode: false }),
    }),
    {
      name: 'nexus-auth-storage',
    }
  )
)
