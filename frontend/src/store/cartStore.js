import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      fetchCart: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get('/cart');
          set({ cart: data?.cart || null, loading: false });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      addItem: async (itemId) => {
        try {
          await api.post('/cart/add', { productId: itemId });
          // Always fetch the latest cart after any change
          await get().fetchCart();
        } catch (err) {
          set({ error: err.message });
        }
      },

      removeItem: async (itemId) => {
        try {
          await api.delete(`/cart/remove/${itemId}`);
          await get().fetchCart();
        } catch (err) {
          set({ error: err.message });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        try {
          await api.patch('/cart/update', { productId: itemId, quantity });
          await get().fetchCart();
        } catch (err) {
          set({ error: err.message });
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart/clear');
          set({ cart: null });
        } catch (err) {
          set({ error: err.message });
        }
      },
    }),
    { name: 'cart-storage' }
  )
);
