import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  myOrders: () => [...orderKeys.all, 'my'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
};

// Get user's orders
export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: async () => {
      const res = await api.get('/orders/myorders');
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
  });
}

// Get single order
export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    },
    enabled: enabled && !!id,
  });
}

// Get all orders (admin)
export function useAdminOrders() {
  return useQuery({
    queryKey: orderKeys.admin(),
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}



