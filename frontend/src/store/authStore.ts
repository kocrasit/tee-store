import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'influencer' | 'designer' | 'admin';
  token: string;
  phoneNumber?: string;
  influencerProfile?: {
    bio?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
    bankAccount?: string;
    commissionRate: number;
    totalEarnings: number;
    monthlySales: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
