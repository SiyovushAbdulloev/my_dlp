import { type User } from '@/types/user.ts'
import { create } from 'zustand'

export interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User | null) => void
    fullName: () => string
  }
}

export const useAuthStore = create<AuthState>()((set, getState) => {
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      fullName: () => {
        const user = getState().auth.user
        if (user) {
          return `${user.last_name} ${user.first_name} ${user.last_name}`
        }

        return ''
      },
    },
  }
})
