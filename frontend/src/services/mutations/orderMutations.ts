import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { orderKeys } from '../queries/orderQueries';
import { cartKeys } from '../queries/cartQueries';

interface CreateOrderInput {
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentInfo?: {
    id?: string;
    status?: string;
  };
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const res = await api.post('/orders', input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

// Update order status (admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
    },
  });
}


