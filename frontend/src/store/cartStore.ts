import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  designId: string; // Reference to original design
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (newItem) => {
        const { items } = get();
        const existingItem = items.find(
          (item) =>
            item.id === newItem.id &&
            item.size === newItem.size &&
            item.color === newItem.color
        );

        let updatedItems;
        if (existingItem) {
          updatedItems = items.map((item) =>
            item.id === newItem.id &&
              item.size === newItem.size &&
              item.color === newItem.color
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updatedItems = [...items, newItem];
        }

        set({ items: updatedItems });

        try {
          const { useAuthStore } = await import('./authStore');
          const user = useAuthStore.getState().user;
          if (user) {
            const { default: api } = await import('@/api/axios');
            await api.post('/cart', {
              designId: newItem.designId,
              quantity: newItem.quantity,
              size: newItem.size,
              color: newItem.color,
              title: newItem.title,
              price: newItem.price,
              image: newItem.image
            });
          }
        } catch (error) {
          console.error('Failed to sync cart', error);
        }
      },

      removeItem: async (id, size, color) => {
        const { items } = get();
        const itemToRemove = items.find(i => i.id === id && i.size === size && i.color === color);

        set({
          items: items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        });

        try {
          const { useAuthStore } = await import('./authStore');
          const user = useAuthStore.getState().user;
          if (user && itemToRemove) {
            const { default: api } = await import('@/api/axios');
            const res = await api.get('/cart');
            const backendCart = res.data;
            const backendItem = backendCart.items.find((i: any) =>
              i.design === itemToRemove.designId && i.size === size && i.color === color
            );
            if (backendItem) {
              await api.delete(`/cart/${backendItem._id}`);
            }
          }
        } catch (error) {
          console.error('Failed to sync remove', error);
        }
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: async () => {
        set({ items: [] });
        try {
          const { useAuthStore } = await import('./authStore');
          const user = useAuthStore.getState().user;
          if (user) {
            const { default: api } = await import('@/api/axios');
            await api.delete('/cart');
          }
        } catch (error) {
          console.error('Failed to clear cart', error);
        }
      },

      setCart: (items) => set({ items }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // Save to localStorage
    }
  )
);
