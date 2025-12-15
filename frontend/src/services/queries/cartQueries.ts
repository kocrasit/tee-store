import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// Get cart
export function useCart(enabled = true) {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data;
    },
    enabled,
    staleTime: 0, // Her zaman fresh data
  });
}


