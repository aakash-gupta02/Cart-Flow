import zustand, { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            setUser: (userData) => set({ user: userData, error: null }),
            clearUser: () => set({ user: null, error: null }),
            setError: (message) => set({ error: message }),
            setLoading: (isLoading) => set({ loading: isLoading }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }), // only persist user, not error/loading
        }
    )
    
)